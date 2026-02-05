---
title: "2026 연봉 협상 성과 발표"
sitemap: false
robots: noindex
---

<style>
/* ===== 기본 리셋 및 변수 ===== */
:root {
  --primary: #1a365d;
  --primary-light: #2c5282;
  --accent: #d69e2e;
  --accent-light: #ecc94b;
  --text-dark: #1a202c;
  --text-light: #718096;
  --bg-light: #f7fafc;
  --bg-card: #ffffff;
  --gradient-primary: linear-gradient(135deg, #1a365d 0%, #2c5282 100%);
  --gradient-accent: linear-gradient(135deg, #d69e2e 0%, #ecc94b 100%);
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 25px rgba(0,0,0,0.15);
  --radius: 12px;
}

/* 다크모드 대응 */
.dark-theme {
  --primary: #63b3ed;
  --primary-light: #90cdf4;
  --accent: #ecc94b;
  --accent-light: #faf089;
  --text-dark: #f7fafc;
  --text-light: #a0aec0;
  --bg-light: #1a202c;
  --bg-card: #2d3748;
}

/* 프레젠테이션 컨테이너 */
.presentation {
  font-family: 'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
  max-width: 100%;
  margin: 0 auto;
  color: var(--text-dark);
}

/* 슬라이드 공통 스타일 */
.slide {
  min-height: 85vh;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.slide:last-child {
  border-bottom: none;
}

.slide-number {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  font-size: 0.875rem;
  color: var(--text-light);
  font-weight: 500;
}

/* ===== 슬라이드 1: 표지 ===== */
.slide-cover {
  background: var(--gradient-primary);
  color: white;
  text-align: center;
}

.slide-cover .title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.slide-cover .subtitle {
  font-size: 1.5rem;
  font-weight: 400;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.slide-cover .meta {
  font-size: 1.125rem;
  opacity: 0.8;
}

.slide-cover .meta span {
  display: block;
  margin: 0.5rem 0;
}

.slide-cover .period-badge {
  display: inline-block;
  background: var(--accent);
  color: var(--primary);
  padding: 0.5rem 1.5rem;
  border-radius: 2rem;
  font-weight: 700;
  margin-top: 1.5rem;
}

/* ===== 슬라이드 2: 핵심 숫자 ===== */
.slide-numbers {
  background: var(--bg-light);
}

.slide-numbers h2 {
  text-align: center;
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: 3rem;
}

.numbers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.number-card {
  background: var(--bg-card);
  padding: 2rem;
  border-radius: var(--radius);
  text-align: center;
  box-shadow: var(--shadow-md);
  transition: transform 0.3s ease;
}

.number-card:hover {
  transform: translateY(-5px);
}

.number-card .value {
  font-size: 4rem;
  font-weight: 800;
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.number-card .label {
  font-size: 1.125rem;
  color: var(--text-light);
  margin-top: 0.5rem;
  font-weight: 500;
}

.number-card .detail {
  font-size: 0.875rem;
  color: var(--text-light);
  margin-top: 0.25rem;
}

/* ===== 슬라이드 3: TOP 3 프로젝트 ===== */
.slide-projects {
  background: var(--bg-card);
}

.slide-projects h2 {
  text-align: center;
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.slide-projects .section-subtitle {
  text-align: center;
  color: var(--text-light);
  margin-bottom: 2.5rem;
}

.projects-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

.project-card {
  background: var(--bg-light);
  border-radius: var(--radius);
  padding: 1.5rem 2rem;
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  box-shadow: var(--shadow-sm);
  border-left: 4px solid var(--accent);
}

.project-rank {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--accent);
  line-height: 1;
  min-width: 50px;
}

.project-content {
  flex: 1;
}

.project-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.project-period {
  font-size: 0.875rem;
  color: var(--accent);
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.project-desc {
  font-size: 0.95rem;
  color: var(--text-dark);
  line-height: 1.6;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.project-tag {
  background: var(--primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

/* ===== 슬라이드 4: 기술적 성장 ===== */
.slide-growth {
  background: var(--bg-light);
}

.slide-growth h2 {
  text-align: center;
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: 2.5rem;
}

.growth-container {
  max-width: 800px;
  margin: 0 auto;
}

.growth-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.growth-label {
  width: 140px;
  font-weight: 600;
  color: var(--text-dark);
  font-size: 0.95rem;
}

.growth-bar-container {
  flex: 1;
  background: rgba(0,0,0,0.1);
  border-radius: 1rem;
  height: 28px;
  overflow: hidden;
  position: relative;
}

.growth-bar {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.75rem;
  transition: width 1s ease;
}

.growth-bar span {
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
}

.growth-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2.5rem;
}

.comparison-card {
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
}

.comparison-card h4 {
  font-size: 1rem;
  color: var(--text-light);
  margin-bottom: 1rem;
  text-align: center;
}

.comparison-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.comparison-card li {
  padding: 0.5rem 0;
  font-size: 0.9rem;
  color: var(--text-dark);
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.comparison-card li:last-child {
  border-bottom: none;
}

.comparison-card li::before {
  content: "•";
  color: var(--accent);
  font-weight: bold;
  margin-right: 0.5rem;
}

/* ===== 슬라이드 5: 2026년 비전 ===== */
.slide-vision {
  background: var(--bg-card);
}

.slide-vision h2 {
  text-align: center;
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: 2.5rem;
}

.vision-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

.vision-card {
  background: var(--bg-light);
  padding: 1.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  text-align: center;
}

.vision-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.vision-card h4 {
  font-size: 1.125rem;
  color: var(--primary);
  margin-bottom: 0.75rem;
}

.vision-card p {
  font-size: 0.9rem;
  color: var(--text-dark);
  line-height: 1.6;
}

/* ===== 슬라이드 6: 감사 ===== */
.slide-thanks {
  background: var(--gradient-primary);
  color: white;
  text-align: center;
}

.slide-thanks h2 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
}

.slide-thanks .message {
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.8;
}

.slide-thanks .quote {
  font-size: 1.125rem;
  font-style: italic;
  opacity: 0.8;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.2);
}

/* ===== 네비게이션 ===== */
.pres-nav {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  gap: 0.5rem;
  z-index: 100;
}

.pres-nav button {
  background: var(--primary);
  color: white;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 1.25rem;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
}

.pres-nav button:hover {
  background: var(--accent);
  transform: scale(1.1);
}

.pres-nav button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
}

/* ===== 진행 표시 ===== */
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(0,0,0,0.1);
  z-index: 100;
}

.progress-fill {
  height: 100%;
  background: var(--accent);
  transition: width 0.3s ease;
}

/* ===== 반응형 ===== */
@media (max-width: 768px) {
  .slide {
    padding: 2rem 1rem;
    min-height: auto;
  }

  .slide-cover .title {
    font-size: 2rem;
  }

  .number-card .value {
    font-size: 2.5rem;
  }

  .project-card {
    flex-direction: column;
    gap: 1rem;
  }

  .growth-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .growth-label {
    width: 100%;
  }

  .growth-comparison {
    grid-template-columns: 1fr;
  }

  .pres-nav {
    bottom: 1rem;
    right: 1rem;
  }

  .pres-nav button {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
}

/* ===== 프린트 스타일 ===== */
@media print {
  .slide {
    page-break-after: always;
    min-height: 100vh;
  }

  .pres-nav,
  .progress-bar {
    display: none;
  }

  .slide-cover,
  .slide-thanks {
    color: var(--primary) !important;
    background: white !important;
  }
}
</style>

<div class="presentation">
  <!-- 진행 표시바 -->
  <div class="progress-bar">
    <div class="progress-fill" id="progressFill" style="width: 16.66%;"></div>
  </div>

  <!-- 슬라이드 1: 표지 -->
  <section class="slide slide-cover" id="slide1">
    <div class="slide-number">1 / 6</div>
    <h1 class="title">3년간의 성장</h1>
    <p class="subtitle">주니어에서 미드레벨 개발자로</p>
    <div class="meta">
      <span><strong>발표자:</strong> 안병욱 (Back-End 개발자)</span>
      <span><strong>소속:</strong> 모비닥</span>
    </div>
    <div class="period-badge">2023년 2월 ~ 2026년 1월 (3년)</div>
  </section>

  <!-- 슬라이드 2: 핵심 숫자 -->
  <section class="slide slide-numbers" id="slide2">
    <div class="slide-number">2 / 6</div>
    <h2>핵심 성과 지표</h2>
    <div class="numbers-grid">
      <div class="number-card">
        <div class="value">730+</div>
        <div class="label">Jira 이슈 처리</div>
        <div class="detail">연평균 240개+</div>
      </div>
      <div class="number-card">
        <div class="value">760+</div>
        <div class="label">Git 커밋</div>
        <div class="detail">연평균 250개+</div>
      </div>
      <div class="number-card">
        <div class="value">95%+</div>
        <div class="label">이슈 완료율</div>
        <div class="detail">높은 신뢰도</div>
      </div>
      <div class="number-card">
        <div class="value">70:30</div>
        <div class="label">BE:FE 비율</div>
        <div class="detail">풀스택 역량</div>
      </div>
    </div>
  </section>

  <!-- 슬라이드 3: TOP 3 프로젝트 -->
  <section class="slide slide-projects" id="slide3">
    <div class="slide-number">3 / 6</div>
    <h2>TOP 3 핵심 프로젝트</h2>
    <p class="section-subtitle">비즈니스 핵심 영향을 미친 S급 성과</p>
    <div class="projects-container">
      <div class="project-card">
        <div class="project-rank">01</div>
        <div class="project-content">
          <h3 class="project-title">결제 시스템 전면 전환</h3>
          <div class="project-period">2023년 9~11월</div>
          <p class="project-desc">
            Payple에서 결제선생으로 PG사 전환을 단독 수행. 청구서 결제 방식 추가로 결제 유연성을 확보하고, 정산 시스템을 분리 구현하여 운영 효율성 대폭 향상.
          </p>
          <div class="project-tags">
            <span class="project-tag">PG 연동</span>
            <span class="project-tag">결제 API</span>
            <span class="project-tag">정산 시스템</span>
          </div>
        </div>
      </div>
      <div class="project-card">
        <div class="project-rank">02</div>
        <div class="project-content">
          <h3 class="project-title">진료 통합 시스템</h3>
          <div class="project-period">2023년 6월</div>
          <p class="project-desc">
            방문예약과 원격진료를 단일 진료 시스템으로 통합하는 대규모 리팩토링 수행. 코드 중복을 제거하고 유지보수성을 대폭 향상시켜 신규 기능 개발 속도 2배 개선.
          </p>
          <div class="project-tags">
            <span class="project-tag">시스템 통합</span>
            <span class="project-tag">리팩토링</span>
            <span class="project-tag">아키텍처</span>
          </div>
        </div>
      </div>
      <div class="project-card">
        <div class="project-rank">03</div>
        <div class="project-content">
          <h3 class="project-title">결제 서비스 MSA 분리</h3>
          <div class="project-period">2024년 11월</div>
          <p class="project-desc">
            모놀리식 아키텍처에서 결제 도메인을 마이크로서비스로 최초 분리. 시스템 확장성과 장애 격리를 확보하고, 향후 서비스 분리의 기반 마련.
          </p>
          <div class="project-tags">
            <span class="project-tag">MSA</span>
            <span class="project-tag">Spring Cloud</span>
            <span class="project-tag">도메인 분리</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 슬라이드 4: 기술적 성장 -->
  <section class="slide slide-growth" id="slide4">
    <div class="slide-number">4 / 6</div>
    <h2>기술 역량 성장</h2>
    <div class="growth-container">
      <div class="growth-item">
        <div class="growth-label">기술적 리더십</div>
        <div class="growth-bar-container">
          <div class="growth-bar" style="width: 100%;"><span>★★★★★</span></div>
        </div>
      </div>
      <div class="growth-item">
        <div class="growth-label">문제 해결 능력</div>
        <div class="growth-bar-container">
          <div class="growth-bar" style="width: 100%;"><span>★★★★★</span></div>
        </div>
      </div>
      <div class="growth-item">
        <div class="growth-label">시스템 설계</div>
        <div class="growth-bar-container">
          <div class="growth-bar" style="width: 100%;"><span>★★★★★</span></div>
        </div>
      </div>
      <div class="growth-item">
        <div class="growth-label">코드 품질</div>
        <div class="growth-bar-container">
          <div class="growth-bar" style="width: 80%;"><span>★★★★☆</span></div>
        </div>
      </div>
      <div class="growth-item">
        <div class="growth-label">풀스택 역량</div>
        <div class="growth-bar-container">
          <div class="growth-bar" style="width: 80%;"><span>★★★★☆</span></div>
        </div>
      </div>

      <div class="growth-comparison">
        <div class="comparison-card">
          <h4>입사 초기 (2023)</h4>
          <ul>
            <li>기존 코드 분석 및 수정</li>
            <li>단일 기능 개발</li>
            <li>가이드에 따른 구현</li>
            <li>버그 수정 중심</li>
          </ul>
        </div>
        <div class="comparison-card">
          <h4>현재 (2026)</h4>
          <ul>
            <li>시스템 아키텍처 설계</li>
            <li>MSA 전환 주도</li>
            <li>복잡한 도메인 설계</li>
            <li>기술적 의사결정 참여</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- 슬라이드 5: 2026년 비전 -->
  <section class="slide slide-vision" id="slide5">
    <div class="slide-number">5 / 6</div>
    <h2>2026년 기여 계획</h2>
    <div class="vision-grid">
      <div class="vision-card">
        <div class="vision-icon">💳</div>
        <h4>구독 서비스 고도화</h4>
        <p>CRM 포인트 및 월별 구독 결제 시스템을 지속적으로 개선하여 새로운 수익 모델 안정화</p>
      </div>
      <div class="vision-card">
        <div class="vision-icon">🏗️</div>
        <h4>MSA 확장</h4>
        <p>결제 서비스 분리 경험을 바탕으로 추가 도메인 마이크로서비스 전환 주도</p>
      </div>
      <div class="vision-card">
        <div class="vision-icon">📊</div>
        <h4>시스템 안정화</h4>
        <p>통계 시스템 개선 및 데이터 파이프라인 최적화로 운영 효율성 극대화</p>
      </div>
    </div>
  </section>

  <!-- 슬라이드 6: 감사 -->
  <section class="slide slide-thanks" id="slide6">
    <div class="slide-number">6 / 6</div>
    <h2>감사합니다</h2>
    <p class="message">
      3년간 핵심 시스템 구축과 아키텍처 혁신을 주도하며,<br>
      주니어 개발자에서 시스템 설계가 가능한<br>
      미드레벨 개발자로 성장했습니다.
    </p>
    <p class="quote">
      "앞으로도 모비닥의 기술적 성장에<br>
      핵심적인 역할을 수행하겠습니다."
    </p>
  </section>

  <!-- 네비게이션 버튼 -->
  <div class="pres-nav">
    <button id="prevBtn" onclick="prevSlide()" title="이전 (←)">←</button>
    <button id="nextBtn" onclick="nextSlide()" title="다음 (→)">→</button>
  </div>
</div>

<script>
(function() {
  let currentSlide = 1;
  const totalSlides = 6;

  function updateSlide() {
    // 모든 슬라이드 표시 (스크롤 방식)
    const targetSlide = document.getElementById('slide' + currentSlide);
    if (targetSlide) {
      targetSlide.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 진행바 업데이트
    const progress = (currentSlide / totalSlides) * 100;
    document.getElementById('progressFill').style.width = progress + '%';

    // 버튼 상태 업데이트
    document.getElementById('prevBtn').disabled = currentSlide === 1;
    document.getElementById('nextBtn').disabled = currentSlide === totalSlides;
  }

  window.nextSlide = function() {
    if (currentSlide < totalSlides) {
      currentSlide++;
      updateSlide();
    }
  };

  window.prevSlide = function() {
    if (currentSlide > 1) {
      currentSlide--;
      updateSlide();
    }
  };

  // 키보드 네비게이션
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      e.preventDefault();
      window.nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      window.prevSlide();
    } else if (e.key === 'Home') {
      e.preventDefault();
      currentSlide = 1;
      updateSlide();
    } else if (e.key === 'End') {
      e.preventDefault();
      currentSlide = totalSlides;
      updateSlide();
    }
  });

  // 스크롤 감지하여 현재 슬라이드 업데이트
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
        const slideNum = parseInt(entry.target.id.replace('slide', ''));
        if (slideNum !== currentSlide) {
          currentSlide = slideNum;
          const progress = (currentSlide / totalSlides) * 100;
          document.getElementById('progressFill').style.width = progress + '%';
          document.getElementById('prevBtn').disabled = currentSlide === 1;
          document.getElementById('nextBtn').disabled = currentSlide === totalSlides;
        }
      }
    });
  }, { threshold: 0.5 });

  // 모든 슬라이드 관찰
  document.querySelectorAll('.slide').forEach(slide => {
    observer.observe(slide);
  });

  // 초기화
  updateSlide();
})();
</script>
