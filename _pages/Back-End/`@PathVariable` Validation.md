---
title: "`@PathVariable` Validation"
date: "2025-09-08"
tags:
    - Spring Boot 3.4.0
    - REST API
    - Java 21
    - Bean Validation
---

> **Spring Boot 3.2+에서 제공하는 `@PathVariable` 유효성 검증 및 예외 처리 가이드**
>
> URL 경로 파라미터에 대한 유효성 검증을 선언적으로 수행하고, 전역 예외 핸들러로 일관성 있게 처리하는 방법을 다룹니다.

---

## 🎯 개요

REST API에서 URL 경로 변수(`@PathVariable`)에 대한 **Bean Validation**을 적용하고, 검증 실패 시 일관된 에러 응답을 제공하는 방법을 설명합니다.

---

## 📚 Spring Boot 버전별 예외 타입

### 🆕 Spring Boot 3.2+: `HandlerMethodValidationException`

**더 포괄적인 검증 지원:**

- ✅ Handler 메서드의 **모든 매개변수 검증**
- ✅ `@PathVariable`, `@RequestParam`, `@RequestHeader`, `@RequestBody` 등 지원
- ✅ Spring MVC의 **전체 요청 처리 파이프라인**에서 검증

### 📜 Spring Boot 3.1 이하: `MethodValidationException`

**제한적인 검증 범위:**

- ⚠️ 주로 `@Validated` 어노테이션과 함께 사용
- ⚠️ Bean Validation의 **메서드 수준 제약조건** 검증
- ⚠️ 컨트롤러 파라미터 검증보다는 서비스 레이어 메서드 검증에 초점

---

## 🛠️ 전역 예외 핸들러 구현

### 1️⃣ GlobalExceptionHandler 클래스 생성

`ResponseEntityExceptionHandler`를 상속받아 `handleHandlerMethodValidationException` 메서드를 오버라이딩합니다.

```java
@Slf4j
@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

  /**
   * @PathVariable 검증 실패 시 호출되는 핸들러
   * Spring Boot 3.2+ 지원
   */
  @Override
  protected ResponseEntity<Object> handleHandlerMethodValidationException(
    @NotNull HandlerMethodValidationException e,
    @NotNull HttpHeaders headers,
    @NotNull HttpStatusCode status,
    @NotNull WebRequest request) {

    // 1. 검증 결과 목록 조회
    List<ParameterValidationResult> parameterValidationResults = e.getParameterValidationResults();
    if (parameterValidationResults.isEmpty()) {
      return MyBadRequest(e);
    }

    // 2. 첫 번째 검증 실패 메시지 추출
    List<MessageSourceResolvable> resolvableErrors =
      parameterValidationResults.getFirst().getResolvableErrors();
    if (resolvableErrors.isEmpty()) {
      return MyBadRequest(e);
    }

    // 3. 기본 에러 메시지와 함께 400 Bad Request 응답
    return MyBadRequest(e, resolvableErrors.getFirst().getDefaultMessage());
  }

  //...
}
```

### 🔍 코드 설명

#### `@RestControllerAdvice`
- 모든 컨트롤러에 대한 **전역 예외 처리**를 담당
- `@ExceptionHandler` 메서드를 통해 특정 예외 타입 처리

#### `@Order(Ordered.HIGHEST_PRECEDENCE)`
- 여러 `@ControllerAdvice`가 있을 때 **우선순위 지정**
- 가장 높은 우선순위로 예외 처리

#### `handleHandlerMethodValidationException`
- Spring Boot 3.2+에서 자동으로 호출되는 메서드
- `@PathVariable`, `@RequestParam` 등의 검증 실패 시 실행

---

## 📝 컨트롤러에 Validation 적용

### 2️⃣ 컨트롤러 파라미터에 제약조건 선언

```java
@RestController
@RequiredArgsConstructor
@RequestMapping("/my/api")
public class MyController {

  private final MyService myService;

  /**
   * 병원 조회 API
   * @param hospitalSeq 양수(Positive) 검증
   */
  @GetMapping(value = "/hospitals/{seq}")
  public APIResponse getAllBySeq(@PathVariable @Positive int hospitalSeq) {
    return myService.getAllBySeq(hospitalSeq);
  }

  /**
   * 코드 조회 API
   * @param code 최대 100자 길이 검증
   */
  @GetMapping(value = "/codes/{code}")
  public APIResponse getByCode(@PathVariable @Size(max = 100) String code) {
    return myService.getByCode(code);
  }
}
```

### 🎨 사용 가능한 Validation 어노테이션

| 어노테이션 | 설명 | 적용 타입 |
|----------|------|----------|
| `@NotNull` | null 값 불허 | 모든 타입 |
| `@NotEmpty` | null 또는 빈 문자열 불허 | String, Collection |
| `@NotBlank` | null, 빈 문자열, 공백 불허 | String |
| `@Positive` | 양수만 허용 | 숫자 타입 |
| `@PositiveOrZero` | 0 또는 양수 허용 | 숫자 타입 |
| `@Min(value)` | 최소값 지정 | 숫자 타입 |
| `@Max(value)` | 최대값 지정 | 숫자 타입 |
| `@Size(min, max)` | 문자열 길이 또는 컬렉션 크기 제한 | String, Collection |
| `@Pattern(regexp)` | 정규식 패턴 매칭 | String |
| `@Email` | 이메일 형식 검증 | String |

