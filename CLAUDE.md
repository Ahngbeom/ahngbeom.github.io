# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

개인 기술 블로그 (ahngbeom.github.io) — Astro 5 + TypeScript 기반 정적 사이트, GitHub Pages로 배포합니다.

## 개발 명령어

```bash
# 의존성 설치
npm ci

# 로컬 개발 서버 실행 (http://localhost:4321)
npm run dev

# 프로덕션 빌드 (dist/ 생성)
npm run build

# 빌드 결과 미리보기
npm run preview
```

> **린팅/포매팅 설정 없음**: ESLint, Prettier가 설정되어 있지 않습니다. 실행을 시도하지 마세요.

## 콘텐츠 아키텍처

### 블로그 포스트 구조

`src/content/posts/` 디렉토리의 폴더 구조가 카테고리를 결정합니다:

```
src/content/posts/
├── Introduction.md
├── Back-End/
│   └── [포스트들].md
├── Front-End/
├── Full-Stack/
├── DBA/
├── Infra/
├── App/
└── Retrospective/
    └── {연도}/{annual|monthly|weekly}/
        └── {날짜범위}-{타입}-retrospective.md
            # 주간: 2026-02-10-2026-02-16-weekly-retrospective.md
            # 월간: 2026-02-monthly-retrospective.md
            # 연간: 2025-annual-retrospective.md
```

### 카테고리 추론 방식

카테고리는 파일 경로에서 자동 추론됩니다 (`src/lib/content.ts`의 `toCategoryPath`). front matter에 `categoryPath`가 명시되지 않으면, 파일 ID의 디렉토리 세그먼트가 카테고리 경로로 사용됩니다.

**루트 포스트 처리**: `src/content/posts/Introduction.md`처럼 서브디렉토리 없이 루트에 위치한 파일은:
- `categoryPath: []` (빈 배열)
- `categoryLabel: 'Uncategorized'` (상수: `UNCATEGORIZED_CATEGORY`)
- `/category/Uncategorized/` 경로로 라우팅됨

### Front Matter 스키마 (`src/content/config.ts`)

**필수:**
```yaml
title: "포스트 제목"
```

**선택:**
```yaml
date: "YYYY-MM-DD"        # 날짜 (없으면 1900-01-01 폴백)
tags: [태그1, 태그2]       # 검색 및 관련 포스트 연결
thumbnail: "/path/to/img"  # 썸네일 이미지 (기본: /assets/img/thumbnail/empty.jpg)
bookmark: true              # 네비게이션 고정 표시
order: 1                    # 정렬 순서 (낮을수록 먼저)
draft: true                 # true이면 빌드에서 제외
summary: "요약 텍스트"      # 없으면 본문 첫 170자 자동 생성
categoryPath: [Back-End]    # 명시적 카테고리 (보통 경로에서 추론)
legacy_url: "/old/path"     # Jekyll 시절 URL 호환용
```

### URL 규칙

포스트 URL은 `/{content-id}.html` 형식입니다 (예: `/Back-End/결제 서비스 MSA 아키텍쳐 전환/0. Intro.html`).

## 코드 아키텍처

### 핵심 파일

| 파일 | 역할 |
|------|------|
| `astro.config.mjs` | Astro 설정 (static 출력, trailingSlash: ignore) |
| `src/config/site.ts` | 사이트 메타, 외부 서비스 키, 테마/레이아웃 설정 (`layout.postsPerPage: 12` 포함) |
| `src/content/config.ts` | Astro Content Collections 스키마 정의 |
| `src/lib/content.ts` | **핵심**: `UiPost` 인터페이스 정의, 포스트 정규화, 카테고리 추론, 페이지네이션 유틸리티 |
| `src/types/search.ts` | 클라이언트 검색 인덱스 타입 |
| `src/layouts/BaseLayout.astro` | 공통 HTML 셸 (head, 스크립트, 테마) |
| `tsconfig.json` | `astro/tsconfigs/strict` 확장, `baseUrl: "."` (절대 경로 임포트 가능) |

