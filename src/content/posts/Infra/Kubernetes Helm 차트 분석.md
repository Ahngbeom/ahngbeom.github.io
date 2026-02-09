---
title: "Kubernetes Helm 차트 분석"
date: "2025-08-26"
bookmark: true
tags:
    - Kubernetes
    - Helm Chart
legacy_url: /Infra/Kubernetes Helm 차트 분석.html
---
## Helm 개요

Helm은 Kubernetes의 패키지 매니저로서, charts라는 패키지 포맷을 통해 애플리케이션을 관리합니다.

### Helm Charts의 이해

#### 기본 개념

- **Charts**: Kubernetes 리소스를 설명하는 파일들의 집합
- **Release**: Kubernetes 클러스터에 배포된 Chart의 인스턴스
- **Repository**: Charts를 저장하고 공유하는 저장소

#### Charts의 활용 사례

1. **단순 배포**:
   - 단일 서비스(예: Memcached) 배포
   - 독립적인 마이크로서비스 구성

2. **복잡한 애플리케이션**:
   - 웹 애플리케이션 전체 스택
   - 데이터베이스 + 캐시 + 서버 조합
   - 마이크로서비스 아키텍처

### Chart 구조와 기본 명령어

```bash
myapp/
  Chart.yaml          # 메타데이터 파일
  values.yaml         # 기본 설정값
  templates/          # 템플릿 디렉토리
    deployment.yaml   # 배포 설정
    service.yaml      # 서비스 설정
    ingress.yaml      # 인그레스 설정
  charts/             # 종속성 차트들
```

#### 주요 명령어

```bash
# Chart 다운로드
helm pull chartrepo/chartname

# Chart 설치
helm install release-name chartrepo/chartname

# 릴리스 목록 조회
helm list

# Chart 업그레이드
helm upgrade release-name chartrepo/chartname

<https://helm.sh/ko/docs/topics/charts/>

## Helm 템플릿 시스템

### 템플릿 기본 사항

Helm의 템플릿 시스템은 Go 템플릿을 기반으로 하며, 강력한 변수 치환과 조건부 로직을 제공합니다.

#### 템플릿 문법 예시

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-config
data:
  # 단순 값 참조
  database: {{ .Values.database.name }}
  
  # 조건문 사용
  {{- if .Values.enableFeature }}
  feature.enabled: "true"
  {{- end }}
  
  # 반복문 사용
  ports: |
    {{- range .Values.service.ports }}
    - {{ . }}
    {{- end }}
```

### 로컬 템플릿 테스트

템플릿을 실제 클러스터에 적용하기 전에 로컬에서 테스트할 수 있습니다.

```bash
# 기본 템플릿 렌더링
helm template . 

# 특정 값 파일 사용
helm template . -f values.dev.yaml

# 특정 템플릿만 렌더링 후 적용
helm template . -s templates/config.yaml --values=dev.yaml | kubectl apply -f -
```

#### 주의사항

- 클러스터 상태 의존적인 값들은 로컬에서 테스트할 때 가상(faked) 값으로 대체됩니다
- 서버 측 유효성 검사는 수행되지 않으므로, 실제 적용 전 주의가 필요합니다

## Helm Values 시스템

### Values 파일 구조화

values.yaml 파일은 Helm 차트의 기본 설정값을 정의합니다. 환경별로 다른 설정이 필요한 경우 values-{env}.yaml 파일을 사용할 수 있습니다.

```yaml
# values.yaml 예시
global:
  environment: production
  
application:
  name: myapp
  replicas: 3
  
resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 200m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 80
```

### HPA (Horizontal Pod Autoscaling) 설정

HorizontalPodAutoscaler는 워크로드의 자동 스케일링을 담당하는 Kubernetes 리소스입니다.

```yaml
# HPA 템플릿 예시
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {{ .Release.Name }}-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ .Release.Name }}
  minReplicas: {{ .Values.autoscaling.minReplicas }}
  maxReplicas: {{ .Values.autoscaling.maxReplicas }}
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: {{ .Values.autoscaling.targetCPUUtilizationPercentage }}
```

### Ingress 설정

Ingress는 클러스터 외부에서 내부 서비스로의 HTTP/HTTPS 라우팅을 관리합니다.

```yaml
# Ingress 템플릿 예시
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ .Release.Name }}-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  rules:
    - host: {{ .Values.ingress.host }}
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: {{ .Release.Name }}-service
                port:
                  number: 80
```

## Kubernetes 리소스 관리

### ReplicaSet 관리

ReplicaSet은 지정된 수의 파드 복제본이 항상 실행되도록 보장하는 Kubernetes 리소스입니다.

#### ReplicaSet 주요 구성 요소

```yaml
# ReplicaSet 템플릿 예시
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: {{ .Release.Name }}-replicaset
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: {{ .Release.Name }}
  template:
    metadata:
      labels:
        app: {{ .Release.Name }}
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        resources:
          requests:
            cpu: {{ .Values.resources.requests.cpu }}
            memory: {{ .Values.resources.requests.memory }}
          limits:
            cpu: {{ .Values.resources.limits.cpu }}
            memory: {{ .Values.resources.limits.memory }}
```

