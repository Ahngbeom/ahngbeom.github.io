---
title: "Dockerfile 완벽 가이드: 구조와 모범 사례"
date: "2025-08-26"
bookmark: true
tags:
    - Docker
    - Dockerfile
    - Container
    - DevOps
    - Infrastructure
---

## Dockerfile 기본 구조

Dockerfile은 Docker 이미지를 생성하기 위한 스크립트입니다. 각 명령어는 새로운 레이어를 생성하며, 이미지의 최종 상태를 결정합니다.

### 1. 기본 설정 명령어

#### FROM

```dockerfile
FROM node:18-alpine
```

- 베이스 이미지 지정
- 모든 Dockerfile은 FROM으로 시작
- 가능한 경우 공식 이미지 사용 권장
- Alpine 기반 이미지로 크기 최소화 가능

#### ARG

```dockerfile
ARG VERSION=latest
ARG BUILD_ENV=production
```

- 빌드 시점 변수 정의
- `docker build --build-arg` 로 외부 주입 가능
- ENV와의 주요 차이점:
  1. 빌드 시에만 사용 가능
  2. 이미지에 저장되지 않음
  3. 컨테이너 실행 시 접근 불가

### 2. 파일 시스템 설정

#### WORKDIR

```dockerfile
WORKDIR /app
```

- 작업 디렉토리 설정
- 절대 경로 사용 권장
- 존재하지 않는 경우 자동 생성
- 이후 명령어의 기준 경로가 됨

#### COPY

```dockerfile
# 단일 파일 복사
COPY package.json .

# 여러 파일 복사
COPY ["file1", "file2", "./"]

# .dockerignore 적용
COPY . .
```

- 호스트에서 이미지로 파일 복사
- 상대 경로는 WORKDIR 기준
- .dockerignore로 제외 파일 설정 가능

### 3. 빌드 및 실행 설정

#### RUN

```dockerfile
# 쉘 형식
RUN npm install

# 실행 형식
RUN ["npm", "install"]

# 레이어 최소화를 위한 체이닝
RUN apt-get update && \
    apt-get install -y \
    package1 \
    package2 && \
    rm -rf /var/lib/apt/lists/*
```

- 새 레이어에서 명령어 실행
- 이미지 빌드 중 실행
- 레이어 수 최소화를 위해 명령어 체이닝 권장

#### ENV

```dockerfile
ENV NODE_ENV=production
ENV PATH=$PATH:/usr/local/bin
```

- 환경 변수 설정
- 빌드 시점 및 런타임에서 사용 가능
- 컨테이너 실행 시에도 유지됨

#### CMD와 ENTRYPOINT

```dockerfile
# CMD 예시
CMD ["npm", "start"]

# ENTRYPOINT 예시
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
```

- CMD: 기본 실행 명령어 (오버라이드 가능)
- ENTRYPOINT: 고정 실행 명령어
- 보통 둘 중 하나만 사용
- ENTRYPOINT + CMD 조합도 가능

## Docker Build 명령어 상세 가이드

### 기본 빌드 명령어

```bash
docker build -t my-app:1.0 .
```

### 주요 빌드 옵션

| 옵션 | 설명 | 예시 |
|------|------|------|
| `-t, --tag` | 이미지 태그 지정 | `docker build -t app:1.0 .` |
| `-f, --file` | 도커파일 경로 지정 | `docker build -f prod.Dockerfile .` |
| `--build-arg` | 빌드 인자 전달 | `docker build --build-arg ENV=prod .` |
| `-q, --quiet` | 진행 상황 출력 생략 | `docker build -q .` |

### 빌드 컨텍스트 최적화

#### .dockerignore 활용

```plaintext
# 빌드에서 제외할 파일
node_modules
*.log
.git
.env*
```

#### 레이어 캐시 활용

```dockerfile
# 효율적인 캐시 활용
COPY package*.json ./
RUN npm install
COPY . .
```

### 멀티 스테이지 빌드 예시

```dockerfile
# 빌드 스테이지
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 실행 스테이지
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --production
CMD ["npm", "start"]
```

## 모범 사례 및 팁

### 1. 이미지 크기 최적화

- Alpine 기반 이미지 사용
- 불필요한 패키지 제거
- 멀티 스테이지 빌드 활용

### 2. 보안 강화

- 루트가 아닌 사용자로 실행
- 최소 권한 원칙 적용
- 보안 스캔 도구 활용

### 3. 캐시 최적화

- 자주 변경되는 레이어는 나중에 배치
- 의존성 설치는 별도 레이어로 분리
- .dockerignore 적극 활용

## 참고 문헌

- [Docker 공식 문서: Dockerfile 모범 사례](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker 빌드 최적화 가이드](https://docs.docker.com/develop/develop-images/build_enhancements/)
- [컨테이너 보안 가이드라인](https://docs.docker.com/develop/security-best-practices/)