---

## 🔧 실전 활용 예시

### 예시 1: ID 검증 (양수만 허용)

```java
@GetMapping("/users/{id}")
public UserResponse getUser(@PathVariable @Positive Long id) {
  return userService.findById(id);
}
```

**검증 실패 시:**
- 요청: `GET /users/-1` 또는 `GET /users/0`
- 응답: `400 Bad Request` + "양수 값이어야 합니다" 메시지

### 예시 2: 코드 길이 제한

```java
@GetMapping("/products/{code}")
public ProductResponse getProduct(
    @PathVariable
    @Size(min = 3, max = 20, message = "제품 코드는 3~20자 사이여야 합니다")
    String code) {
  return productService.findByCode(code);
}
```

**검증 실패 시:**
- 요청: `GET /products/AB` (2자)
- 응답: `400 Bad Request` + "제품 코드는 3~20자 사이여야 합니다"

### 예시 3: 정규식 패턴 검증

```java
@GetMapping("/orders/{orderNo}")
public OrderResponse getOrder(
    @PathVariable
    @Pattern(regexp = "^ORD-\\d{8}$", message = "주문번호 형식이 올바르지 않습니다")
    String orderNo) {
  return orderService.findByOrderNo(orderNo);
}
```

**검증 성공:**
- 요청: `GET /orders/ORD-12345678` ✅

**검증 실패:**
- 요청: `GET /orders/ORDER-123` ❌
- 응답: `400 Bad Request` + "주문번호 형식이 올바르지 않습니다"

---

## ⚠️ 알려진 제약사항 및 해결 방법

### 🚨 빈 경로 변수 문제

> **문제:** `@PathVariable` 값을 비어있는 채로 요청하면 `500 Internal Server Error` 발생
>
> 예: `GET /my/api/hospitals/` → `No static resource my/api/hospitals/`

#### 원인
- Spring MVC는 빈 경로 변수를 **라우팅 실패**로 간주
- 컨트롤러 메서드까지 도달하지 않아 Validation 실행 안 됨

#### 해결 방법 1: Optional Path Variable

```java
@GetMapping(value = {"/hospitals/{seq}", "/hospitals"})
public APIResponse getAllBySeq(
    @PathVariable(required = false)
    @Positive
    Integer hospitalSeq) {

  if (hospitalSeq == null) {
    throw new IllegalArgumentException("병원 ID는 필수입니다");
  }

  return myService.getAllBySeq(hospitalSeq);
}
```

#### 해결 방법 2: @RequestParam 사용 고려

경로 변수가 선택적이라면 쿼리 파라미터 사용을 권장합니다:

```java
// AS-IS: /hospitals/{seq}
@GetMapping("/hospitals/{seq}")
public APIResponse getHospital(@PathVariable @Positive int seq) { ... }

// TO-BE: /hospitals?seq=123
@GetMapping("/hospitals")
public APIResponse getHospital(@RequestParam @Positive int seq) { ... }
```

---

## 📊 응답 예시

### ✅ 성공 응답

```http
GET /my/api/hospitals/123

200 OK
{
  "status": "success",
  "data": {
    "id": 123,
    "name": "서울병원"
  }
}
```

### ❌ 검증 실패 응답

```http
GET /my/api/hospitals/-1

400 Bad Request
{
  "status": "error",
  "message": "양수여야 합니다",
  "timestamp": "2025-09-30T12:34:56"
}
```

---

## 💡 Best Practices

### 1. 명확한 에러 메시지 제공

```java
@GetMapping("/users/{id}")
public UserResponse getUser(
    @PathVariable
    @Positive(message = "사용자 ID는 1 이상의 양수여야 합니다")
    Long id) {
  return userService.findById(id);
}
```

### 2. 커스텀 Validator 생성

복잡한 검증 로직은 별도 Validator로 분리:

```java
@Target({ElementType.PARAMETER, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = HospitalSeqValidator.class)
public @interface ValidHospitalSeq {
  String message() default "유효하지 않은 병원 ID입니다";
  Class<?>[] groups() default {};
  Class<? extends Payload>[] payload() default {};
}
```

### 3. 로깅 추가

```java
@Override
protected ResponseEntity<Object> handleHandlerMethodValidationException(
    HandlerMethodValidationException e, ...) {

  log.warn("PathVariable 검증 실패: {}", e.getMessage());

  // 에러 응답 생성
  return MyBadRequest(e, extractErrorMessage(e));
}
```

---

## 🔗 관련 문서

- [Spring Boot Bean Validation](https://docs.spring.io/spring-boot/docs/current/reference/html/io.html#io.validation)
- [Jakarta Bean Validation Specification](https://beanvalidation.org/3.0/)
- [Spring MVC Exception Handling](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-exceptionhandler.html)

---

## 📝 정리

- ✅ Spring Boot 3.2+에서는 `HandlerMethodValidationException` 사용
- ✅ `@PathVariable`에 Bean Validation 어노테이션 적용 가능
- ✅ 전역 예외 핸들러로 일관된 에러 응답 제공
- ⚠️ 빈 경로 변수는 Optional 또는 RequestParam으로 대응
- 💡 명확한 에러 메시지로 사용자 경험 개선