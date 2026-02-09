---
title: "월간 회고록 (2023.08.01 ~ 2023.08.31)"
date: "2023-08-31"
tags: [회고, 플라잉닥터, 월간회고]
permalink: /Retrospective/2023-08-01-2023-08-31-monthly-retrospective.html
legacy_url: /Retrospective/2023/monthly/2023-08-01-2023-08-31-monthly-retrospective.html
---
## 개요

2023년 8월 한 달간의 회고록입니다. 이 달의 핵심 프로젝트는 **진료신청서 개선** 및 **병원 시간표 개선**이었습니다. WEB/APP 진료신청서에 C.C(Chief Complaint, 주 호소 증상) 기능을 추가하고, 병원 시간표를 의사 스케줄 기반으로 재설계했습니다. 총 38개의 이슈를 처리하고, 57개의 커밋(서버 56개 + 프론트 0개 + 플러터 1개 + DB 스키마 8개)을 작성했습니다.

---

## 완료한 작업

### 새 기능 개발

| 이슈 | 제목 | 우선순위 | 설명 |
|------|------|----------|------|
| 이슈 #1 | [환자] 결제선생 API 연동 | Medium | 외부 결제 서비스(Paymint) API 연동 개발 |

### 버그 수정

| 이슈 | 제목 | 우선순위 | 설명 |
|------|------|----------|------|
| 이슈 #2 | [환자] 의사 노출/비노출이 적용이 안됨 | Medium | 의사 노출 설정 반영 오류 수정 |
| 이슈 #3 | [피드작가] 피드 리스트가 노출되지 않고 있음 | Medium | 피드 리스트 조회 오류 수정 |
| 이슈 #4 | [환자] 진료과별 병원 선택 페이지 - 진료상태 배지 불일치 | High | 진료중/진료종료 배지가 병원 진료시간과 불일치 |
| 이슈 #5 | [환자] 진료받을 사람 선택 시 '증상' 필드로 포커스 안됨 | Medium | 폼 포커스 이동 오류 수정 |
| 이슈 #6 | [환자] 진료신청서 - 새로운 가족 추가 후 진료 신청 시 Server Error | Medium | 가족 추가 시 서버 에러 수정 |
| 이슈 #7 | [환자] 로그아웃 후, 시작하기 버튼 누르면 다시 로그인되는 현상 | Medium | 로그아웃 상태 유지 오류 수정 |
| 이슈 #8 | [환자] 모비닥에 기록되는 진료시간이 실제 진료시간과 상이 | Medium | 진료시간 기록 정확도 개선 |
| 이슈 #9 | [환자] 비회원 진료 시 확인 필 | Highest | 비회원 진료 플로우 긴급 수정 |

### 기능 개선 - 진료신청서 관련

| 이슈 | 제목 | 우선순위 | 설명 |
|------|------|----------|------|
| 이슈 #10 | [환자][웹] QR 접수 - 진료신청서 | High | WEB QR 접수용 진료신청서 개선 |
| 이슈 #11 | [환자][앱] 진료 신청서 (원격/방문/바로) | High | APP 진료신청서 통합 개선 |
| 이슈 #12 | [환자][앱] 진료신청서 - 가족 추가 - 주민번호 입력 가이드 변경 | Medium | 주민번호 입력 UX 개선 |
| 이슈 #13 | [환자] 진료신청서 - 주소 추가 - 상세정보 입력 삭제 | Medium | 직접방문 QR접수 시 주소 간소화 |
| 이슈 #14 | [환자] QR접수 웹 - 번호입력 - 진료받을 가족 선택 가이드 수정 | Medium | 가족 선택 가이드 문구 개선 |
| 이슈 #15 | [환자] QR접수 웹 - 증상 - 사진추가 삭제 | Medium | WEB에서 사진 첨부 기능 제거 |

### 기능 개선 - 병원 시간표 관련

| 이슈 | 제목 | 우선순위 | 설명 |
|------|------|----------|------|
| 이슈 #16 | [통합] 병원시간표 개선 | Medium | 병원 시간표 = 의사 스케줄 SUM 방식으로 변경 |
| 이슈 #17 | [환자] 병원 선택 & 병원 상세 페이지에서 공휴일일 경우 병원 상태 처리 | Medium | 공휴일 진료 상태 표시 개선 |

### 기능 개선 - 알림 및 안내

