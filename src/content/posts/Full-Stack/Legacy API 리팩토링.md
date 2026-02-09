---
title: "Legacy API 리팩토링"
date: "2025-09-08"
tags:
    - Spring Boot 3.4.0
    - Java 21
    - TypeScript
    - Vue.js
legacy_url: /Full-Stack/Legacy API 리팩토링.html
---
특정 프로세스에서 다수의 LEFT JOIN으로 부가 데이터를 함께 조회하던 쿼리를 제거하고,
그 쿼리에 의존하던 로직들을 단일 책임 원칙에 맞게 분리·수정한다.

## Composable 함수

```ts
export function TermsAgreement(publisherId: Ref<number>) {
  const { $api } = useNuxtApp();

  const { data: termsResponse } = useAsyncData('terms-response', () => {
    if (!publisherId.value) {
      return null;
    }
    return $api.termsService.getTerms(publisherId.value);
  });

  const terms = computed(() => {
    if (!termsResponse.value) {
      return [];
    }
    return termsResponse.value;
  });

  function getTermsAgreements(userIds: number[]) {
    if (!publisherId.value || userIds.length === 0) {
      throw new Error('Invalid publisherId or userIds.');
    }
    return $api.termsService.getTermsAgreements({ publisherId: publisherId.value, userIds: userIds });
  }

  function isAgreementRequired(userIds: number[], termsAgreements: { [userId: number]: TermsAgreementResponse }) {
    if (!publisherId.value || userIds.length === 0) {
      return true;
    }

    if (Object.keys(termsAgreements).length === 0) {
      return true;
    }

    const everyoneAgreedMustTerms = userIds.every((userId) => termsAgreements[userId]?.isMust);

    if (!everyoneAgreedMustTerms) {
      console.debug('필수 약관 동의하지 않은 유저가 있음.');
      return true;
    }

    console.debug('모두 필수 약관 동의함.');

    const hasOptionalTerms = terms.value.some(
      (term) => !term.mainTermsClause?.isMust || term.subTermsClauses?.some((subTerms) => !subTerms.isMust),
    );
    if (hasOptionalTerms) {
      const everyoneCheckedOptionalTerms = userIds.every((userId) => termsAgreements[userId]?.agreeOptionalTerms);
      if (!everyoneCheckedOptionalTerms) {
        console.debug('선택 약관을 확인하지 않은 유저가 있음.');
        return true;
      }
      console.debug('모두 선택 약관 확인함.');
    }

    return false;
  }

  return {
    getTermsAgreements,
    isAgreementRequired,
    terms,
  };
}
```

## Page Script

```ts
const publisherId = computed(() => publisher.value.id);

const { getTermsAgreements, isAgreementRequired, terms } = TermsAgreement(publisherId);

const requestUserIds = computed(() => {
  return requests.map((request) => request.userId).filter((id) => id);
});

// 약관 동의 흐름
// 1) 요청 유저들의 약관 동의 이력을 조회한다.
getTermsAgreements(requestUserIds.value).then((response) => {
  // 2) 동의 절차 필요 여부 판단
  if (isAgreementRequired(requestUserIds.value, response)) {
    // 3) 필요 시 약관 동의 모달 표시
    showTermsModal();
    return;
  }
  // 4) 불필요하면 다음 단계로 진행
  goComplete();
});

// ...
```

컴포저블 함수를 통해 Script 코드 라인을 줄였다.

약관 관련 로직에 대한 책임은 `TermsAgreement` 컴포저블 함수에게만 위임된다.

불필요한 시점에는 약관 관련 API를 요청 및 조회하지 않는다. 

---

유저 상세 정보 페이지에서 `/my/api/user/{id}` API로부터 함께 내려오던 부가 데이터들에 대해
클라이언트/프론트 측면에서 분석해보고 개선점을 찾으려한다.

```java
@GetMapping(value = "/user/{id}")
public Map<String, Object> findUser(@PathVariable("id") String id) {
  UserDetail user = userFacadeService.getUserDetail(id);

  if (user == null) {
    throw MyException("not found user.");
  }

  Map<String, Object> map = new HashMap<>();
  map.put("user", user);
  map.put("friends", user.getFriends());
  return map;
}
```

```java
@GetMapping(value = "/user/{id}")
public UserDetail findUser(@PathVariable("id") String id) {
  return userFacadeService.getUserDetail(id);
}
```

---

```java
public UserDetail getUserDetail(String id) {
  UserVO user =
      Optional.ofNullable(userService.findById(id))
          .orElseThrow(() -> MyException("data not found"));
  userService.setAgreement(user);
  return UserDetail.from(user, userService.findFriend(id));
}
```

```java
public UserDetail getUserDetail(String id) {
  return Optional.ofNullable(userService.findById(id))
      .map(UserDetail::from)
      .orElseThrow(() -> MyException("data not found"));
}
```
---

기존에 **DAO**단에서부터 많은 부가적인 데이터를 많이 조회 및 전달하고 있던 로직들을 단일 책임 원칙을 반영하여 유저의 기본 정보만을 조회 및 전달하도록 리팩토링하였다.

유저의 친구들 조회 API 생성

```java
@GetMapping(value = "/user/{id}/friends")
public List<UserFriend> findFriends(@PathVariable("id") String id) {
  return userFacadeService.getAllFriends(id);
}
```
```java
public List<UserFriend> getAllFriends(String id) {
  List<UserFriendVO> friends = service.findAllFriends(id);
  return UserFriend.from(friends);
}
```


유저 결제 수단 조회 API 생성
```java
@GetMapping(value = "/user/{id}/credit-card")
public UserCreditCard findUserCreditCard(
    @PathVariable("id") String id) {
  return userFacadeService.getUserCreditCard(id);
}

public UserCreditCard getUserCreditCard(String id) {
  return UserCreditCard.from(userCreditCardService.getCompleteCreditCard(id));
}
```


유저와 연관된 부가 정보는 별도 API로 데이터를 제공하는 방식으로 리팩토링하여
각각의 API를 프론트 단에서 조립하여 설계하는 방향으로 가보려고 한다.

기존 일반 함수에서 직접 API를 동기식으로 요청하던 방식에서
**tanstack/useQuery**를 통해 특정 데이터에 의존하여 적절한 시점에 API를 순차적으로 요청하도록 설계해보았다.

```ts
const userId = computed(() => {
  if (props.userId) {
    return props.userId;
  }
  return route.params.userId;
});

// userId 값이 유효하다면 유저 기본 정보 조회 API 호출
const { data: userDetail, refetch: refetchUserDetail } = useQuery({
  queryKey: ['user-detail', () => userId.value],
  queryFn: () => $api.userService.userDetail(userId.value),
  enabled: computed(() => !!userId.value),
  initialData: {},
});

const { data: userFriends } = useQuery({
  queryKey: ['user-friends', () => userDetail.value.id],
  queryFn: () => $api.userService.getUserFriends(userDetail.value.id),
  enabled: computed(() => !!userDetail.value.id),
  initialData: [],
});

const { data: userCreditCard } = useQuery({
  queryKey: ['user-credit-card', () => userDetail.value.id],
  queryFn: () => $api.userService.getUserCreditCard(userDetail.value.id),
  enabled: computed(() => !!userDetail.value.id),
});
```
