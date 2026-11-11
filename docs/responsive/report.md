# 반응형 개선 및 검증 결과

[소스 분석 및 개선 계획](plan.md)에 따라 구현했다. 기준 소스는 `master@2eefdda`이며, 최종 검증은 프로덕션 정적 빌드와 Chromium 154에서 수행했다.

## 변경 내용

- **목록/카테고리**: 홈과 전체 글 페이지의 레이아웃을 공통 CSS로 통합했다. 981px 이상에서 250px 카테고리 사이드바, 980px 이하에서 내부 가로 스크롤 카테고리 목록을 사용한다. 글 카드는 601px 이상에서 이미지/본문 병렬, 600px 이하에서 세로 배치한다.
- **본문**: grid/flex의 최소 크기를 보정하고 긴 제목·태그·메타를 줄바꿈한다. 넓은 표와 코드는 요소 내부에서 스크롤하고, 이미지 비율을 유지한다. 좁은 화면의 목록 들여쓰기를 줄였다.
- **목차**: 1180px 이하에서는 본문 상단에 접힌 목차, 1181px 이상에서는 열린 sticky 사이드 목차를 제공한다. 화면 크기를 전환하면 상태도 맞춘다. 스크립트가 없어도 열린 기본 목차로 탐색할 수 있다.
- **검색/접근성**: 명시적 닫기 버튼, 16px 입력 글자, 결과 영역 내부 스크롤, 뷰포트 높이 제한, 배경 스크롤 잠금, Tab 순환 및 포커스 복귀를 추가했다. 동적으로 삽입한 검색 결과에 Astro scoped CSS가 적용되지 않던 문제도 수정했다. 헤더·테마·페이지 번호·검색 결과의 터치 영역, 키보드 포커스 표시, reduced-motion을 보완했다.
- **회귀 방지**: `npm run test:responsive`와 PR CI 검사 및 `responsive-evidence` 아티팩트를 추가했다.

## 측정 결과

| 항목 | 변경 전 | 변경 후 |
| --- | ---: | ---: |
| 375px 홈 카테고리 높이 | 약 500px | 139px |
| 375px 홈 글 목록 시작점 | 약 700px | 346px |
| 768px 홈 글 목록 시작점 | 649px | 288px |
| 375px MySQL 글 문서 폭 | 810px | 375px |
| 작은 화면의 글 목차 | 본문 뒤 (MySQL 글 약 5727px 지점) | 본문 앞, 기본 접힘 |

원본 스크린샷은 900px 높이에서, 변경 후는 아래의 실제 검증 뷰포트에서 캡처했다. 좌표는 뷰포트 상단 기준이며 폰트/애니메이션에 따라 소수점 차이가 있을 수 있다.

## 검증 결과

- `ASTRO_TELEMETRY_DISABLED=1 npm run build`: 성공, HTML 101페이지 생성.
- `npm run test:responsive`: 성공. 대표 6개 라우트 × 15개 화면 크기 = 90회, 전체 생성 101개 라우트 × 375/1440px = 202회, 합계 **292회 라우트·문서 넘침 검사** 통과.
- `git diff --check`: 성공.
- 검사한 라우트: 홈, 전체 글 2페이지, 회고 카테고리, 회고 카테고리 2페이지, MySQL 표 포함 글, Legacy API 코드 포함 글.
- 화면 크기: 320×740, 375×812, 390×844, 768×1024, 1024×768, 1440×900, 1920×1080. 전환 경계 600/601, 680/681, 980/981, 1180/1181px도 검사했다.
- 동작 검사: 검색 결과 표시, 검색 창 크기, 닫기/슬래시/Escape, Tab/Shift+Tab 포커스 순환 및 복귀, 테마 전환·새로고침 후 유지, 페이지 번호·카테고리 링크, 목차 위치·열기·앵커 이동, 주요 터치 컨트롤 44px 크기 모두 통과했다.
- 스트레스 검사: 실제 글에 테스트 전용 긴 제목·긴 코드·8열 표를 삽입해 320px에서 문서 넘침 없이 코드/표 내부 스크롤 가능함을 확인했다. 콘텐츠 파일은 수정하지 않았다.
- 667×320 가로 화면 검색 및 1440×900의 200% 확대에 해당하는 720×450 CSS 뷰포트 reflow 검사를 통과했다. 실제 브라우저 확대 조작과는 구분한다.
- 미처리 브라우저 JavaScript 오류 0건. 세부 수치: [results.json](results.json).

## 변경 전후 스크린샷

| 화면 | 변경 전 | 변경 후 |
| --- | --- | --- |
| 모바일 홈 375px | [원본](screenshots/before-home-375.png) | [개선](screenshots/after-home-375.png) |
| 태블릿 홈 768px | [원본](screenshots/before-home-768.png) | [개선](screenshots/after-home-768.png) |
| 1024px 홈 | [원본](screenshots/before-home-1024.png) | [개선](screenshots/after-home-1024.png) |
| PC 홈 1440px | [원본](screenshots/before-home-1440.png) | [개선](screenshots/after-home-1440.png) |
| 모바일 글 375px | [원본](screenshots/before-article-375.png) | [개선](screenshots/after-article-375.png) |
| PC 글 1440px | [원본](screenshots/before-article-1440.png) | [개선](screenshots/after-article-1440.png) |

추가: [768px 글](screenshots/after-article-768.png), [1024px 글](screenshots/after-article-1024.png), [모바일 검색 내부 스크롤](screenshots/after-search-375.png), [모바일 다크 테마](screenshots/after-home-dark-375.png).

## 재현

Node.js 20 이상을 사용한다.

```bash
npm ci
npx playwright install chromium
ASTRO_TELEMETRY_DISABLED=1 npm run build
npm run test:responsive
```

Linux에서 시스템 라이브러리가 필요하면 `npx playwright install --with-deps chromium`을 사용한다. `/usr/bin/chromium`이 있으면 자동 사용하며, 다른 시스템 Chromium은 `CHROMIUM_PATH`로 지정할 수 있다. 검증 스크립트가 4322 포트에서 preview를 시작하고 종료한다.

## 검증 범위와 한계

Chromium의 CSS 뷰포트 검사다. 실제 iOS Safari/Android, 소프트 키보드, 실제 핀치 확대는 검증하지 않았다. 테스트는 로컬 레이아웃과 상호작용을 분리해 확인하기 위해 외부 요청(프로필 이미지, 일부 썸네일, 분석 및 giscus)을 차단한다. 따라서 스크린샷에 외부 이미지의 대체 텍스트가 표시될 수 있으며, 외부 이미지/댓글 서비스 자체의 가용성은 이 결과에 포함하지 않는다. 실제 콘텐츠와 공개 URL, 외부 서비스 설정은 변경하지 않았다.