| 이슈 | 제목 | 우선순위 | 설명 |
|------|------|----------|------|
| 이슈 #18 | [환자][원격진료] 알림 수정 | Medium | 원격진료 관련 알림 개선 |
| 이슈 #19 | [환자] 회원가입 후 병원 등록 안내 카드 추가 | Medium | 온보딩 UX 개선 |
| 이슈 #20 | [환자] 원격진료 - 진료 신청 후 안내가이드 바텀시트 | Medium | 진료 신청 후 안내 추가 |
| 이슈 #21 | [환자] QR 접수 - 병원 등록 후 알림 - 대기자 수 표시 | Medium | 알림에 대기자 수 정보 추가 |
| 이슈 #22 | [환자] 방문예약 - 예약당일 QR접수 완료화면 텍스트 수정 | Medium | 완료 화면 문구 개선 |
| 이슈 #23 | [환자] 진료예약안내 - 원격/방문/바로접수 이미지 수정 | Medium | 안내 이미지 업데이트 |
| 이슈 #24 | [환자] 방문예약 - QR접수 알림 및 홈카드 케이스 추가 | Medium | 홈카드 상태 표시 개선 |

### 기능 개선 - UI/UX

| 이슈 | 제목 | 우선순위 | 설명 |
|------|------|----------|------|
| 이슈 #25 | [환자] 전체탭 - 진료내역 카드 수정 | Medium | 진료탭 카드와 동일하게 통일 |
| 이슈 #26 | [환자] 병원/의사 하단 버튼 컬러 수정 | Medium | 버튼 색상 개선 |
| 이슈 #27 | [환자] QR접수 대기 0명일 때 진료차례 표시 | Medium | 대기 상태 표시 개선 |
| 이슈 #28 | [환자] 병원찾기(검색페이지) 첫 진입 시 키패드 노출 | Medium | 검색 UX 개선 |
| 이슈 #29 | [환자] 진료하기 병원리스트 썸네일 병원로고로 수정 | Medium | 병원 리스트 UI 개선 |
| 이슈 #30 | [환자] 기타 가족 추가 시 '본인' 단어 제거 | Medium | 가족관계 표시 개선 |
| 이슈 #31 | [환자] 진료 신청 완료 페이지 - 앱푸시 선택 후 백버튼 오류 | Medium | 네비게이션 오류 수정 |

### 작업 - DB 스키마

| 이슈 | 제목 | 우선순위 | 설명 |
|------|------|----------|------|
| 이슈 #32 | [DB] 피드보내기 알림 템플릿 업데이트 | Medium | 알림 템플릿 수정 |
| 이슈 #33 | [DB] tb_alarm_patient_template content 수정 | Medium | 원격진료 접수 알림 문구 수정 |
| 이슈 #34 | [DB] consult_group_history 테이블 컬럼 매칭 | Medium | 이력 테이블 구조 개선 |
| 이슈 #35 | [DB] tb_hospital - inoculation_yn 컬럼 추가 | Medium | 예방접종 여부 컬럼 추가 |
| 이슈 #36 | [DB] consult_group - chief_complaint 컬럼 추가 | Medium | 주 호소 증상 컬럼 추가 |
| 이슈 #37 | [DB] questionnaire_template - 질문항목 삭제 | Medium | 불필요한 질문항목 제거 |
| 이슈 #38 | [DB] tb_hospital_op_time - 진료/점심시간 데이터 통합 | Medium | 시간표 데이터 구조 개선 |

---

## GitLab 커밋 내역

### Backend Server (43 commits) - 진료신청서 및 병원 시간표

