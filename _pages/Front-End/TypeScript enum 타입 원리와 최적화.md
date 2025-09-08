---
title: "TypeScript enum 타입 원리와 최적화"
date: "2025-09-08"
tags:
    - TypeScript
    - enum
    - Tree-shaking
    - IIFE
    - const
    - as const
---

## 개요

TypeScript에서 `enum`은 열거형 타입을 정의하는 편리한 방법을 제공하지만, 번들 크기와 성능 측면에서 몇 가지 고려해야 할 사항이 있습니다. 이 문서에서는 `enum`의 동작 원리와 최적화 방안을 살펴봅니다.

## TypeScript enum의 이해

### Tree-shaking과 IIFE

개발에서 `Tree-shaking`이란 사용하지 않는 코드를 제거하여 코드를 가볍게 만드는 최적화 과정을 말합니다. 일반적으로 컴파일 단계에서 수행되지만, `enum`은 특별한 경우입니다.

#### enum의 컴파일 결과

```typescript
// TypeScript enum 정의
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT"
}

// 컴파일된 JavaScript 코드
var Direction;
(function (Direction) {
    Direction["Up"] = "UP";
    Direction["Down"] = "DOWN";
    Direction["Left"] = "LEFT";
    Direction["Right"] = "RIGHT";
})(Direction || (Direction = {}));
```

`enum`이 **IIFE(즉시 실행 함수)**로 컴파일되면서 Tree-shaking이 어려워지는 문제가 발생합니다.

### const enum vs const as const

#### 기존 enum의 문제점

- 사용하지 않는 `enum` 값도 번들에 포함됨
- IIFE로 인한 추가적인 런타임 코드 발생
- 번들 크기 증가

#### 개선 방안: const와 as const 사용

```typescript
// 개선된 방식
const Direction = {
    Up: "UP",
    Down: "DOWN",
    Left: "LEFT",
    Right: "RIGHT"
} as const;

type DirectionType = typeof Direction[keyof typeof Direction];
```

### 성능 개선 결과

#### 번들 크기 비교

- enum 사용 시: IIFE 코드 포함
- const as const 사용 시: 순수 객체 선언만 포함

#### 실제 적용 결과

- 상수 정의 코드를 `const as const` 방식으로 수정 후 2주간 모니터링
- 기존 enum 관련 에러 발생하지 않음
- 번들 크기 최적화 확인

## 권장 사항

1. **새로운 상수 정의 시**
   - `const as const` 패턴 사용 권장
   - 타입 추론과 Tree-shaking 활용

2. **기존 코드 마이그레이션**
   - 점진적으로 `enum`을 `const as const`로 전환
   - 타입 안정성 확보를 위한 철저한 테스트 필요

3. **예외 사항**
   - 숫자 enum이 필요한 특수한 경우
   - 역 매핑이 필요한 경우

## 참고 문헌

- [TypeScript enum과 Tree-shaking](https://xpectation.tistory.com/218)
- [LINE 기술 블로그: TypeScript enum과 Tree-shaking](https://engineering.linecorp.com/ko/blog/typescript-enum-tree-shaking)
