---
title: "Legacy API 리팩토링"
date: "2025-09-08"
tags:
    - Spring Boot 3.4.0
    - Java 21
    - TypeScript
    - Vue.js
    - Nuxt.js
    - API Design
    - Refactoring
---

> **단일 책임 원칙(SRP)을 적용한 API 리팩토링 가이드**
>
> 복잡한 JOIN 쿼리와 결합된 API를 작은 단위로 분리하고, 프론트엔드에서 효율적으로 조합하는 방법을 다룹니다.

---

## 🎯 리팩토링 목표

### 문제점
- 🔴 **God API**: 하나의 API가 너무 많은 책임을 가짐
- 🔴 **복잡한 JOIN**: 다수의 LEFT JOIN으로 인한 쿼리 성능 저하
- 🔴 **강한 결합도**: 부가 데이터 변경 시 전체 API 수정 필요
- 🔴 **재사용 불가**: 특정 화면 전용 API로 다른 곳에서 활용 어려움

### 개선 방향
- ✅ **단일 책임 원칙(SRP)** 적용
- ✅ API를 작은 단위로 분리
- ✅ 프론트엔드에서 필요한 데이터만 조합
- ✅ 재사용 가능한 컴포저블 함수 구현

---

## 🏗️ Part 1: 약관 동의 로직 리팩토링

### 📌 Before: 기존 코드

기존에는 약관 관련 로직이 페이지 스크립트에 분산되어 있었습니다.

```typescript
// ❌ 문제점: 약관 로직이 페이지에 직접 구현됨
const checkTermsAgreement = async () => {
  const response = await $api.termsService.getTermsAgreements({
    publisherId: publisher.value.id,
    userIds: requestUserIds.value
  });

  // 복잡한 검증 로직...
  if (hasNotAgreedUsers(response)) {
    showTermsModal();
  }
};
```

### 📌 After: 컴포저블 함수로 분리

약관 관련 로직을 **재사용 가능한 컴포저블 함수**로 추출했습니다.

#### 1️⃣ TermsAgreement 컴포저블 함수

```typescript
/**
 * 약관 동의 관련 로직을 캡슐화한 컴포저블 함수
 * @param publisherId 발행자 ID (반응형)
 */
export function TermsAgreement(publisherId: Ref<number>) {
  const { $api } = useNuxtApp();

  // 약관 목록 조회
  const { data: termsResponse } = useAsyncData('terms-response', () => {
    if (!publisherId.value) {
      return null;
    }
    return $api.termsService.getTerms(publisherId.value);
  });

  // 반응형 약관 목록
  const terms = computed(() => {
    if (!termsResponse.value) {
      return [];
    }
    return termsResponse.value;
  });

  /**
   * 사용자들의 약관 동의 이력 조회
   * @param userIds 사용자 ID 배열
   */
  function getTermsAgreements(userIds: number[]) {
    if (!publisherId.value || userIds.length === 0) {
      throw new Error('Invalid publisherId or userIds.');
    }
    return $api.termsService.getTermsAgreements({
      publisherId: publisherId.value,
      userIds: userIds
    });
  }

  /**
   * 약관 동의 절차 필요 여부 판단
   * @param userIds 사용자 ID 배열
   * @param termsAgreements 사용자별 약관 동의 정보
   * @returns true: 동의 필요, false: 동의 불필요
   */
  function isAgreementRequired(
    userIds: number[],
    termsAgreements: { [userId: number]: TermsAgreementResponse }
  ): boolean {
    // 1. 기본 검증
    if (!publisherId.value || userIds.length === 0) {
      return true;
    }

    if (Object.keys(termsAgreements).length === 0) {
      return true;
    }

    // 2. 필수 약관 동의 여부 확인
    const everyoneAgreedMustTerms = userIds.every(
      (userId) => termsAgreements[userId]?.isMust
    );

    if (!everyoneAgreedMustTerms) {
      console.debug('필수 약관 동의하지 않은 유저가 있음.');
      return true;
    }

    console.debug('모두 필수 약관 동의함.');

    // 3. 선택 약관 존재 여부 및 확인 여부 검증
    const hasOptionalTerms = terms.value.some(
      (term) =>
        !term.mainTermsClause?.isMust ||
        term.subTermsClauses?.some((subTerms) => !subTerms.isMust)
    );

    if (hasOptionalTerms) {
      const everyoneCheckedOptionalTerms = userIds.every(
        (userId) => termsAgreements[userId]?.agreeOptionalTerms
      );

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

#### 2️⃣ 페이지에서 사용

```typescript
// ✅ 개선: 간결하고 명확한 페이지 로직
const publisherId = computed(() => publisher.value.id);