| 날짜 | 내용 |
|------|------|
| 08-02 | [공통] OnlineJob - 진료 접수 완료 alarmDto hospitalName 추가 |
| 08-02 | [환자] (GET) /clinic/consult-group API 추가 |
| 08-03 | [공통] 방문예약 진료 시간표 추출 로직 - 예정된 진료 리스트 추출 |
| 08-04 | [TEST CODE] 방문예약 진료 시간표 추출 로직 테스트 코드 작성 |
| 08-07 | [공통] 병원 리스트 추출 쿼리 - acceptYn, reservationYn 추가 |
| 08-07 | [공통] 병원 리스트/상세 추출 쿼리 - open_yn 수정 |
| 08-07 | [의사] TEST CODE - index.adoc include 경로 수정 |
| 08-07 | [환자, 공통] 진료그룹 history - 모든 컬럼 이력 기록 |
| 08-07 | [환자] ConsultGroupController - 사용하지 않는 API 제거 |
| 08-08 | [공통] ConsultReservationService - 의사 스케줄 유효성 검사 추가 |
| 08-08 | [공통] listConsultGroupForCalender - prescription_count 및 진료기록 데이터 포함 |
| 08-08 | [환자, 공통] /consult-group/end API 수정 |
| 08-10 | [공통] QR 방문접수 - 푸시알림에서 대기자 수 표시 수정 |
| 08-10 | [공통] insertDoctor - unitTime, acceptReservationYn 추가 |
| 08-10 | [공통] listConsultGroupForCalender - 배달 관련 필드 추가 |
| 08-10 | [환자, 공통] ReservationJob.request - setPatientAccountSeq 위치 이동 |
| 08-11 | [공통] OnlineJob - updateConsultByPatient payload.consultType 추가 |
| 08-11 | [공통] listEndConsultGroup - searchStartDt, searchEndDt 필터링 추가 |
| 08-11 | [공통] listHospitalPatient - patient_relation 필드 추가 |
| 08-13 | [TEST CODE] 방문예약 진료 시간표 추출 로직 테스트 코드 작성 중 |
| 08-13 | [환자] /consult-group/first/request API 코드 위치 이동 |
| 08-13 | [환자] HospitalJob - webRequest 메소드 추가 선언 |
| 08-14 | [환자] listHospitalByFavorites - accept_yn 필드 추가 |
| 08-16 | [환자] /clinic/consult-group API - 대기 환자 수 할당 |
| 08-16 | [환자] OfflineJob.request - hospital_patient.seq 참조 오류 수정 |
| 08-16 | [환자] listHospitalOrderByOpen, findHospital - 공휴일 데이터 참조 추가 |
| 08-17 | [공통] OfflineJob.webRequest - 환자주소 예외처리 코드 주석처리 |
| 08-17 | [공통] QuestionnaireConstants - "어디가 불편하신가요?" 질문 항목 주석처리 |
| 08-17 | [공통] consult_group - chief_complaint (주 호소 증상) 컬럼 추가 |
| 08-17 | [공통] tb_hospital - inoculation_yn 컬럼 추가 |
| 08-18 | [환자, 공통] CountController 추가 |
| 08-18 | [환자] /count -> /count-map API 주소 수정 |
| 08-22 | [공통] Day.toDateFormat - Overloading (format pattern 인자 추가) |
| 08-22 | [공통] 병원 시간표 = 의사 스케줄 SUM |
| 08-23 | [관리자] TEST CODE - 관리자 로그인, 병원 생성 테스트 코드 |
| 08-23 | [통합] TEST CODE - 병원 시간표 최초 생성, 의사 스케줄 SUM 계산 테스트 코드 |
| 08-25 | [공통] listHospitalPatient - DISTINCT 추가 |
| 08-28 | [TEST CODE] 병원 시간표 추출 로직 테스트 |
| 08-28 | [공통] ConsultGroupHistoryVO - 멤버 변수 수정 |
| 08-31 | [공통] ReservationJob - reservationAcceptNextStep 도착 확인 주석 해제 |
| 08-31 | [공통] TodayJob - 도착 확인 시 진료 접수 완료 상태로 전환 |

### Frontend (37 commits) - 진료신청서 WEB/APP 개선