### UiPost 인터페이스 (`src/lib/content.ts`)

전체 코드베이스의 중심 데이터 모델. `getPublishedPosts()`가 반환하며, 모든 페이지/컴포넌트가 이 타입을 소비합니다.

```typescript
interface UiPost {
  id: string;          // content ID (URL 경로에 사용)
  title: string;
  date: Date;
  dateText: string;    // 포맷된 날짜 문자열
  tags: string[];
  summary: string;     // front matter 또는 본문 첫 170자 자동 생성
  thumbnail: string;
  categoryPath: string[];
  categoryLabel: string;
  url: string;         // /{id}.html
  legacyUrl: string;   // Jekyll 호환 URL
  entry: CollectionEntry<'posts'>;  // 원본 Astro 엔트리 (렌더링용)
}
```

### 라우팅 패턴

| 경로 파일 | URL | 설명 |
|-----------|-----|------|
| `src/pages/index.astro` | `/` | 홈 — 최신 포스트 목록 |
| `src/pages/page/[page].astro` | `/page/2` | 전체 포스트 페이지네이션 |
| `src/pages/[...slug].astro` | `/{id}.html` | 개별 포스트 페이지 |
| `src/pages/category/[...slug]/index.astro` | `/category/Back-End` | 카테고리별 목록 |
| `src/pages/category/[...slug]/page/[page].astro` | `/category/Back-End/page/2` | 카테고리 페이지네이션 |
| `src/pages/search-index.json.ts` | `/search-index.json` | 클라이언트 검색용 JSON 엔드포인트 |

### 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| `SiteHeader.astro` | 상단 헤더 (프로필, 네비게이션) |
| `CategoryNav.astro` | 카테고리 사이드바 네비게이션 |
| `PostCard.astro` | 포스트 카드 (목록 페이지용) |
| `PostToc.astro` | 포스트 목차 (Table of Contents) |
| `Pagination.astro` | 페이지네이션 UI |
| `SearchModal.astro` | 클라이언트 사이드 검색 모달 (`/` 키 단축키로 열기) |
| `Giscus.astro` | GitHub Discussions 댓글 위젯 |
| `ThemeToggle.astro` | 다크/라이트 테마 토글 |

## 스타일링

CSS 변수 기반 다크/라이트 테마 시스템:

- `src/styles/tokens.css` — 디자인 토큰 (색상, 간격, 타이포그래피)
- `src/styles/global.css` — 전역 리셋 및 기본 스타일
- `src/styles/post.css` — 포스트 본문 마크다운 렌더링 스타일
- 각 `.astro` 컴포넌트 내 `<style>` 태그 — 컴포넌트 스코프 스타일

## 외부 서비스

`src/config/site.ts`에서 설정:
- **giscus** — 댓글 시스템 (GitHub Discussions 기반)
- **GoatCounter** — 방문자 통계
- **Google Analytics** — 트래픽 분석

## 자동화 스크립트

`scripts/` 디렉토리에는 회고록 자동화 스크립트가 있습니다:

| 파일 | 역할 |
|------|------|
| `scripts/generate_retrospective.py` | Jira API로 주간 이슈 조회 → 마크다운 회고록 자동 생성 |
| `scripts/requirements.txt` | Python 의존성 (`requests` 등) |

Python 스크립트는 `.github/workflows/weekly-retrospective.yml`에서 주기적으로 실행됩니다.

## 배포

GitHub Actions 워크플로우:
- `.github/workflows/astro-deploy.yml` — master push 시 자동 배포 + 수동 트리거 지원
- `.github/workflows/astro-preview.yml` — PR 미리보기 빌드
- `.github/workflows/weekly-retrospective.yml` — 주간 회고 자동화

빌드 출력: `dist/` 디렉토리 → GitHub Pages

**빌드 검증 포인트**: CI에서 다음 파일 존재 여부를 확인합니다:
- `dist/index.html`
- `dist/search-index.json`

