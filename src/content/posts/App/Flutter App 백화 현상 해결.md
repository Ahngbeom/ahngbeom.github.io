---
title: "Flutter App Android 백화 현상 해결"
date: "2025-09-06"
bookmark: true
tags:
    - Flutter
    - Dart
    - Android
    - GetX
    - State Management
    - Lifecycle
legacy_url: /App/Flutter App 백화 현상 해결.html
---
## 문제 상황

Flutter 앱에서 백그라운드에서 포그라운드로 전환될 때 화면이 하얗게 변하는 백화 현상이 발생하는 문제가 있었습니다. 이 문제를 해결하기 위해 앱의 라이프사이클 관리 방식을 개선했습니다.

### 현재 구조

- `MyApp` 클래스가 `StatelessWidget`을 상속
- WebView 기반의 하이브리드 앱 구조
- GetX를 사용한 상태 관리

### 기존 설계 배경

> 현재 프로젝트는 WebView 방식의 하이브리드 앱으로, Flutter는 네이티브 기능을 제공하는 래퍼(wrapper) 역할을 합니다.
> 따라서 Widget의 상태 변화가 빈번하지 않아 `StatelessWidget`을 사용했습니다.

## 문제 해결 접근

### 1. 라이프사이클 모니터링 구현

백화 현상의 원인을 파악하기 위해 앱의 라이프사이클을 모니터링할 필요가 있었습니다. 이를 위해 `WidgetsBindingObserver`를 사용하기로 했습니다.

### StatelessWidget의 한계

현재 구조에서 다음과 같은 제약사항이 있었습니다:

- `WidgetsBindingObserver`는 `State` 객체에서만 사용 가능
- `StatelessWidget`은 lifecycle 메서드 (`initState()`, `dispose()` 등) 미지원
- Observer를 등록/해제할 방법이 없음

### 구조 변경 필요성

라이프사이클 모니터링을 위해서는 다음 중 하나의 방식으로 구조를 변경해야 했습니다:

1. `StatefulWidget`으로 전환
2. GetX Controller를 통한 라이프사이클 관리

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

```dart
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

## 문제의 근본 원인

### 컨트롤러 관리 방식의 문제

현재 컨트롤러 인스턴스는 전역 변수로 관리되고 있습니다:

```dart
late MyWebViewController webViewCtl;  // 전역 변수로 관리

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

### 기존 초기화 방식

`MyApp` 클래스에서 빌드 시점에 컨트롤러 인스턴스를 생성하고 전역 변수에 할당:

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
        // 전역 변수에 직접 할당
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

## 개선된 접근 방식

GetX의 의존성 주입 시스템을 활용하여 더 안정적인 방식으로 변경할 수 있습니다:

1. 전역 변수 사용을 피하고 `Get.find<T>()` 활용
2. `LateInitializationError` 방지
3. 컨트롤러 간 의존성 명확하게 관리

## 최종 구현

### 1. 개선된 컨트롤러 구조

```dart
class MyWebViewController extends GetxController {
  // GetX의 의존성 주입을 활용한 컨트롤러 참조
  MyHomeController get homeCtl => Get.find<MyHomeController>();

  reload() {
    homeCtl.reload();
  }

  goHome() {
    homeCtl.goHome();
  }

  backButtonPress() {
    homeCtl.backButtonPress();
  }
}
```

### 2. 안전한 의존성 주입 설정

```dart
@override
Widget build(BuildContext context) {
  return GetMaterialApp(
    debugShowCheckedModeBanner: false,
    translations: Languages(),
    locale: const Locale('ko', 'KR'),
    initialBinding: BindingsBuilder(() {
      // permanent 옵션으로 인스턴스 생명주기 관리
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

## 결과 및 권장사항

### 개선 효과

1. **안정성**
   - `LateInitializationError` 발생 방지
   - 의존성 관리 개선
   - 백화 현상 해결

2. **유지보수성**
   - 명확한 의존성 구조
   - 코드 가독성 향상
   - 디버깅 용이성 증가

3. **성능**
   - 효율적인 메모리 관리
   - 안정적인 상태 관리
   - 라이프사이클 최적화

### 권장 사항

1. **의존성 관리**
   - `Get.find<T>()` 활용
   - 전역 변수 사용 최소화
   - `permanent` 옵션 적절히 활용

2. **상태 관리**
   - 라이프사이클 이벤트 모니터링
   - 컨트롤러 간 의존성 명확화
   - 메모리 누수 방지

3. **테스트 및 모니터링**
   - 백그라운드/포그라운드 전환 테스트
   - 메모리 사용량 모니터링
   - 성능 지표 추적

    ```dart
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
    //...
    ```
