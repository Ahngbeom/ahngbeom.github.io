---
title: "Introduction"
date: "2026-10-26"
bookmark: true
thumbnail: https://www.mobidoc.us/images/signature_primary.svg
order: 1
tags:
    - Spring Boot
    - Java
    - MySQL
    - Go
    - Kubernetes
    - Vue.js
    - Nuxt.js
legacy_url: /Introduction.html
---
# 안범준 — Backend · Platform Engineer

> **전환 비용이 큰 시스템 변경을 끝까지 완료하는 백엔드 엔지니어**

의료 플랫폼 **모비닥(Mobidoc)**을 운영하는 (주)플라잉닥터에서 2023년 2월부터 백엔드 중심 풀스택 개발자로 일하고 있습니다. Java/Spring Boot 서버를 중심으로 Vue·Nuxt 프론트엔드와 Flutter 앱을 함께 맡고, 팀 내 DBA와 Kubernetes 배포 인프라도 담당합니다.

주로 해온 일은 구조 전환입니다. PG사 교체, 결제 서비스 MSA 분리, 진료 테이블 마이그레이션, MySQL 8 업그레이드, 빌드 파이프라인 재설계를 설계부터 운영 반영까지 진행했습니다.

- Email: `bbu0704@gmail.com`
- GitHub: [Ahngbeom](https://github.com/Ahngbeom)

---

## 측정된 결과

| 항목 | 이전 | 이후 |
|---|---:|---:|
| 배포 이미지 콜드 빌드 | 160s | **46s (−71%)** |
| 배포당 전송 레이어 | 293MB | **약 25MB (약 12배 감소)** |
| 일상 코드 변경 배포 빌드 | 약 74s | **21s (약 3.5배)** |
| 로컬 증분 컴파일 | 6.1s | **3.4s (−44%)** |
| PDF 합성 서버 동시 처리 | 전역 락 | **완전 병렬화** |

2023.02 ~ 2025.12 개인 커밋 **1,782개**, 처리 이슈 **1,063건**

---

## 경력 — (주)플라잉닥터 (2023.02 ~ 현재)

| 연도 | 성장 축 | 커밋 / 이슈 | 대표 성과 |
|---|---|---|---|
| 2023 | 통합과 기반 구축 | 596 / 382 | 진료 시스템 통합, PG사 전면 교체, MySQL 8 업그레이드, DB 스키마 저장소 구축 |
| 2024 | 아키텍처 현대화 | 486 / 529 | 진료 테이블 v2 마이그레이션, 결제 MSA 착수, Helm Chart 도입, API 문서 자동화 |
| 2025 | 플랫폼 성숙 | 700 / 152 | 결제 MSA 완료, Go PDF 합성 서비스 구축, SaaS 구독 런칭, DDL 자동화 파이프라인 |
| 2026 | 품질 고도화와 AI 도입 | — | 빌드·배포 최적화, PDF 서비스 병렬화, CI 테스트 전략, AI 슬로우 쿼리 분석(진행 중) |

연도별 자세한 내용은 [2023](/Retrospective/2023-02-01-2023-12-31-annual-retrospective.html) · [2024](/Retrospective/2024-01-01-2024-12-31-annual-retrospective.html) · [2025](/Retrospective/2025-01-01-2025-12-31-annual-retrospective.html) 연간 회고에 정리했습니다.

---

## 핵심 프로젝트

### 빌드·배포 파이프라인 최적화 (2026.08 ~ 09)
`Gradle` `Docker` `Jenkins` `layered jar`

- 모듈마다 이미지 안에서 클린 빌드를 다시 돌려 공유 모듈을 반복 컴파일하던 구조를 측정으로 분해했습니다.
- 컴파일은 Jenkins에서 한 번만 하고, 이미지는 JRE + layered jar로 의존성·코드 레이어를 분리했습니다.
- configuration cache는 3.7배 빨랐지만 데몬 재시작 후 계속 실패하는 회귀를 배포 전에 찾아 **롤백**했습니다.
- 결과: 콜드 빌드 −71%, 배포당 전송량 약 12배 감소, 이미지 −20%

### 처방전 PDF 합성 서비스 Go 신규 구축 (2025.03 ~ 2026.02)
`Go` `gofpdf` `Knative` `pprof`

- 운영 가능한 최소 형태 → 입력 검증·누수 수정 → 병렬화의 3단계로 발전시켰습니다.
- 프로파일링으로 초기 가설(전역 락 병목)이 틀렸고, 실제 병목은 PDF 파싱과 메모리 할당이라는 것을 확인했습니다.
- 폰트 캐싱이 만든 race condition을 요청별 복사로 막고, 60개 시나리오 벤치마크로 회귀 검증 체계를 만들었습니다.

### 결제 서비스 MSA 전환 (2024.11 ~ 2025.02)
`Spring Boot` `MySQL` `Kubernetes` `Helm`

- 데이터를 책임 기준으로 분리했습니다. 메인 스키마에는 조회용 상태·이력, 결제 스키마에는 PG 통신 원본을 두었습니다.
- 포트/어댑터 구조로 결제·환불·청구서·콜백의 연동 경계를 하나로 고정해 PG사 교체 비용을 낮췄습니다.

### AI 기반 슬로우 쿼리 원인 추적 (2026.07 ~ 진행 중)
`Python` `ChromaDB` `Embeddings` `n8n`

- 소스코드를 임베딩해 슬로우 쿼리와 벡터 검색으로 원본 코드를 역추적했습니다. 동적 SQL 때문에 문자열 검색이 안 되는 문제였습니다.
- 룰로 판단할 수 있는 부분은 룰 엔진에, 원인 추정과 개선안 서술만 LLM에 맡겼습니다.
- 의료 데이터가 외부로 나가지 않도록 인덱싱 대상을 소스코드로 한정했습니다.
- 진행 중인 프로젝트로, 효과는 운영 적용 후 측정해 갱신할 예정입니다.

### DBA — DB 운영 체계와 DDL 자동화 (2023.07 ~ 현재)
`MySQL 8` `GitLab CI` `Jenkins` `n8n`

- MySQL 5.7 → 8.0 업그레이드: 주변 객체(collation, definer, FK 이름) 점검 체크리스트를 먼저 만들고 staging에서 복원 검증했습니다.
- 스키마 동기화 → DDL 생성 → MR 자동 생성으로 이어지는 파이프라인을 만들었습니다.
- 진료 시스템 통합, 진료 테이블 v2, 결제/정산 테이블 분리 마이그레이션을 수행했습니다.

### PG사 전면 교체와 SaaS 구독 (2023.09 ~ 2025.12)
- 3개월에 걸쳐 PG사를 점진 전환했고, Flutter 앱카드를 Android/iOS 네이티브로 연동했습니다.
- 병원 홈페이지 SaaS 구독에서는 할인을 공급가액 기준으로 적용해 세금계산서 정합성을 맞췄습니다.

---

## 오픈소스 · 개인 프로젝트

| 프로젝트 | 설명 | 지표 |
|---|---|---|
| [datavase](https://github.com/Ahngbeom/datavase) | 터미널용 MySQL/MariaDB 클라이언트 (Go) | 릴리스 19회, Homebrew 배포 |
| [cc-menutor](https://github.com/Ahngbeom/cc-menutor) | Claude Code 사용량 macOS 메뉴바 모니터 (Swift) | 릴리스 16회, Homebrew 배포 |
| [dba-guide](https://github.com/Ahngbeom/dba-guide) | 단계별 DBA 학습서, DBMS별 브랜치 자동 생성 | 릴리스 7회 |
| [rest-tui](https://github.com/Ahngbeom/rest-tui) | IntelliJ `.http` 파일 실행 TUI (Go) | 릴리스 4회 |
| [workytree](https://github.com/Ahngbeom/workytree) | 프로젝트 단위 Git worktree 관리 도구 | 릴리스 3회 |

---

## 기술 스택

| 분야 | 실무 주력 | 실무 사용 |
|---|---|---|
| Backend | Java 21, Spring Boot 3, MyBatis, JPA/QueryDSL | Go, Redis, RabbitMQ |
| Database | MySQL 8 운영·튜닝·마이그레이션 | MariaDB, MSSQL, Liquibase, Flyway |
| Front · App | Vue 3, Nuxt 3, TypeScript | Flutter |
| Infra | Docker, Kubernetes, Helm, Jenkins | Knative, GitLab CI, k6, APM |
| Data · AI | Python, n8n | ChromaDB, Embeddings, Claude Code |

---

## 교육

- **42Seoul** 소프트웨어 개발자 양성 프로그램 (2020.12 ~ 2022.08)
- **숭실대학교 평생교육원** (2016.03 ~ 2019.08)