// 컴포저블 함수 사용
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
```

### ✅ 개선 효과

| 항목 | Before | After |
|------|--------|-------|
| **코드 라인 수** | ~80줄 | ~30줄 (페이지) |
| **재사용성** | ❌ 불가능 | ✅ 여러 페이지에서 활용 |
| **테스트** | ❌ 페이지 단위 테스트 어려움 | ✅ 컴포저블 단위 테스트 가능 |
| **가독성** | ⚠️ 복잡한 로직 혼재 | ✅ 명확한 의도 표현 |

---

## 🏗️ Part 2: 사용자 API 분리 전략

### 📌 Before: 단일 God API

기존에는 사용자 상세 정보와 모든 부가 데이터를 한 번에 반환했습니다.

#### ❌ 문제가 있는 API 설계

```java
@GetMapping(value = "/user/{id}")
public Map<String, Object> findUser(@PathVariable("id") String id) {
  UserDetail user = userFacadeService.getUserDetail(id);

  if (user == null) {
    throw MyException("not found user.");
  }

  Map<String, Object> map = new HashMap<>();
  map.put("user", user);              // 사용자 기본 정보
  map.put("friends", user.getFriends());  // 친구 목록
  map.put("creditCard", user.getCreditCard()); // 결제 수단
  map.put("agreements", user.getAgreements()); // 약관 동의 정보
  return map;
}
```

#### ❌ 복잡한 서비스 로직

```java
public UserDetail getUserDetail(String id) {
  UserVO user =
      Optional.ofNullable(userService.findById(id))
          .orElseThrow(() -> MyException("data not found"));

  // 부가 데이터를 함께 조회
  userService.setAgreement(user);
  userService.setCreditCard(user);
  List<UserFriendVO> friends = userService.findFriend(id);

  return UserDetail.from(user, friends);
}
```

### 📌 After: API 분리 및 단순화

#### ✅ 1. 사용자 기본 정보 API

```java
/**
 * 사용자 기본 정보만 조회
 * 단일 책임 원칙 적용
 */
@GetMapping(value = "/user/{id}")
public UserDetail findUser(@PathVariable("id") String id) {
  return userFacadeService.getUserDetail(id);
}
```

```java
/**
 * 사용자 기본 정보만 반환
 * 복잡한 JOIN 제거
 */
public UserDetail getUserDetail(String id) {
  return Optional.ofNullable(userService.findById(id))
      .map(UserDetail::from)
      .orElseThrow(() -> MyException("data not found"));
}
```

#### ✅ 2. 친구 목록 API

```java
/**
 * 사용자의 친구 목록 조회
 * 필요할 때만 호출
 */
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

#### ✅ 3. 결제 수단 API

```java
/**
 * 사용자 등록 결제 수단 조회
 * 보안이 필요한 정보는 별도 API로 분리
 */
@GetMapping(value = "/user/{id}/credit-card")
public UserCreditCard findUserCreditCard(@PathVariable("id") String id) {
  return userFacadeService.getUserCreditCard(id);
}
```

```java
public UserCreditCard getUserCreditCard(String id) {
  return UserCreditCard.from(userCreditCardService.getCompleteCreditCard(id));
}
```

---

## 🎨 프론트엔드: TanStack Query 활용

### 기존 방식: 동기식 API 호출

```typescript
// ❌ 문제점: 순차적 동기 호출, 에러 처리 복잡
async function loadUserData() {
  try {
    const user = await $api.userService.userDetail(userId);
    const friends = await $api.userService.getUserFriends(userId);
    const creditCard = await $api.userService.getUserCreditCard(userId);

    // 데이터 설정...
  } catch (error) {
    // 에러 처리...
  }
}
```

### 개선된 방식: TanStack Query + 의존성 기반 호출

```typescript
const userId = computed(() => {
  if (props.userId) {
    return props.userId;
  }
  return route.params.userId;
});

// 1. userId 값이 유효하다면 유저 기본 정보 조회 API 호출
const { data: userDetail, refetch: refetchUserDetail } = useQuery({
  queryKey: ['user-detail', () => userId.value],
  queryFn: () => $api.userService.userDetail(userId.value),
  enabled: computed(() => !!userId.value),
  initialData: {},
});

// 2. userDetail이 로드되면 자동으로 친구 목록 조회
const { data: userFriends } = useQuery({
  queryKey: ['user-friends', () => userDetail.value.id],
  queryFn: () => $api.userService.getUserFriends(userDetail.value.id),
  enabled: computed(() => !!userDetail.value.id),  // 의존성 체크
  initialData: [],
});

// 3. userDetail이 로드되면 자동으로 결제 수단 조회
const { data: userCreditCard } = useQuery({
  queryKey: ['user-credit-card', () => userDetail.value.id],
  queryFn: () => $api.userService.getUserCreditCard(userDetail.value.id),
  enabled: computed(() => !!userDetail.value.id),  // 의존성 체크
});
```

### ✅ TanStack Query 장점