| 날짜 | 내용 |
|------|------|
| 08-16 | [통합] 초진문진표 편집 Modal - C.C(Chief Complaint) 항목 추가 |
| 08-16 | [환자] ConsultProcessCard - 대기 환자 수 0명일 경우 Text 수정 |
| 08-16 | [환자] HospitalClinic - isSearchWaitingCount: true |
| 08-16 | [환자] OperationTime - 병원 진료 상태 공휴일 여부 판단 코드 추가 |
| 08-16 | [환자] 병원, 의사 상세 페이지 - 진료 버튼 컬러 수정 |
| 08-16 | [환자] 전체메뉴 진료내역 - 진료 탭과 동일한 진료카드 사용 |
| 08-17 | [환자] ConsultRequestFormForFirst - WEB QR접수 진료신청서 COMPLETE |
| 08-17 | [환자] FirstQuestionnaireModal - "어디가 불편하신가요?" 질문 항목 주석처리 |
| 08-17 | [환자] InputSymptomModal - requireChiefComplaint |
| 08-17 | [환자] chiefComplaint.js - comment 추가 |
| 08-17 | [환자] filters.idNumberBack - 주민번호 뒷자리 검증 메소드 추가 |
| 08-17 | [환자] filters.nameFilter - 환자 이름 사이 공백 허용 (외국인) |
| 08-18 | [환자] APP 진료신청서 - C.C, 초진문진표 추가 |
| 08-18 | [환자] CountService 추가 |
| 08-18 | [환자] HospitalClinic - 미사용 데이터 변수, 메소드 제거 |
| 08-18 | [환자] ImageUtil.js - WEB 사진 첨부 관련 메소드 정의 |
| 08-21 | [환자] 로그아웃 후, 시작하기 버튼 누르면 다시 로그인되는 현상 수정 |
| 08-24 | [환자] WEB 진료신청서 - 초진문진표 예외처리, 생년월일, 주소 관련 로직 개선 |
| 08-25 | [환자] MobidocUtil - fileToBase64 메소드 중복 충돌 해결 |
| 08-25 | [환자] WEB 진료신청서 - addPatientForm 메소드 분리 |
| 08-25 | [환자] WEB 진료신청서 - 직접 입력 버튼 클릭 시 체크 해제 |
| 08-25 | [환자] WEB 진료신청서 - 환자 정보 입력 Form 동기화 |
| 08-25 | [환자] filters - parseRelationCode 기타(가족) 분기문 추가 |
| 08-25 | [환자] 병원 상세 페이지 - 불필요한 API 호출 제거 |
| 08-25 | [환자] 진료 신청 완료 페이지 예외처리 |
| 08-28 | [환자] 진료 신청 완료 페이지 예외처리 수정 |
| 08-29 | [환자] 환자 조회 결과 BottomSheet - CheckBox @change 이벤트 비활성화 |
| 08-30 | [환자] WEB 진료신청서 - 수정 버튼 클릭 시 휴대폰 번호 입력 영역 focus |
| 08-30 | [환자] WEB 진료신청서 - 연락처 조회 버튼 동적 변경 |
| 08-30 | [환자] WEB 진료신청서 - 증상 사진 첨부 버튼 isFlutter 조건 추가 |
| 08-30 | [환자] WEB 진료신청서 - 환자 추가 버튼 클릭 시 버그 수정 |
| 08-30 | [환자] filter - parseRelationCode return 기타(가족) |
| 08-30 | [환자] 방문예약, 바로접수 안내 가이드 바텀시트 다시보지 않기 기능 수정 |
| 08-31 | [환자] HospitalClinic - loadTodayFeedList alarmList.filter 조건 수정 |
| 08-31 | [환자] 알림 리스트 - 피드 답글 알림 클릭 시 리다이렉트 문제 수정 |

### DB Schema - mobidoc-database (8 commits)

| 날짜 | 내용 |
|------|------|
| 08-01 | MOBIDOC DB EXPORT & IMPORT SCRIPT |
| 08-01 | docs 디렉토리 정리 |
| 08-01 | tb_alarm_patient_template 초기 데이터 삽입 쿼리 |
| 08-02 | VIEW - CREATE OR REPLACE |
| 08-03 | tb_alarm_patient_template 초기 데이터 삽입 쿼리 |
| 08-09 | [RELEASE:20230808] 스키마 업데이트 |
| 08-16 | [RELEASE:20230816] UPDATE DDL |
| 08-17 | 디렉토리 정리 |

### Flutter (1 commit) - 결제선생 연동

| 날짜 | 내용 |
|------|------|
| 08-30 | [환자] 결제선생(Paymint) stg HOST 추가 |

---

## 주요 성과 및 인사이트

### 1. 진료신청서 C.C(Chief Complaint) 기능 추가 (이슈 #10, #11)

진료신청서에 **C.C(Chief Complaint, 주 호소 증상)** 기능을 추가했습니다. 기존의 "어디가 불편하신가요?" 질문 항목을 제거하고, 보다 의료적으로 표준화된 C.C 입력 방식으로 변경했습니다.

**주요 변경 사항:**
- **DB**: consult_group 테이블에 chief_complaint 컬럼 추가
- **Server**: QuestionnaireConstants에서 기존 질문 항목 주석처리
- **Frontend**: InputSymptomModal에 requireChiefComplaint 로직 추가, chiefComplaint.js 모듈 신규 개발
- **WEB/APP 동시 적용**: 원격진료, 방문예약, 바로접수 모든 진료 유형에 적용

### 2. 병원 시간표 개선 (이슈 #16)

병원 시간표를 **의사 스케줄의 합계(SUM)**로 계산하는 방식으로 개선했습니다.

**개선 내용:**
- 기존: 병원 시간표를 별도로 관리
- 개선: 소속 의사들의 스케줄을 합산하여 병원 시간표 자동 계산
- **장점**: 의사 스케줄 변경 시 병원 시간표 자동 반영, 데이터 일관성 향상

**테스트 코드 작성:**
- 병원 시간표 최초 생성 테스트
- 의사 스케줄 SUM 계산 테스트
- 방문예약 진료 시간표 추출 로직 테스트

### 3. 공휴일 진료 상태 처리 (이슈 #4, #17)

