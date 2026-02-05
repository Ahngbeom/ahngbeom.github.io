---
title: "2026 연봉 협상 성과 발표"
layout: default
sitemap: false
robots: noindex
---

<style>
/* ===== CSS Reset & Variables ===== */
* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --navy-900: #0f172a;
  --navy-800: #1e293b;
  --navy-700: #334155;
  --navy-600: #475569;
  --gold-500: #f59e0b;
  --gold-400: #fbbf24;
  --gold-300: #fcd34d;
  --white: #ffffff;
  --gray-100: #f1f5f9;
  --gray-200: #e2e8f0;
  --gray-400: #94a3b8;
  --success: #10b981;
  --font-display: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* ===== Presentation Container ===== */
.pres-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--navy-900);
  overflow: hidden;
  font-family: var(--font-display);
  z-index: 9999;
}

/* ===== Slide Base ===== */
.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  opacity: 0;
  visibility: hidden;
  transform: translateX(100px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide.active {
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
}

.slide.prev {
  transform: translateX(-100px);
}

/* ===== Slide 1: Cover ===== */
.slide-cover {
  background: linear-gradient(135deg, var(--navy-900) 0%, var(--navy-800) 50%, var(--navy-700) 100%);
  text-align: center;
}

.slide-cover::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.08) 0%, transparent 40%);
  pointer-events: none;
}

.cover-content {
  position: relative;
  z-index: 1;
}

.cover-badge {
  display: inline-block;
  background: var(--gold-500);
  color: var(--navy-900);
  padding: 0.5rem 1.5rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 2rem;
}

.cover-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 800;
  color: var(--white);
  line-height: 1.1;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.cover-title span {
  background: linear-gradient(135deg, var(--gold-400), var(--gold-300));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cover-subtitle {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  color: var(--gray-400);
  font-weight: 400;
  margin-bottom: 3rem;
}

.cover-meta {
  display: flex;
  gap: 3rem;
  justify-content: center;
  flex-wrap: wrap;
}

.meta-item {
  text-align: center;
}

.meta-label {
  font-size: 0.75rem;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.25rem;
}

.meta-value {
  font-size: 1.125rem;
  color: var(--white);
  font-weight: 600;
}

/* ===== Slide 2: Numbers ===== */
.slide-numbers {
  background: linear-gradient(180deg, var(--navy-900) 0%, var(--navy-800) 100%);
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-label {
  display: inline-block;
  color: var(--gold-500);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.section-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: var(--white);
  letter-spacing: -0.02em;
}

.numbers-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
}

.number-card {
  background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 1.5rem;
  padding: 2.5rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.number-card:hover {
  transform: translateY(-8px);
  border-color: var(--gold-500);
  box-shadow: 0 20px 40px rgba(245, 158, 11, 0.15);
}

.number-value {
  font-size: clamp(3rem, 6vw, 4.5rem);
  font-weight: 800;
  background: linear-gradient(135deg, var(--gold-400), var(--gold-500));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.number-label {
  font-size: 1.125rem;
  color: var(--white);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.number-detail {
  font-size: 0.875rem;
  color: var(--gray-400);
}

/* ===== Slide 3: Projects ===== */
.slide-projects {
  background: var(--navy-900);
  align-items: flex-start;
  padding-top: 3rem;
}

.projects-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 1000px;
}

.project-card {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 2rem;
  background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  transition: all 0.3s ease;
}

.project-card:hover {
  border-color: var(--gold-500);
  background: linear-gradient(145deg, rgba(245,158,11,0.08) 0%, rgba(245,158,11,0.02) 100%);
}

.project-rank {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.rank-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--gold-500);
  line-height: 1;
}

.rank-label {
  font-size: 0.625rem;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.project-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 0.5rem;
}

.project-period {
  font-size: 0.875rem;
  color: var(--gold-400);
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.project-desc {
  font-size: 1rem;
  color: var(--gray-400);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.project-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: rgba(245, 158, 11, 0.15);
  color: var(--gold-400);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

/* ===== Slide 4: Growth ===== */
.slide-growth {
  background: linear-gradient(180deg, var(--navy-800) 0%, var(--navy-900) 100%);
}

.growth-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  width: 100%;
  max-width: 1100px;
}

.skills-section h3 {
  font-size: 1.25rem;
  color: var(--white);
  margin-bottom: 2rem;
  font-weight: 600;
}

.skill-item {
  margin-bottom: 1.5rem;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.skill-name {
  font-size: 0.95rem;
  color: var(--white);
  font-weight: 500;
}

.skill-level {
  font-size: 0.875rem;
  color: var(--gold-400);
  font-weight: 600;
}

.skill-bar {
  height: 8px;
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold-500), var(--gold-400));
  border-radius: 4px;
  transition: width 1s ease;
}

.comparison-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.compare-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 1rem;
  padding: 1.5rem;
}

.compare-card.before {
  border-color: rgba(148, 163, 184, 0.3);
}

.compare-card.after {
  border-color: var(--gold-500);
  background: rgba(245, 158, 11, 0.05);
}

.compare-title {
  font-size: 0.75rem;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  text-align: center;
}

.compare-card.after .compare-title {
  color: var(--gold-400);
}

.compare-list {
  list-style: none;
}

.compare-list li {
  font-size: 0.9rem;
  color: var(--gray-200);
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.compare-list li:last-child {
  border-bottom: none;
}

.compare-list li::before {
  content: '→';
  color: var(--gray-400);
  font-size: 0.75rem;
}

.compare-card.after .compare-list li::before {
  content: '★';
  color: var(--gold-500);
}

/* ===== Slide 5: Vision ===== */
.slide-vision {
  background: var(--navy-900);
}

.vision-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
  max-width: 1000px;
}

.vision-card {
  background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 1.5rem;
  padding: 2.5rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.vision-card:hover {
  transform: translateY(-8px);
  border-color: var(--gold-500);
}

.vision-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, var(--gold-500), var(--gold-400));
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin: 0 auto 1.5rem;
}

