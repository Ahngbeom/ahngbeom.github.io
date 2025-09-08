---
title: MySQL 5.7에서 8.0으로의 업그레이드 가이드
date: "2025-09-08"
bookmark: true
tags:
    - MySQL 5.7
    - MySQL 8.0
    - MySQL Workbench
    - DBeaver
    - Migration
---

> 이 문서는 MySQL 5.7에서 8.0으로 업그레이드하는 과정에서 발생할 수 있는 주요 이슈와 체크포인트를 다룹니다.

## 1. SQL_MODE 설정 점검

### 필수 확인사항 ✅

- **MySQL 5.7**에서 **8.0**으로 마이그레이션 시 `sql_mode` 설정 변경이 필요합니다.
: staging ✅ | production ✅

#### SQL_MODE 변경 사항

> MySQL 5.7 및 MariaDB 10.1.7 이상에서 기본값으로 제공되던 `sql_mode='NO_AUTO_CREATE_USER'` 설정은 MySQL 8.0에서 더 이상 지원되지 않습니다.

### 조치 사항

Source DB에서 다음 단계를 수행해야 합니다:

1. **설정 변경**
   - DB Config 관리에서 `sql_mode='NO_AUTO_CREATE_USER'` 설정 제거

2. **DB 객체 재생성**
   - Procedure, Function, Trigger 삭제 후 재생성 필요

3. **마이그레이션 스크립트 생성**

   ```bash
   # 1. DB 객체 백업
   mysqldump -u {사용자명} -p -h {Source DB 호스트명} \
   --set-gtid-purged=OFF --routines --triggers \
   --no-create-info --no-data --no-create-db \
   --add-drop-trigger {사용자 DB} > backup.sql

   # 2. SQL_MODE 설정 수정
   # 예시: 다음과 같이 NO_AUTO_CREATE_USER 제거
   # 변경 전: SET sql_mode = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION'
   # 변경 후: SET sql_mode = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION'
   SET sql_mode = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION'

   # 3. 수정된 스크립트 적용
   mysql -u {사용자명} -p -h {Source DB 호스트명} {사용자 DB} < backup.sql
   ```

## 2. 바이너리 로그 설정 확인

### 필수 설정 사항 ✅

| 설정 항목 | 설정값 | Staging | Production |
|-----------|---------|---------|------------|
| 바이너리 로그 활성화 | 활성화 필요 | ✅ | ✅ |
| `log_bin` | `ON` | ✅ | ✅ |
| `server_id` | 고유값 지정 | ✅ | ✅ |

### 권장 설정 사항 ✅

바이너리 로그 보관 기간은 최소 5일 이상으로 설정해야 합니다.

#### 현재 설정 상태

- **Staging 환경**:
  - `binlog_expire_logs_seconds`: 604800 (7일)
  - `expire_logs_days`: 0

- **Production 환경**:
  - `expire_logs_days`: 7

### 주의사항 ⚠️

바이너리 로그 보관 기간이 마이그레이션 소요 시간보다 짧을 경우 다음과 같은 오류가 발생할 수 있습니다:

```bash
Got fatal error 1236 from master when reading data from binary log: 
'Could not find first log file name in binary log index file'
```

이 경우 Source DB 설정 변경 후 마이그레이션을 재시작해야 합니다.

## 3. Character Set 및 계정 설정

### Character Set/Collation 설정 ✅

- **지원되는 Character Set**:
  - `utf8`
  - `utf8mb4`
  - `euckr`

> ⚠️ Source DB가 위 Character Set 외의 설정을 사용 중이라면 변경이 필요합니다.
> : Staging ✅ | Production ✅

### Collation 호환성 확인 ✅

- MySQL 8.0 이전 버전에서는 `utf8mb4_0900_ai_ci`가 지원되지 않습니다.
- Source DB와 Target DB 간의 Collation 호환성을 반드시 확인해야 합니다.
: Staging ✅ | Production ✅

### Definer 계정 설정 ✅

