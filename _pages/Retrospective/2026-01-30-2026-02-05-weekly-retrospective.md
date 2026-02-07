---
title: "주간 회고록 (2026.01.30 ~ 2026.02.05)"
date: "2026-02-05"
tags: [회고, 모비닥, 주간회고]
---

## 개요

2026년 01월 5주차 회고록입니다. 이번 주에는 Jira 이슈 처리는 없었으나, **mobidoc-pdf 서비스의 대규모 리팩토링 및 성능 최적화** 작업을 집중적으로 수행했습니다. 총 **16개의 커밋**을 작성하여 PDF 합성 서비스의 코드 품질과 성능을 크게 개선했습니다.

| 항목 | 수량 |
|------|------|
| Jira 이슈 | 0개 |
| mobidoc-pdf 커밋 | 16개 |
| **총 커밋** | **16개** |

---

## 완료한 작업

### mobidoc-pdf 서비스 리팩토링 및 성능 최적화 (16개 커밋)

**레포지토리:** mobidoc-file (main)

#### 코드 리팩토링 (02-02, 2개 커밋)
- [mobidoc-pdf][refactor] Composite DTO 정리 - 불필요한 파일 핸들 제거
- [mobidoc-pdf][refactor] 파일 검증 로직 통합 - validateAndSaveFile 함수
  - PDF/PNG 검증 중복 코드 제거
  - fileValidation 구조체로 검증 파라미터 캡슐화
  - allowedPageSizes 맵으로 페이지 크기 검증

#### 성능 최적화 (02-02 ~ 02-03, 3개 커밋)
- [mobidoc-pdf][perf] 동시성 안전 및 메모리 최적화
- [mobidoc-pdf][perf] 뮤텍스 세분화로 PDF 생성 완전 병렬화
  - gofpdi.NewImporter()로 요청별 독립 인스턴스 생성
  - 폰트 바이트 복사본 사용으로 캐시 원본 보호
  - 전역 뮤텍스 제거로 직렬 → 완전 병렬 전환
- [mobidoc-pdf][perf] 폰트 Eager Loading 전환 - 서버 시작 시 사전 로드

#### 테스트 강화 (02-03, 2개 커밋)
- [mobidoc-pdf][test] composite 패키지 유닛 테스트 추가
- [mobidoc-pdf][test] 벤치마크 테스트 재작성 - 60개 시나리오, TempDir 이슈 해결

#### 새 기능 (02-03, 1개 커밋)
- [mobidoc-pdf][feat] 환경변수 기반 로그 레벨 시스템 도입

#### 문서화 (02-03, 3개 커밋)
- [mobidoc-pdf][docs] 성능 최적화 및 메모리 누수 개선 문서
- [mobidoc-pdf][docs] gofpdi.NewImporter() 오버헤드 분석 문서 추가
- [mobidoc-pdf][docs] CLAUDE.md에 서버 시작 흐름 및 eager loading 반영

#### 프로젝트 관리 (02-02 ~ 02-03, 5개 커밋)
- [mobidoc-pdf] chore: Makefile 추가
- [mobidoc-pdf] chore: README.md 수정
- [mobidoc-pdf] chore: .gitignore glob 패턴 수정 및 main 바이너리 제외
- [mobidoc-pdf] chore: .gitignore에 Go 테스트 바이너리 제외 패턴 추가
- [mobidoc-pdf][chore] make clean 누락 파일 보완 및 CLAUDE.md 개선

---

## 주요 성과 및 인사이트

### 1. PDF 생성 완전 병렬화 달성

기존에 전역 뮤텍스로 직렬 처리되던 PDF 생성을 **완전 병렬 처리**로 전환했습니다.

**핵심 변경:**
- `gofpdi.NewImporter()`로 요청별 독립 인스턴스 생성
- 폰트 바이트 복사본 사용으로 캐시 원본 보호
- `pdfGenerationMu` 전역 뮤텍스 제거

**효과:**
- 동시 요청 처리 능력 대폭 향상
- 서버 처리량(throughput) 증가

### 2. 파일 검증 로직 통합

PDF/PNG 검증 중복 코드를 `validateAndSaveFile` 함수로 통합했습니다.

**개선:**
- `fileValidation` 구조체로 파라미터 캡슐화
- `pdfMagicBytes`, `pngMagicBytes` 상수 분리
- `GetPdfFile`/`GetImageFile` 반환값 간소화
- 파일 핸들 즉시 close 처리

### 3. 테스트 커버리지 확대

벤치마크 테스트를 **60개 시나리오**로 재작성하고 composite 패키지 유닛 테스트를 추가했습니다.

### 4. 폰트 Eager Loading

서버 시작 시 폰트를 사전 로드하여 첫 요청 지연 시간을 제거했습니다.

### 5. 환경변수 기반 로그 레벨

운영/개발 환경에 따라 로그 레벨을 유연하게 조정할 수 있는 시스템을 도입했습니다.

---

## 다음 주 계획

1. **mobidoc-pdf HTTP 서버 타임아웃 설정**: ReadTimeout, WriteTimeout, IdleTimeout 적용
2. **mobidoc-pdf 성능 검증**: k6 부하 테스트로 병렬화 효과 측정
3. **Jira 이슈 처리 재개**: 모비닥 서비스 기능 개선 작업

---

## 통계

- **총 이슈 수**: 0개
- **총 커밋 수**: 16개 (mobidoc-pdf)

### 커밋 유형별 분포

| 유형 | 개수 | 비율 |
|------|------|------|
| chore (프로젝트 관리) | 5개 | 31.3% |
| perf (성능 최적화) | 3개 | 18.8% |
| docs (문서화) | 3개 | 18.8% |
| refactor (리팩토링) | 2개 | 12.5% |
| test (테스트) | 2개 | 12.5% |
| feat (새 기능) | 1개 | 6.3% |

### 일별 커밋 활동

```
2026-02-02: ██████ (6개) - 리팩토링 + 성능 최적화
2026-02-03: ██████████ (10개) - 테스트 + 문서화 + Eager Loading
```

### 기술 키워드

`#Go` `#PDF합성` `#병렬화` `#뮤텍스세분화` `#EagerLoading` `#벤치마크테스트` `#코드리팩토링` `#validateAndSaveFile` `#환경변수로그레벨` `#gofpdi`