.vision-card h4 {
  font-size: 1.25rem;
  color: var(--white);
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.vision-card p {
  font-size: 0.95rem;
  color: var(--gray-400);
  line-height: 1.6;
}

/* ===== Slide 6: Thanks ===== */
.slide-thanks {
  background: linear-gradient(135deg, var(--navy-900) 0%, var(--navy-800) 100%);
  text-align: center;
}

.slide-thanks::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.thanks-content {
  position: relative;
  z-index: 1;
}

.thanks-title {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 800;
  color: var(--white);
  margin-bottom: 2rem;
}

.thanks-message {
  font-size: clamp(1.125rem, 2.5vw, 1.5rem);
  color: var(--gray-200);
  line-height: 1.8;
  max-width: 700px;
  margin: 0 auto 3rem;
}

.thanks-quote {
  font-size: 1.125rem;
  color: var(--gold-400);
  font-style: italic;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.1);
  max-width: 500px;
  margin: 0 auto;
}

/* ===== Navigation ===== */
.pres-nav {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 10000;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  padding: 0.75rem 1.5rem;
  border-radius: 3rem;
  border: 1px solid rgba(255,255,255,0.1);
}

.nav-btn {
  width: 44px;
  height: 44px;
  background: transparent;
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: 50%;
  color: var(--white);
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover:not(:disabled) {
  background: var(--gold-500);
  border-color: var(--gold-500);
  color: var(--navy-900);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.slide-indicator {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: var(--gold-500);
  width: 24px;
  border-radius: 4px;
}

.dot:hover:not(.active) {
  background: rgba(255,255,255,0.5);
}

.slide-counter {
  color: var(--gray-400);
  font-size: 0.875rem;
  font-weight: 500;
  min-width: 50px;
  text-align: center;
}

/* ===== Fullscreen Button ===== */
.fullscreen-btn {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  width: 44px;
  height: 44px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 0.75rem;
  color: var(--white);
  font-size: 1.25rem;
  cursor: pointer;
  z-index: 10000;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-btn:hover {
  background: var(--gold-500);
  color: var(--navy-900);
}

/* ===== Progress Bar ===== */
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(255,255,255,0.1);
  z-index: 10000;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold-500), var(--gold-400));
  transition: width 0.4s ease;
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .slide { padding: 2rem; }
  .numbers-grid { grid-template-columns: repeat(2, 1fr); }
  .growth-content { grid-template-columns: 1fr; gap: 2rem; }
  .vision-grid { grid-template-columns: 1fr; }
  .project-card { grid-template-columns: 60px 1fr; gap: 1rem; }
}

