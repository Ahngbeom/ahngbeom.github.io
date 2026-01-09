# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

개인 기술 블로그 (ahngbeom.github.io) - Jekyll 기반 GitHub Pages 사이트로, jekyll-theme-satellite 테마를 사용합니다.

## 개발 명령어

```bash
# 의존성 설치
bundle install

# 로컬 서버 실행 (http://localhost:4000)
bundle exec jekyll serve

# 빌드만 수행
bundle exec jekyll build
```

## 콘텐츠 아키텍처

### 블로그 포스트 구조

`_pages/` 디렉토리의 폴더 구조가 사이드바 네비게이션과 카테고리 분류를 결정합니다:

```
_pages/
├── index.md                    # 필수: 빈 front matter (---\n---)
├── Introduction.md             # 메인 소개 페이지
├── Back-End/
│   ├── index.md               # 필수: 각 디렉토리마다 필요
│   └── [포스트들].md
├── Front-End/
├── Full-Stack/
├── DBA/
├── Infra/
└── App/
```

### 포스트 작성 규칙

**필수 front matter:**
```yaml
---
title: "포스트 제목"
date: "YYYY-MM-DD"
---
```

**선택적 front matter:**
- `thumbnail: "/path/to/image"` - 썸네일 이미지
- `tags: [태그1, 태그2]` - 검색 및 관련 포스트 연결용
- `bookmark: true` - 사이드바 네비게이션에 고정 표시
- `order: 숫자` - 정렬 순서 (낮을수록 먼저)

**디렉토리 규칙:**
- 새 카테고리(폴더) 생성 시 반드시 `index.md` 파일 포함 (내용: `---\n---`)
- 서브카테고리는 무한 중첩 가능

## 레이아웃 구조

- `_layouts/default.html` - 기본 HTML 구조
- `_layouts/page.html` - 포스트 페이지 레이아웃
- `_includes/` - 재사용 컴포넌트 (sidebar, navigation, post, search 등)
- `_sass/` - 스타일시트 (darkmode, layout, post, sidebar 등)

## 외부 서비스 연동

`_config.yml`에서 설정:
- **giscus**: 댓글 시스템 (GitHub Discussions 기반)
- **goatcounter**: 방문자 통계
- **Google Analytics**: 트래픽 분석

## 빌드 제외 경로

`docs/` 디렉토리는 빌드에서 제외됨 (테마 문서용)
