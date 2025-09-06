---
title: "Flutter App Android 백화 현상 해결"
date: "2025-09-06"
bookmark: true
tags:
    - Flutter
    - Dart
    - Android
---

## 백그라운드 / 포그라운드 상태 디버깅

`MyApp` 클래스는 `StatelessWidget` 추상 클래스를 상속받고 있다.
`StatefulWidget`가 아닌 `StatelessWidget` 추상 클래스를 상속받고 있는지 궁금했다.

> 선임에게 물어본 바로는 우리 WebView 방식의 제품을 개발하고 있고, 플러터 프레임워크는 APP 환경에서의 특정 기능을 제공하기 위해 감싼 형태로 사용자에게 서비스하고 있다.
> 따라서 Widget이 다시 그려질 케이스가 많이 없을 것이다.

일단 백그라운드/포그라운드 전환 과정을 디버깅하기 위해서 `WidgetsBindingObserver`를 통해 lifecycle을 감지하려고 한다.

그러기 위해서는 `StatefulWidget` 추상 클래스를 상속받는 방식으로 임시 변경하여 디버깅해보려고 한다.

### 이유

`WidgetsBindingObserver`는 `State` 객체에서만 사용할 수 있습니다

`StatelessWidget은` 상태가 없으므로 lifecycle 메서드들을 가지지 않습니다

`initState()`, `dispose()` 등이 없어서 observer를 등록/해제할 수 없습니다

### 해결 방법

#### 1. `StatefulWidget`으로 변경 (권장)

```dart
class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> with WidgetsBindingObserver {
  AppLifecycleState _appLifecycleState = AppLifecycleState.resumed;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    setState(() {
      _appLifecycleState = state;
    });
    print('앱 상태 변경: $state');
    
    // 상태에 따른 로직 처리
    switch (state) {
      case AppLifecycleState.resumed:
        print('앱이 활성화됨');
        break;
      case AppLifecycleState.paused:
        print('앱이 일시정지됨');
        break;
      case AppLifecycleState.detached:
        print('앱이 종료됨');
        break;
      case AppLifecycleState.inactive:
        print('앱이 비활성화됨');
        break;
      case AppLifecycleState.hidden:
        print('앱이 숨겨짐');
        break;
    }
  }

  String? myInitRoute() {
    //...
  }

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      translations: Languages(),
      locale: const Locale('ko', 'KR'),
      initialBinding: BindingsBuilder(() {
        webViewCtl = Get.put<MyWebViewController>(MyWebViewController());
        homeCtl = Get.put<MyHomeController>(MyHomeController());
      }),
      getPages: [
        GetPage(name: '/', page: () => const MyWebView()),
        GetPage(name: '/home', page: () => const MyHome()),
      ],
      initialRoute: myInitRoute(),
      home: Scaffold(
        appBar: AppBar(title: const Text('백그라운드 복귀 테스트')),
        body: Center(
          child: Text('앱 상태: $_appLifecycleState'),
        ),
      ),
    );
  }
}
```

#### 2. `GetX Controller`에서 처리하는 방법

만약 `StatelessWidget`을 유지하고 싶다면, `GetX Controller`에서 lifecycle을 관리할 수 있습니다:

```Dart
class AppLifecycleController extends SuperController with WidgetsBindingObserver {
  @override
  void onInit() {
    super.onInit();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void onClose() {
    WidgetsBinding.instance.removeObserver(this);
    super.onClose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    // 앱 상태 변경 처리
  }

  @override
  void onDetached() {}

  @override
  void onInactive() {}

  @override
  void onPaused() {}

  @override
  void onResumed() {}

  @override
  void onHidden() {}
}
```

> `StatefulWidget` 방식이 더 직관적이고 권장되는 방법입니다.

확실한 재현 방법은 모르겠지만, 로컬 환경에서 앱을 구동시키다 보면 아래와 같은 에러가 발생하는 것이 확인된다.
해당 에러가 발생하면 빈 페이지가 로드되고, 어떠한 동작도 수행할 수 없는 상태가 된다.

```Bash
[sentry.platformError] [error] Uncaught Platform Error
                       LateInitializationError: Field '...' has not been initialized.
                       #0      ...
                       #1      ...
                       #2      ...
                       #3      ...
                       #4      ...
[sentry.platformError] [error] Uncaught Platform Error
                       LateInitializationError: Field '...' has not been initialized.
                       #0      ...
                       #1      ...
                       #2      ...
                       #3      ...
                       #4      ...
```

위와 같은 에러를 해결하기 위해서는 각 컨트롤러 간의 의존성 문제로 인해 발생하는 것으로 확인된다.
특정 인스턴스가 로드되어있지 않은 상태에서 외부 인스턴스를 생성하려고 할 때 발생할 것 같다.

각 컨트롤러는 의존성이 필요한 외부 컨트롤러 인스턴스를 `late` 키워드로 선언된 변수로 관리 및 사용하고 있는 상태이다.

예시로 `MyWebViewController` 컨트롤러 객체를 살펴보면 전역 변수로 컨트롤러 객체 인스턴스를 관리하는 것으로 보인다.
다른 컨트롤러 객체도 마찬가지이다.

```dart
late MyWebViewController webViewCtl;
class MyWebViewController extends GetxController {

    reload() {
      homeCtl.reload();
    }

    goHome() {
      homeCtl.goHome();
    }

    backButtonPress(){
      homeCtl.backButtonPress();
    }
}
```

`MyApp` 객체 build 시점에 각 컨트롤러에 선언된 전역 변수에 인스턴스 생성 및 저장하는 방식이다.

```dart
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      translations: Languages(),
      locale: const Locale('ko', 'KR'),
      initialBinding: BindingsBuilder(() {
        webViewCtl = Get.put<MyWebViewController>(MyWebViewController());
        myHomeCtl = Get.put<MyHomeController>(MyHomeController());
      }),
      getPages: [
        GetPage(name: '/', page: () => const MyWebView()),
        GetPage(name: '/home', page: () => const MyHome()),
      ],
      initialRoute: myInitRoute(),
    );
  }
}
```

각 컨트롤러마다 전역 변수를 선언해서 인스턴스를 할당 및 사용하는 방식보다 GetX의 의존성 주입 시스템을 활용하여 `Get.find<T>()`를 사용하는 것이 더 안전하고 권장되는 방법일 것 같다.
`LateInitializationError`도 방지하고 컨트롤러들 간의 의존성을 안전하게 관리할 수 있다는 측면에서 이점이 많은 것 같다.

```dart
class MyWebViewController extends GetxController {
  MyHomeController get homeCtl => Get.find<MyHomeController>();

    reload() {
      homeCtl.reload();
    }

    goHome() {
      homeCtl.goHome();
    }

    backButtonPress(){
      homeCtl.backButtonPress();
    }
}

@override
Widget build(BuildContext context) {
  return GetMaterialApp(
    debugShowCheckedModeBanner: false,
    translations: Languages(),
    locale: const Locale('ko', 'KR'),
    initialBinding: BindingsBuilder(() {
      // permanent: 영구적으로 인스턴스를 메모리에 유지
      Get.put<MyWebViewController>(MyWebViewController(), permanent: true);
      Get.put<MyHomeController>(MyHomeController(), permanent: true);
    }),
    getPages: [
        GetPage(name: '/', page: () => const MyWebView()),
        GetPage(name: '/home', page: () => const MyHome()),
    ],
    initialRoute: myInitRoute(),
  );
}
```