| 기능 | 설명 | 효과 |
|------|------|------|
| **자동 캐싱** | 동일 queryKey에 대한 중복 요청 방지 | 네트워크 비용 절감 |
| **의존성 기반 호출** | `enabled` 옵션으로 조건부 실행 | 불필요한 API 호출 차단 |
| **로딩 상태 관리** | `isLoading`, `isFetching` 자동 제공 | 별도 상태 관리 불필요 |
| **에러 처리** | `error`, `isError` 자동 제공 | 일관된 에러 처리 |
| **자동 재시도** | 실패 시 재시도 옵션 제공 | 네트워크 불안정 대응 |
| **Stale 관리** | 데이터 신선도 자동 관리 | 적시 데이터 갱신 |

---

## 📊 성능 비교

### Before: God API 방식

```
┌─────────────────────────────────────────┐
│  GET /user/123                          │
│  - 사용자 기본 정보                       │
│  - 친구 목록 (10명)                      │
│  - 결제 수단                             │
│  - 약관 동의 정보                        │
└─────────────────────────────────────────┘
           ↓
    평균 응답 시간: 850ms
    데이터 크기: 145KB
    불필요한 데이터: 약 60%
```

### After: 분리된 API 방식

```
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ GET /user/123    │ │ GET /user/123    │ │ GET /user/123    │
│                  │ │      /friends    │ │   /credit-card   │
│ 기본 정보만      │ │ 필요할 때만      │ │ 필요할 때만      │
└──────────────────┘ └──────────────────┘ └──────────────────┘
        ↓                    ↓                    ↓
     200ms                150ms                180ms
     15KB                 35KB                 8KB
```

### 개선 효과

| 지표 | Before | After | 개선율 |
|------|--------|-------|--------|
| 초기 로딩 시간 | 850ms | 200ms | **76% ↓** |
| 초기 데이터 크기 | 145KB | 15KB | **90% ↓** |
| 불필요한 데이터 | ~60% | 0% | **100% ↓** |
| API 재사용성 | 낮음 | 높음 | - |

---

## 💡 설계 원칙

### 1️⃣ 단일 책임 원칙 (SRP)

> 하나의 API는 하나의 책임만 가져야 한다.

```java
// ✅ Good: 명확한 단일 책임
@GetMapping("/user/{id}")
public UserDetail getUser(@PathVariable String id) { ... }

@GetMapping("/user/{id}/friends")
public List<UserFriend> getFriends(@PathVariable String id) { ... }

// ❌ Bad: 여러 책임 혼재
@GetMapping("/user/{id}/all")
public Map<String, Object> getUserAllData(@PathVariable String id) { ... }
```

### 2️⃣ 필요할 때만 조회 (Lazy Loading)

```typescript
// ✅ Good: 탭 클릭 시 친구 목록 로드
const { data: friends } = useQuery({
  queryKey: ['friends', userId],
  queryFn: () => $api.getFriends(userId),
  enabled: computed(() => activeTab.value === 'friends')
});

// ❌ Bad: 사용하지 않을 수도 있는 데이터 미리 로드
```

### 3️⃣ 캐싱 활용

```typescript
// ✅ Good: TanStack Query 캐싱 활용
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => $api.getUser(userId),
  staleTime: 5 * 60 * 1000, // 5분간 fresh 유지
});
```

---

## 🎯 마이그레이션 가이드

### Step 1: API 분석 및 분리 계획

```plaintext
기존 API: GET /user/{id}
└── 반환 데이터
    ├── user (기본 정보) → GET /user/{id}
    ├── friends (친구 목록) → GET /user/{id}/friends
    ├── creditCard (결제 수단) → GET /user/{id}/credit-card
    └── agreements (약관 동의) → GET /user/{id}/agreements
```

### Step 2: 백엔드 API 분리

1. 기존 API 유지 (하위 호환성)
2. 새로운 분리된 API 추가
3. 클라이언트 마이그레이션 후 기존 API 제거

### Step 3: 프론트엔드 마이그레이션

1. TanStack Query 설치 및 설정
2. 컴포저블 함수로 로직 분리
3. useQuery로 API 호출 변경
4. 의존성 기반 순차 로딩 구현

---

## 📝 정리

### ✅ 핵심 개선 사항

1. **API 분리**
   - God API → 작은 단위 API로 분해
   - 단일 책임 원칙 적용

2. **컴포저블 함수**
   - 재사용 가능한 로직 캡슐화
   - 테스트 용이성 향상

3. **TanStack Query**
   - 의존성 기반 자동 호출
   - 캐싱 및 상태 관리 자동화

4. **성능 개선**
   - 초기 로딩 시간 76% 단축
   - 불필요한 데이터 전송 제거

### 💪 얻은 교훈

- ✅ API는 **작고 명확한 책임**을 가져야 한다
- ✅ 프론트엔드에서 **필요한 데이터만 조합**하는 것이 유연하다
- ✅ **TanStack Query**로 복잡한 데이터 흐름을 간단히 관리할 수 있다
- ✅ **단일 책임 원칙**은 백엔드와 프론트엔드 모두에 적용된다