@media (max-width: 768px) {
  .numbers-grid { grid-template-columns: 1fr; }
  .comparison-section { grid-template-columns: 1fr; }
  .cover-meta { flex-direction: column; gap: 1rem; }
  .pres-nav { padding: 0.5rem 1rem; }
}

/* ===== Print ===== */
@media print {
  .pres-container { position: static; height: auto; }
  .slide {
    position: static;
    opacity: 1;
    visibility: visible;
    transform: none;
    page-break-after: always;
    min-height: 100vh;
  }
  .pres-nav, .fullscreen-btn, .progress-bar { display: none; }
}
</style>

<div class="pres-container" id="presentation">
  <!-- Progress Bar -->
  <div class="progress-bar">
    <div class="progress-fill" id="progressFill"></div>
  </div>

  <!-- Fullscreen Button -->
  <button class="fullscreen-btn" id="fullscreenBtn" title="전체화면 (F)">⛶</button>

  <!-- Slide 1: Cover -->
  <section class="slide slide-cover active" data-slide="1">
    <div class="cover-content">
      <div class="cover-badge">Performance Review 2026</div>
      <h1 class="cover-title">3년간의 <span>성장</span></h1>
      <p class="cover-subtitle">주니어에서 미드레벨 개발자로의 여정</p>
      <div class="cover-meta">
        <div class="meta-item">
          <div class="meta-label">발표자</div>
          <div class="meta-value">bahn</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">포지션</div>
          <div class="meta-value">Back-End Developer</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">소속</div>
          <div class="meta-value">모비닥</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">기간</div>
          <div class="meta-value">2023.02 - 2026.01</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Slide 2: Numbers -->
  <section class="slide slide-numbers" data-slide="2">
    <div class="section-header">
      <div class="section-label">Key Metrics</div>
      <h2 class="section-title">핵심 성과 지표</h2>
    </div>
    <div class="numbers-grid">
      <div class="number-card">
        <div class="number-value" data-count="730">0</div>
        <div class="number-label">Jira 이슈</div>
        <div class="number-detail">월평균 20개+ 처리</div>
      </div>
      <div class="number-card">
        <div class="number-value" data-count="760">0</div>
        <div class="number-label">Git 커밋</div>
        <div class="number-detail">일평균 1+ 유지</div>
      </div>
      <div class="number-card">
        <div class="number-value" data-count="95" data-suffix="%">0</div>
        <div class="number-label">완료율</div>
        <div class="number-detail">On-Time Delivery</div>
      </div>
      <div class="number-card">
        <div class="number-value" data-text="75:25">—</div>
        <div class="number-label">BE : FE</div>
        <div class="number-detail">Backend Architect</div>
      </div>
    </div>
  </section>

  <!-- Slide 3: Projects -->
  <section class="slide slide-projects" data-slide="3">
    <div class="section-header">
      <div class="section-label">S-Tier Projects</div>
      <h2 class="section-title">TOP 3 핵심 프로젝트</h2>
    </div>
    <div class="projects-grid">
      <div class="project-card">
        <div class="project-rank">
          <div class="rank-number">01</div>
          <div class="rank-label">Project</div>
        </div>
        <div class="project-content">
          <h3>결제 시스템 현대화</h3>
          <div class="project-period">2023년 9월 - 2024년 11월</div>
          <p class="project-desc">Payple → 결제선생 PG사 전환 단독 수행 후, 결제 서비스 MSA 분리까지 주도. 회사 최초 MSA 전환 성공, 장애 격리 및 독립 배포 체계 확립.</p>
          <div class="project-tags">
            <span class="tag">PG 연동</span>
            <span class="tag">MSA</span>
            <span class="tag">Spring Cloud</span>
            <span class="tag">장애 격리</span>
          </div>
        </div>
      </div>
      <div class="project-card">
        <div class="project-rank">
          <div class="rank-number">02</div>
          <div class="rank-label">Project</div>
        </div>
        <div class="project-content">
          <h3>가예약 시스템 구축 및 안정화</h3>
          <div class="project-period">2024년 11월 - 2025년 1월</div>
          <p class="project-desc">병원 가예약 시스템 신규 구축. 설계부터 안정화까지 3개월, 100% 단독 책임 완수. 구축 → 버그 수정 → 최종 완료까지 End-to-End 프로젝트 리드.</p>
          <div class="project-tags">
            <span class="tag">0→1 구축</span>
            <span class="tag">DB 설계</span>
            <span class="tag">API 개발</span>
            <span class="tag">Batch</span>
          </div>
        </div>
      </div>
      <div class="project-card">
        <div class="project-rank">
          <div class="rank-number">03</div>
          <div class="rank-label">Project</div>
        </div>
        <div class="project-content">
          <h3>병원 홈페이지 구독 서비스 (SaaS)</h3>
          <div class="project-period">2025년 12월</div>
          <p class="project-desc">신규 Recurring Revenue 모델 구축. 구독 신청/관리/해지/결제 전체 프로세스 개발. 71개 커밋, 506개 파일, +33,000줄 순증.</p>
          <div class="project-tags">
            <span class="tag">SaaS</span>
            <span class="tag">DDD</span>
            <span class="tag">이벤트 기반</span>
            <span class="tag">Revenue Model</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Slide 4: Growth -->
  <section class="slide slide-growth" data-slide="4">
    <div class="section-header">
      <div class="section-label">Technical Growth</div>
      <h2 class="section-title">기술 역량 성장</h2>
    </div>
    <div class="growth-content">
      <div class="skills-section">
        <h3>역량 평가</h3>
        <div class="skill-item">
          <div class="skill-header">
            <span class="skill-name">아키텍처 설계</span>
            <span class="skill-level">★★★★★</span>
          </div>
          <div class="skill-bar"><div class="skill-fill" data-width="100"></div></div>
        </div>
        <div class="skill-item">
          <div class="skill-header">
            <span class="skill-name">장애 대응</span>
            <span class="skill-level">★★★★★</span>
          </div>
          <div class="skill-bar"><div class="skill-fill" data-width="100"></div></div>
        </div>
        <div class="skill-item">
          <div class="skill-header">
            <span class="skill-name">도메인 모델링</span>
            <span class="skill-level">★★★★★</span>
          </div>
          <div class="skill-bar"><div class="skill-fill" data-width="100"></div></div>
        </div>
        <div class="skill-item">
          <div class="skill-header">
            <span class="skill-name">코드 품질 & 문서화</span>
            <span class="skill-level">★★★★☆</span>
          </div>
          <div class="skill-bar"><div class="skill-fill" data-width="80"></div></div>
        </div>
        <div class="skill-item">
          <div class="skill-header">
            <span class="skill-name">End-to-End 개발</span>
            <span class="skill-level">★★★★☆</span>
          </div>
          <div class="skill-bar"><div class="skill-fill" data-width="80"></div></div>
        </div>
      </div>
      <div class="comparison-section">
        <div class="compare-card before">
          <div class="compare-title">입사 초기 (2023)</div>
          <ul class="compare-list">
            <li>기존 코드 유지보수</li>
            <li>할당된 태스크 구현</li>
            <li>명세 기반 개발</li>
            <li>Reactive 대응</li>
          </ul>
        </div>
        <div class="compare-card after">
          <div class="compare-title">현재 (2026)</div>
          <ul class="compare-list">
            <li>MSA/DDD 아키텍처 설계</li>
            <li>신규 서비스 0→1 구축</li>
            <li>결제/구독 도메인 전문화</li>
            <li>기술 스택 선정 주도</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Slide 5: Vision -->
  <section class="slide slide-vision" data-slide="5">
    <div class="section-header">
      <div class="section-label">2026 Roadmap</div>
      <h2 class="section-title">향후 기여 계획</h2>
    </div>
    <div class="vision-grid">
      <div class="vision-card">
        <div class="vision-icon">💳</div>
        <h4>결제 플랫폼 확장</h4>
        <p>CRM 포인트 충전 서비스 확대, 결제 옵션 다각화로 수익 채널 강화</p>
      </div>
      <div class="vision-card">
        <div class="vision-icon">🏗️</div>
        <h4>MSA 2nd Wave</h4>
        <p>예약/진료 도메인 분리, 마이크로서비스 생태계 확장 주도</p>
      </div>
      <div class="vision-card">
        <div class="vision-icon">📊</div>
        <h4>데이터 기반 운영</h4>
        <p>APM 고도화, 실시간 모니터링으로 선제적 장애 대응 체계 구축</p>
      </div>
    </div>
  </section>

  <!-- Slide 6: Thanks -->
  <section class="slide slide-thanks" data-slide="6">
    <div class="thanks-content">
      <h2 class="thanks-title">감사합니다</h2>
      <p class="thanks-message">
        3년간 결제 시스템 현대화, MSA 전환, SaaS 모델 구축 등<br>
        핵심 프로젝트를 주도하며 비즈니스 성장에 기여했습니다.<br>
        앞으로도 기술 전문성을 바탕으로 회사의 핵심 인프라를 책임지겠습니다.
      </p>
      <p class="thanks-quote">
        "기술로 비즈니스 가치를 만드는 개발자"
      </p>
    </div>
  </section>

  <!-- Navigation -->
  <nav class="pres-nav">
    <button class="nav-btn" id="prevBtn" title="이전 (←)">‹</button>
    <div class="slide-indicator" id="slideIndicator"></div>
    <span class="slide-counter" id="slideCounter">1 / 6</span>
    <button class="nav-btn" id="nextBtn" title="다음 (→)">›</button>
  </nav>