- Source DB의 Definer 계정은 다음 조건을 만족해야 합니다:
  - 계정명과 허용 호스트명이 Cloud DB for MySQL에 동일하게 등록되어 있어야 함
: Staging ✅ | Production ✅

## 4. 데이터베이스 객체 제약사항

### 외래키 이름 길이 제한 ✅

> MySQL 8.0에서는 외래키(Foreign Key) 이름이 64자로 제한됩니다.

다음 쿼리로 제한을 초과하는 외래키를 확인할 수 있습니다:

```sql
SELECT *
FROM information_schema.table_constraints
WHERE constraint_schema = @DATABASE
  AND LENGTH(CONSTRAINT_NAME) > 64;
```

Staging ✅ | Production ✅

### GROUP BY 구문 변경사항 ✅

- MySQL 8.0에서는 `GROUP BY ASC/DESC` 구문이 더 이상 지원되지 않습니다.
- 자세한 내용: [MySQL Worklog #8693](https://dev.mysql.com/worklog/task/?id=8693)

Staging ✅ | Production ✅

### Collation 설정 요구사항 ✅

다음 객체들에 대해서는 명시적 collation 설정이 필요합니다:

```sql
-- 적용할 collation 설정
COLLATE utf8mb4_unicode_ci
```

**대상 객체**:

- VIEW TABLE
- Function

Staging ✅ | Production ✅

### 데이터 마이그레이션 검증 ✅

#### 사용자 데이터 유지 확인

- 업그레이드 후 기존 USER 데이터의 정상적인 마이그레이션 여부 검증 필요
Staging ✅ | Production ✅

#### 성능 최적화 검토 ✅

> MySQL 5.x의 인덱스 힌트를 사용 중인 경우 성능 테스트가 필요합니다.

**주의사항**:

- MySQL 5.x에서 성능 향상에 도움이 되었던 인덱스 힌트가 MySQL 8.x에서는 성능 저하를 유발할 수 있음
- 업그레이드 전 반드시 성능 테스트 수행 필요

Staging ✅ | Production ✅

## 5. 고가용성 구성 및 업그레이드 절차

### 현재 환경 구성

#### Staging 환경

- 고가용성 설정: `OFF`
- 구동 모드: Stand Alone

#### Production 환경

- 고가용성 설정: `ON`
- 구성:
  - Active: Master DB Server
  - Standby: Standby Master DB Server

### 업그레이드 프로세스

1. **사전 준비**
   - Source DB Server와 Target DB Server 구성 필요
   - 고가용성 설정 활성화

2. **서버 역할 설정**
   - Source DB: Master DB Server
   - Target DB: Standby Master DB Server

3. **완료 후 처리**
   - 고가용성 설정 비활성화
   - Stand Alone 모드로 복구

## 참고 문헌

### 데이터베이스 아키텍처

- [데이터베이스와 아키텍처 구성](https://velog.io/@yangsijun528/4장-데이터베이스와-아키텍처-구성)
- [MySQL 데이터베이스 구성](https://wonsjung.tistory.com/582)
- [데이터베이스 마이그레이션 가이드](https://mirrorofcode.tistory.com/302)

### MySQL 8.0 관련

- [MySQL 8.0 버전 선택 이유](https://velog.io/@this-is-spear/MySQL-8.0-버전을-선택한-이유가-있나요)
- [MySQL 8.0 업그레이드 가이드](https://blog.naver.com/sory1008/222113696822)

### 클라우드 DB 문서

- [NCloud DB 개요](https://guide.ncloud-docs.com/docs/dms-overview)
- [NCloud DB 연결 가이드](https://guide.ncloud-docs.com/docs/dms-connect#1사전준비1)
- [클라우드 DB 마이그레이션](https://manvscloud.com/?p=1959)

### 다운그레이드 관련

- [MySQL 8.0에서 5.7로 다운그레이드하기](https://velog.io/@nameunzz/MySQL-downgrade-8-to-5.7)