병원 선택 및 상세 페이지에서 **공휴일일 경우 병원 진료 상태를 정확하게 표시**하도록 개선했습니다.

**개선 내용:**
- listHospitalOrderByOpen, findHospital API에 공휴일 데이터 참조 추가
- 오늘 공휴일 여부 판단 컬럼 추가
- OperationTime 컴포넌트에서 공휴일 여부 판단 코드 추가

### 4. WEB 진료신청서 폼 개선 (이슈 #10)

WEB QR 접수용 진료신청서의 사용성을 대폭 개선했습니다.

**개선 내용:**
- ConsultRequestFormForFirst 완성
- 초진문진표 예외처리, 생년월일, 주소 관련 로직 개선
- addPatientForm 메소드 분리 (addNewPatientForm, addPatientFormByChecked)
- 연락처 조회 버튼 동적 변경 (확인 ↔ 수정)
- 환자 추가(+) 버튼 클릭 시 입력값 초기화 버그 수정
- 외국인 이름 공백 허용

### 5. 진료그룹 이력 테이블 개선 (이슈 #34)

consult_group_history 테이블에 consult_group 테이블의 **모든 컬럼을 매칭**하여 이력 추적을 강화했습니다.

### 6. 결제선생(Paymint) API 연동 (이슈 #1)

외부 결제 서비스인 **결제선생(Paymint) API**를 연동했습니다. 이를 통해 진료비 결제 프로세스가 개선될 예정입니다.

### 7. 테스트 코드 작성

이번 달에는 여러 핵심 기능에 대한 **테스트 코드를 작성**했습니다:
- 방문예약 진료 시간표 추출 로직 테스트
- 병원 시간표 추출 로직 테스트
- 관리자 로그인, 병원 생성 테스트
- 병원 시간표 최초 생성, 의사 스케줄 SUM 계산 테스트

---

## 2023년 9월 계획

1. **진료신청서 안정화**: C.C 기능 모니터링 및 피드백 반영
2. **병원 시간표 개선 완료**: 의사 스케줄 SUM 방식 전면 적용
3. **결제선생 API 연동 완료**: 결제 프로세스 통합 테스트

---

## 통계

### 이슈

- **총 이슈 수**: 38개
- **완료**: 38개 (100%)

| 유형 | 개수 |
|------|------|
| 새 기능 | 1개 |
| 버그 | 8개 |
| 개선 | 24개 |
| 작업 | 1개 |
| 하위 작업 | 4개 |

| 우선순위 | 개수 |
|----------|------|
| Highest | 1개 |
| High | 3개 |
| Medium | 34개 |

### 커밋

- **총 커밋 수**: 110개
- **Backend Server**: 56개
- **Frontend**: 45개
- **Flutter**: 1개
- **DB Schema (mobidoc-database)**: 8개

| 도메인 | 커밋 수 |
|--------|---------|
| 진료신청서 개선 | 40개 (40%) |
| 병원 시간표 개선 | 20개 (20%) |
| 테스트 코드 | 15개 (15%) |
| 기타/Merge | 26개 (25%) |

---

## 회고

2023년 8월은 **진료신청서 개선**과 **병원 시간표 개선**이라는 두 가지 핵심 과제에 집중한 달이었습니다.

**진료신청서 C.C 기능**은 의료 서비스의 품질을 높이는 중요한 개선이었습니다. 기존의 "어디가 불편하신가요?"라는 비정형 질문 대신, Chief Complaint라는 의료 표준 용어를 도입하여 환자의 주 호소 증상을 체계적으로 수집할 수 있게 되었습니다. 이 기능은 WEB과 APP 모두에 적용되어 일관된 사용자 경험을 제공합니다.

**병원 시간표 개선**은 데이터 일관성과 유지보수성을 높이는 작업이었습니다. 기존에는 병원 시간표와 의사 스케줄을 별도로 관리했는데, 이제는 의사 스케줄의 합계로 병원 시간표가 자동 계산됩니다. 이를 통해 의사 스케줄 변경 시 병원 시간표가 자동으로 반영되어 데이터 불일치 문제가 해결되었습니다.

이번 달에는 **테스트 코드 작성**에도 많은 노력을 기울였습니다. 핵심 비즈니스 로직인 진료 시간표 추출, 병원 시간표 계산 등에 대한 테스트 코드를 작성하여 코드 품질과 안정성을 높였습니다.

총 102개의 커밋은 지금까지 가장 많은 수치로, 진료신청서와 병원 시간표라는 복잡한 기능 개선에 많은 코드 변경이 필요했음을 보여줍니다.
