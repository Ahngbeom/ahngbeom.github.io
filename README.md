[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](https://opensource.org/licenses/MIT)

# ahngbeom.github.io

Astro + TypeScript 기반 개인 기술 블로그 저장소입니다.

## 기술 스택
- Astro (static site)
- TypeScript
- Markdown Content Collections
- GitHub Pages (GitHub Actions 배포)

## 핵심 기능
- 카테고리/페이지네이션 기반 아카이브
- 제목/태그/카테고리 검색
- 포스트 TOC(Table of Contents)
- 다크/라이트 테마 토글
- giscus 댓글
- 기존 포스트 `.html` URL 호환

## 빠른 시작

### 요구사항
- Node.js `>= 18.20.8` (권장: Node 20)

### 설치
```bash
npm ci
```

### 로컬 실행
```bash
npm run dev
```

### 프로덕션 빌드
```bash
npm run build
```

### 빌드 결과 미리보기
```bash
npm run preview
```

## 콘텐츠 관리

### 콘텐츠 위치
- 포스트: `src/content/posts/**`
- 정적 에셋: `public/assets/**`

### Front Matter 권장 필드
- `title`: 포스트 제목
- `date`: 작성일 (`YYYY-MM-DD`)
- `tags`: 태그 배열
- `thumbnail`: 썸네일 경로
- `summary`: 목록/검색에 사용할 요약
- `categoryPath`: 카테고리 경로 배열 (미지정 시 경로 기반 추론)
- `legacy_url`: 레거시 링크 호환용 URL
- `draft`: 초안 여부 (`true`면 비공개)

### URL 규칙
- 포스트 URL: `/${post.id}.html`
- 카테고리 URL: `/category/<path>/`

## 프로젝트 구조
```text
.
├── .github/workflows/
│   ├── astro-preview.yml
│   ├── astro-deploy.yml
│   └── weekly-retrospective.yml
├── public/assets/
├── scripts/
├── src/
│   ├── components/
│   ├── config/
│   ├── content/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   ├── styles/
│   └── types/
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 배포

### 1) Preview 빌드 (운영 반영 없음)
워크플로우: `Astro Preview Build`

트리거:
- `blog-architecture-review` 브랜치 push
- `master` 대상 pull request

동작:
1. `npm ci`
2. `npm run build`
3. `dist/index.html`, `dist/search-index.json` 검증
4. `astro-dist-preview` 아티팩트 업로드

### 2) 수동 운영 배포
워크플로우: `Astro Deploy to GitHub Pages`

트리거:
- `workflow_dispatch`

입력:
- `ref`: 배포할 브랜치/태그/SHA (기본값: `blog-architecture-review`)

동작:
1. 지정 ref checkout
2. 빌드 및 산출물 검증
3. GitHub Pages 아티팩트 업로드
4. Pages 배포

### 3) 롤백
문제 발생 시:
1. `git log --oneline`으로 마지막 안정 SHA 확인
2. `Astro Deploy to GitHub Pages` 재실행
3. `ref`에 안정 SHA 입력 후 재배포

## 운영 체크리스트

### 배포 전
- `npm run build` 성공
- 주요 카테고리 경로 확인
  - `/category/Retrospective/`
  - `/category/Uncategorized/`
- 검색 모달 동작 확인 (`Search` 버튼, `/` 단축키)
- 대표 포스트 `*.html` URL 확인

### 배포 후
- 홈/카테고리/포스트 상세 페이지 렌더링 확인
- 검색 결과 노출/이동 확인
- 댓글(giscus) 로딩 확인

## 자동화 스크립트
- 주간 회고 생성: `python scripts/generate_retrospective.py`
- 의존성 설치: `pip install -r scripts/requirements.txt`

## 기여 가이드
- 커밋 prefix 권장: `docs:`, `feat:`, `fix:`, `chore:`
- PR에 포함할 내용:
  - 변경 요약
  - 영향 범위
  - 로컬 검증 명령
  - UI 변경 시 스크린샷

## 라이선스
이 저장소는 [MIT License](LICENSE)를 따릅니다.
