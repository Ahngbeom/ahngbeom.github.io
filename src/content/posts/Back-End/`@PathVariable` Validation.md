---
title: "`@PathVariable` Validation"
date: "2025-09-08"
tags:
    - Spring Boot 3.4.0
    - REST API
    - Java 21
legacy_url: /Back-End/`@PathVariable` Validation.html
---
> `ResponseEntityExceptionHandler` 객체의 `handleHandlerMethodValidationException` 메소드를 오버라이딩하여 @PathVariable에 적용된 Validation Checking 과정을 핸들링한다.
> HandlerMethodValidationException: **Spring Boot 3.2+**에서 도입
> MethodValidationException: Spring Boot 3.1 이하에서 사용
>
> ## HandlerMethodValidationException
>
> - 더 포괄적: Handler 메서드의 모든 매개변수 검증
> - @PathVariable, @RequestParam, @RequestHeader, @RequestBody 등
> - Spring MVC의 전체 요청 처리 파이프라인 검증
>
> ## MethodValidationException
>
> - 더 제한적: 주로 @Validated 어노테이션과 함께 사용되는 메서드 검증
> - Bean Validation의 메서드 수준 제약조건 검증
>
>

*프로젝트에서 전역적으로 예외 처리를 핸들링할 객체에서 ResponseEntityExceptionHandler 객체를 상속받아*
*handleHandlerMethodValidationException 메소드를 오버라이딩하여 예외를 직접 핸들링한다.*

```java
@Slf4j
@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

  //...
  
  @Override
  protected ResponseEntity<Object> handleHandlerMethodValidationException(
    @NotNull HandlerMethodValidationException e,
    @NotNull HttpHeaders headers,
    @NotNull HttpStatusCode status,
    @NotNull WebRequest request) {
    List<ParameterValidationResult> parameterValidationResults = e.getParameterValidationResults();
    if (parameterValidationResults.isEmpty()) {
      return MyBadRequest(e);
    }

    List<MessageSourceResolvable> resolvableErrors =
      parameterValidationResults.getFirst().getResolvableErrors();
    if (resolvableErrors.isEmpty()) {
      return MyBadRequest(e);
    }

    return MyBadRequest(e, resolvableErrors.getFirst().getDefaultMessage());
  }

  //...
}
```

*API URL Path에서 동적 파라미터를 받도록 구성 설계되어있을 때,*
*해당 파라미터에 대한 유효성 규칙을 정의할 수 있다.*

```java
@RestController
@RequiredArgsConstructor
@RequestMapping("/my/api")
public class MyController {

  private final MyService myService;

  @GetMapping(value = "/.../{seq}")
  public APIResponse getAllBySeq(@PathVariable @Positive int hospitalSeq) {
    return myService.getAllBySeq(hospitalSeq);
  }

  @GetMapping(value = "/.../{code}")
  public APIResponse getByCode(@PathVariable @Size(max = 100) String code) {
    return myService.getByCode(code);
  }
}
```

> `@PathVariable` 값을 비어있는 채로 요청하게 되면
> `500 error No static resource my/api/...` 에러가 발생한다.
> 위 케이스의 경우 핸들링할 수 있는 적절한 방법이 있다면 공유해주세요.