#### ReplicaSet 설정 가이드

1. **셀렉터 설정**
   - 파드 식별을 위한 레이블 매칭 규칙 정의
   - 적절한 레이블링 전략 수립 필요

2. **레플리카 수 관리**
   - 초기 레플리카 수 설정
   - HPA와 연동 시 고려사항 검토

3. **파드 템플릿 설계**
   - 컨테이너 스펙 정의
   - 리소스 요청/제한 설정
   - 헬스 체크 구성

### DaemonSet

데몬셋은 모든 노드 또는 일부 노드가 파드의 사본을 실행하도록 한다.
노드가 클러스터에 추가되면 파드도 추가된다. 노드가 클러스터에서 제거되면 해당 파드는 가비지로 수집된다.
데몬셋을 삭제하면 데몬셋이 생성한 파드들이 정리된다.

데몬셋의 일부 대표적인 용도

모든 노드에서 클러스터 스토리지 데몬 실행

모든 노드에서 로그 수집 데몬 실행

모든 노드에서 노드 모니터링 데몬 실행

각 데몬 유형의 처리를 위해서 모든 노드를 커버하는 하나의 데몬셋이 사용된다. 더 복잡한 구성에서는 단일 유형의 데몬에 여러 데몬셋을 사용할 수 있지만, 각기 다른 하드웨어 유형에 따라 서로 다른 플래그, 메모리, CPU 요구가 달라진다.

### 컨테이너 리소스 관리

Kubernetes에서 효율적인 리소스 관리는 안정적인 애플리케이션 운영의 핵심입니다.

#### 리소스 요청과 제한

```yaml
# 리소스 설정 예시
resources:
  requests:
    memory: "128Mi"
    cpu: "250m"
  limits:
    memory: "256Mi"
    cpu: "500m"
```

1. **리소스 요청 (Requests)**
   - 컨테이너가 필요로 하는 최소 리소스 양
   - 스케줄링 결정에 사용
   - 노드의 리소스 예약에 활용

2. **리소스 제한 (Limits)**
   - 컨테이너가 사용할 수 있는 최대 리소스 양
   - 초과 시 컨테이너 제한 또는 재시작
   - OOM Killer 동작 기준

#### CPU 리소스 단위 이해

| 단위 | 설명 | 예시 |
|------|------|------|
| 코어 | 1.0 = 1개 CPU 코어 | `cpu: "1.0"` |
| 밀리코어 | 1000m = 1개 CPU 코어 | `cpu: "500m"` |
| 백분율 | CPU 코어의 백분율 | `cpu: "0.5"` (50%) |

##### CPU 리소스 특징

- **절대값 기준**: 노드 스펙과 무관하게 동일한 컴퓨팅 파워
- **최소 단위**: 1m (0.001) CPU
- **일반적인 설정**:
  - 가벼운 서비스: 100m-250m
  - 중간 규모: 500m-1000m
  - 리소스 집약적: 1000m 이상

#### 메모리 리소스 관리

```yaml
spec:
  containers:
  - name: app
    resources:
      requests:
        memory: "128Mi"
      limits:
        memory: "256Mi"
```

##### 메모리 단위 체계

| 단위 | 설명 | 사용 예 |
|------|------|---------|
| Ki | 킬로바이트 (1024) | `memory: "64Ki"` |
| Mi | 메가바이트 (1024^2) | `memory: "128Mi"` |
| Gi | 기가바이트 (1024^3) | `memory: "2Gi"` |

참고: 쿠버네티스에서 CPU 리소스를 1m보다 더 정밀한 단위로 표기할 수 없다. 이 때문에, CPU 단위를 1.0 또는 1000m보다 작은 밀리CPU 형태로 표기하는 것이 유용하다. 예를 들어, 0.005 보다는 5m으로 표기하는 것이 좋다.

### 메모리 리소스 단위

memory 에 대한 제한 및 요청은 바이트 단위로 측정된다. E, P, T, G, M, k 와 같은 수량 접미사 중 하나를 사용하여 메모리를 일반 정수 또는 고정 소수점 숫자로 표현할 수 있다. Ei, Pi, Ti, Gi, Mi, Ki와 같은 2의 거듭제곱을 사용할 수도 있다. 예를 들어, 다음은 대략 동일한 값을 나타낸다.

128974848, 129e6, 129M, 128974848000m, 123Mi

접미사의 대소문자에 유의한다. 400m의 메모리를 요청하면, 이는 0.4 바이트를 요청한 것이다. 이 사람은 아마도 400 메비바이트(mebibytes) (400Mi) 또는 400 메가바이트 (400M) 를 요청하고 싶었을 것이다.

<https://kubernetes.io/ko/docs/concepts/configuration/manage-resources-containers/>