</div>

<script>
(function() {
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  let currentSlide = 1;
  let isAnimating = false;

  // Initialize
  function init() {
    createDots();
    updateSlide();
    setupEventListeners();
    hideDefaultLayout();
  }

  // Hide Jekyll default layout elements
  function hideDefaultLayout() {
    const sidebar = document.querySelector('.sidebar');
    const post = document.getElementById('post');
    const stars = document.getElementById('stars');
    if (sidebar) sidebar.style.display = 'none';
    if (post) post.style.display = 'none';
    if (stars) stars.style.display = 'none';
    document.body.style.overflow = 'hidden';
  }

  // Create navigation dots
  function createDots() {
    const indicator = document.getElementById('slideIndicator');
    for (let i = 1; i <= totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 1 ? ' active' : '');
      dot.dataset.slide = i;
      dot.addEventListener('click', () => goToSlide(i));
      indicator.appendChild(dot);
    }
  }

  // Update slide display
  function updateSlide() {
    slides.forEach((slide, index) => {
      const slideNum = index + 1;
      slide.classList.remove('active', 'prev');
      if (slideNum === currentSlide) {
        slide.classList.add('active');
        animateSlideContent(slide);
      } else if (slideNum < currentSlide) {
        slide.classList.add('prev');
      }
    });

    // Update dots
    document.querySelectorAll('.dot').forEach((dot, index) => {
      dot.classList.toggle('active', index + 1 === currentSlide);
    });

    // Update counter
    document.getElementById('slideCounter').textContent = `${currentSlide} / ${totalSlides}`;

    // Update progress bar
    const progress = (currentSlide / totalSlides) * 100;
    document.getElementById('progressFill').style.width = progress + '%';

    // Update buttons
    document.getElementById('prevBtn').disabled = currentSlide === 1;
    document.getElementById('nextBtn').disabled = currentSlide === totalSlides;
  }

  // Animate slide content
  function animateSlideContent(slide) {
    // Animate number counters
    slide.querySelectorAll('.number-value[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '+';
      animateCounter(el, target, suffix);
    });

    // Animate text values
    slide.querySelectorAll('.number-value[data-text]').forEach(el => {
      el.textContent = el.dataset.text;
    });

    // Animate skill bars
    slide.querySelectorAll('.skill-fill').forEach(el => {
      const width = el.dataset.width;
      setTimeout(() => {
        el.style.width = width + '%';
      }, 300);
    });
  }

  // Counter animation
  function animateCounter(element, target, suffix) {
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeOut);
      element.textContent = current + (progress === 1 ? suffix : '');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // Navigation
  function goToSlide(num) {
    if (isAnimating || num === currentSlide || num < 1 || num > totalSlides) return;
    isAnimating = true;
    currentSlide = num;
    updateSlide();
    setTimeout(() => isAnimating = false, 600);
  }

  function nextSlide() {
    if (currentSlide < totalSlides) goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    if (currentSlide > 1) goToSlide(currentSlide - 1);
  }

  // Fullscreen
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.getElementById('presentation').requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  // Event listeners
  function setupEventListeners() {
    document.getElementById('nextBtn').addEventListener('click', nextSlide);
    document.getElementById('prevBtn').addEventListener('click', prevSlide);
    document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);

    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          prevSlide();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(1);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(totalSlides);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
          break;
      }
    });

    // Number key navigation (1-6)
    document.addEventListener('keydown', (e) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= totalSlides) {
        goToSlide(num);
      }
    });
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>
