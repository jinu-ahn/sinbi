# README.md

# 🤵 Sinbi - 노년층을 위한 AI 비서 서비스

![메인](README_asset/Sinbi.png)

## Sinbi 링크 : https://sinbi.life/

---

## 1️⃣ 프로젝트 개요

⏳ **개발 기간**
2024.08.26 ~ 2024.10.11 (7주)
---

👨‍👨‍👦‍👦 **팀원 소개**
---

| **안진우(팀장) [BE]**                                          | **김희주 [FE]**                                                                      | **김시온 [INFRA]**                                                    |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| <img src="README_asset/나무늘보.jpg" width="200" height="200"> | <img src="README_asset/코알라.png" width="200" height="200"> | <img src="README_asset/침팬치.png" width="200" height="200"> |
| 팀장 <br> SpringCloudConfig <br> Security <br> JWT <br> Kafka | 계좌 조회 <br> 계좌 등록 <br> 계좌 이체 <br> tts/stt | 인프라 담당 <br> 아키텍쳐 설계 <br> K8S <br> GitOps |


| **이정하 [FE]**                                                | **이학현 [BE]**                                                                      | **지민경 [AI/데이터 시각화]**                                               |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| <img src="README_asset/앵무새.png" width="200" height="200">  | <img src="README_asset/벨루가.png" width="200" height="200"> | <img src="README_asset/금붕어.jpg" width="200" height="200"> |
| 회원가입 <br> 로그인 <br> 배우기 <br> 뉴스 페이지          | Kafka 기능 적용 <br> MSA 설계 <br> SAGA 패턴 적용 <br> 문서화 | T5 기반 방언 데이터 학습 모델 <br> T5-Text summary <br> Sentence-Bert <br> Mecab <br> Okt <br> Flask API  <br> Redis  <br> BeautifulSoup |


📕 **기획 의도**
---

“Sinbi”는 어르신 비서의 줄임말로, 디지털에 익숙하지 않은 노년층을 위한 AI 기반 포용적 금융 서비스 플랫폼입니다. 이 서비스는 노령층의 디지털 금융 접근성을 높이고, 복잡한 금융 과정을 음성을 통해 쉽게 이용할 수 있도록 돕는 것을 목표로 합니다.

“Sinbi”는 음성 인식 기술을 이용하여 계좌 조회, 송금, 금융 상품 조회 등 기본적인 금융 서비스를 음성으로 간편하게 제공합니다. 또한, 금융 사기 예방 교육과 금융 관련 최신 뉴스를 음성으로 전달하며, 사용자가 이해하기 쉽게 설명하는 기능을 포함하고 있습니다. 노년층이 디지털 금융에 대한 두려움을 줄이고, 독립적으로 금융 업무를 처리할 수 있도록 AI 비서의 역할을 수행합니다.

궁극적으로 이 프로젝트는 사용자들이 자신들의 금융 생활을 더욱 독립적이고 안전하게 관리할 수 있도록 지원하며, 사용자의 삶에 금융적 안정과 자신감을 더해주는 것을 목표로 하고 있습니다. Sinbi를 통해 노년층도 스마트하고 안전하게 금융 생활을 즐길 수 있도록 돕고자 합니다.

💭 **목표**
---
- 사용자 중심 경험 제공
  - 직관적이고 사용하기 쉬운 인터페이스 설계를 통해 노년층 사용자가 디지털 금융을 더 쉽게 접근할 수 있도록 지원
  - 개인화된 AI 금융 도우미 서비스를 제공하여 사용자가 자신의 금융 상황에 맞춘 도움을 받을 수 있도록 함
- 생성형 AI 기술 활용
  - 최신 음성 인식 및 자연어 처리 기술을 활용하여 사용자의 음성을 정확하게 인식하고, 맥락에 맞는 금융 정보를 제공
  - 단순 명령어뿐 아니라 대화형 인터페이스를 통해 사용자가 금융 거래를 더욱 직관적으로 이해할 수 있도록 지원

---

## 2️⃣ 서비스 소개

### 1. 메인페이지

✔️ 메인 페이지 기능/모바일

​ ✔️ 진행중인 워케이션

​ ✔️ 워케이션 효과 및 경제적 파급효과

![main.gif](./exec/시연_과정/gifs/main.gif)

### 2. 회원가입 및 로그인

​ ✔️ 회원 가입 및 로그인 기능 /모바일

​ ✔️ 지역 선택

![user.gif](./exec/시연_과정/gifs/user.gif)

### 3. 대시보드

​ ✔️ 대시보드 기능/모바일

​ ✔️ 일정 관리

​ ✔️ AI 일정 리마인드

![dashboard.gif](./exec/시연_과정/gifs/dashboard.gif)

### 4. 내 채널

​ ✔️ 내 채널 기능/모바일

​ ✔️ 피드 작성/삭제

​ ✔️ 프로필 사진 변경

![feed.gif](./exec/시연_과정/gifs/feed.gif)

### 5. 정보 채널

​ ✔️ 정보 채널 기능/모바일

​ ✔️ 다양한 피드 보기/작성/삭제

![information.gif](./exec/시연_과정/gifs/모임채널%20생성.gif)

### 6. 모임 채널

​ ✔️ 모임 채널 기능/모바일

​ ✔️ 모임 채널 생성/삭제

​ ✔️ 모임 채널 보기

![모임채널.gif](./exec/시연_과정/gifs/모임채널%20생성.gif)

### 7. 모임채널 - 공유지도

​ ✔️ 공유 지도 기능/모바일

​ ✔️ 공유 지도 검색

![모임채널 핵심기술.gif](./exec/시연_과정/gifs/search.gif)

### 8. 모임 채널 - 채팅 및 영상 통화

​ ✔️ 기능/모바일

​ ✔️ 채팅 및 영상 통화

![모임채널 핵심기술.gif](./exec/시연_과정/gifs/rtc.gif)


---

## 3️⃣ 기술 스택

## 🌝 사용된 도구

- React 18.3.1
- Typescript
- Three.js
- Spring Boot 3.3.2
- spring Data JPA
- spring security
- JWT
- Spring Cloud Config
- java 17
- Gradle 8.8
- IDE: Visual Studio Code 1.48, IntelliJ IDEA 2024.1.1 (Ultimate Edition)
- GitLab
- Jira
- Discord
- pytorch
- flask
- EC2
- GCP
- S3
- K8S
- Jenkins
- Argo
- Docker
- Nginx Ingress Controller
- MySQL
- Redis
- Mattermost Notification
- Kafka
- Kafka-ui
- Helm
- S3
- DockerHub
- Zustand


## 🌝 사용된 기술

### 🌞 [FE]

<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white"> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"> 
<img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white">
<img src="https://img.shields.io/badge/Zustand-5D3FD3?style=for-the-badge&logo=zustand&logoColor=white">

---
### 🌚 [BE]

<img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"> 
<img src="https://img.shields.io/badge/Spring%20Data%20JPA-6DB33F?style=for-the-badge&logo=spring&logoColor=white"> 
<img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white">
<img src="https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white"> 
<img src="https://img.shields.io/badge/Java-17-007396?style=for-the-badge&logo=java&logoColor=white">
<img src="https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white"> 
<img src="https://img.shields.io/badge/Spring%20Cloud%20Config-6DB33F?style=for-the-badge&logo=spring&logoColor=white"> 
<img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white">
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"> 
<img src="https://img.shields.io/badge/Kafka-231F20?style=for-the-badge&logo=apachekafka&logoColor=white"> 
<img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white">

---
---
### 🌝 [Infra]

<img src="https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white"> 
<img src="https://img.shields.io/badge/Docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white"> 
<img src="https://img.shields.io/badge/Amazon%20EC2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white"> 
<img src="https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white"> 
<img src="https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white">
<img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white">
<img src="https://img.shields.io/badge/Ingress%20Controller-000000?style=for-the-badge&logo=nginx&logoColor=white">
<img src="https://img.shields.io/badge/Argo-EB6A00?style=for-the-badge&logo=argo&logoColor=white">
<img src="https://img.shields.io/badge/Google%20Kubernetes%20Engine-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white">


## 🌝[기술]
![사용된 기술](README_asset/기술.PNG)

**[ BACK END ]**

- **Spring Security** : SecurityFilterChain을 사용하여 사용자 인증과 권한에 따라 인가 기능을 구현.
- **JWT** : JSON Web Token을 활용하여 안전한 사용자 인증 및 정보 교환을 구현.
- **Spring Data JAP** : 데이터베이스와의 통신을 위해 JPA를 사용해 간편한 CRUD 기능 및 쿼리 최적화를 제공.
- **Spring Cloud Config** : 분산 환경에서 중앙화된 설정 관리와 버전 관리를 통해 서비스의 일관성을 유지.
- **MySQL** : 회원 정보, 금융 기록 등 주요 데이터를 저장하는 데 사용.
- **Pytorch** : 머신러닝 모델 구현과 학습을 위해 사용.
- **Flask** : 간단한 RESTful API 서버나 머신러닝 모델의 서빙을 위해 Python 기반의 마이크로 웹 프레임워크로 사용.

**[ FRONT END ]**

- **React** : 컴포넌트 기반의 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리.
- **TypeScript** : JavaScript의 슈퍼셋으로, 정적 타입을 사용해 더 안정적이고 유지보수하기 쉬운 코드를 작성.
- **Three.js** : WebGL을 사용하여 3D 그래픽과 애니메이션을 구현하는 JavaScript 라이브러리.
- **PWA (Progressive Web App)** : 매니페스트 파일을 이용하여 사용자가 웹 앱을 모바일 기기에 설치할 수 있도록 지원.
- **Zustand** : 경량 상태 관리 라이브러리로, React 애플리케이션에서의 전역 상태 관리를 간편하게 지원.

**[ INFRA ]**
- **Kubernetes(K8S)** : 컨테이너 오케스트레이션을 통해 애플리케이션의 배포, 확장 및 관리를 자동화하여 서비스의 신뢰성과 확장성을 높임.
- **Docker & Docker Compose** : 애플리케이션을 컨테이너화하여 이식성을 높였으며, Docker Compose를 사용하여 다중 컨테이너 애플리케이션 관리.
- **AWS**
  - **EC2** : 애플리케이션 서버를 호스팅하고 배포하는 데 사용하여 클라우드 기반의 확장 가능성과 안정성을 제공.
  - **S3** : 정적 파일과 사용자 콘텐츠 저장을 위한 안전한 스토리지로 사용.
- **Jenkins** : 지속적 통합 및 지속적 배포(CI/CD)를 자동화하여 개발과 배포의 일관성과 신속성을 보장.
- **Ingress Controller** : Nginx 기반으로 클러스터 외부의 요청을 내부 서비스로 라우팅하여 부하 분산 및 리버스 프록시 역할 수행.
- **GitLab** : 코드 버전 관리와 협업을 위한 Git 저장소로 사용, CI/CD 파이프라인 구축에 활용.
- **Gradle** : 프로젝트 빌드 및 의존성 관리를 통해 백엔드 애플리케이션의 효율적인 빌드 프로세스 제공.
- **Redis** : 인메모리 데이터 저장소로, 캐싱을 통해 데이터 조회 속도를 향상시키고 세션 관리와 메시지 큐 등에 사용하여 시스템 성능 최적화.
- **Google Kubernetes Engine (GKE)** : Google Cloud에서 Kubernetes 클러스터를 관리하고 배포할 수 있는 서비스로, 인프라의 안정성과 확장성을 지원.
- **Argo** : Kubernetes 클러스터에서 워크플로우를 자동화하고 관리하는 도구로, CI/CD 및 배포 파이프라인 구축에 활용.

**[ TEAM Cooperation ]**

- **GitLab** : GitLab을 활용하여 프로젝트를 관리.
  - Git Flow 에 따른 브랜치 전략 수립.
  - MR 시 코드 리뷰 진행.
- **Jira** : 이슈 관리 도구로 활용.
  - 주요 기능들을 이슈로 등록하고 Story Point를 산정한 후, 담당자를 지정하여 프로젝트를 진행.
  - 1~2 주 정도 상황에 맞게 스프린트를 설정.

## 🌝 시스템 아키텍쳐

![시스템 아키텍쳐](README_asset/아키텍쳐.PNG)

## 🌝 ERD

![SSAFY_공통_C104_ERD.png](README_asset/ERD.png)

---

## 🌝 폴더 구조

## 🌞[FE]

```
📦src
 ┣ 📂assets
 ┃ ┣ 📂logoSVG
 ┃ ┃ ┣ 📜btn_apple.svg
 ┃ ┃ ┣ 📜btn_gmail.svg
 ┃ ┃ ┣ 📜btn_google.svg
 ┃ ┃ ┣ 📜btn_kakao.svg
 ┃ ┃ ┗ 📜btn_naver.svg
 ┃ ┣ 📜404.png
 ┃ ┣ 📜500.png
 ┃ ┣ 📜back.svg
 ┃ ┣ 📜background.svg
 ┃ ┣ 📜censoredImg.png
 ┃ ┣ 📜detailBG.jpg
 ┃ ┣ 📜icons.jsx
 ┃ ┣ 📜img_generator.png
 ┃ ┣ 📜login.svg
 ┃ ┣ 📜logout.svg
 ┃ ┣ 📜react.svg
 ┃ ┣ 📜send.svg
 ┃ ┗ 📜user.svg
 ┣ 📂components
 ┃ ┣ 📜Button.jsx
 ┃ ┗ 📜NavigationBar.jsx
 ┣ 📂pages
 ┃ ┣ 📂DreamPage
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┣ 📜ContentBox.jsx
 ┃ ┃ ┃ ┣ 📜DatePicker.jsx
 ┃ ┃ ┃ ┣ 📜ImageGenerator.jsx
 ┃ ┃ ┃ ┣ 📜InterpretationBox.jsx
 ┃ ┃ ┃ ┣ 📜ShareSettings.jsx
 ┃ ┃ ┃ ┗ 📜UpperBar.jsx
 ┃ ┃ ┣ 📜DreamDetailPage.jsx
 ┃ ┃ ┗ 📜DreamRegisterPage.jsx
 ┃ ┣ 📂LoginPage
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┣ 📜FadeInText.jsx
 ┃ ┃ ┃ ┗ 📜LoginSuccess.jsx
 ┃ ┃ ┗ 📜LoginPage.jsx
 ┃ ┣ 📂SkeletonPage
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┗ 📜SkeletonBlock.jsx
 ┃ ┃ ┣ 📜SquareDetailSkeletonPage.jsx
 ┃ ┃ ┣ 📜SquareSkeletonPage.jsx
 ┃ ┃ ┗ 📜StatisticsSkeletonPage.jsx
 ┃ ┣ 📂StreamingPage
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┣ 📂legacy
 ┃ ┃ ┃ ┃ ┣ 📜StreamingList_WebRTC.jsx
 ┃ ┃ ┃ ┃ ┗ 📜StreamingRoom_WebRTC.jsx
 ┃ ┃ ┃ ┣ 📜StreamingList.jsx
 ┃ ┃ ┃ ┗ 📜StreamingRoom.jsx
 ┃ ┃ ┗ 📜StreamingPage.jsx
 ┃ ┣ 📜ErrorPage.jsx
 ┃ ┣ 📜MainPage.jsx
 ┃ ┣ 📜SettingsPage.jsx
 ┃ ┣ 📜SquareDetailPage.jsx
 ┃ ┣ 📜SquarePage.jsx
 ┃ ┗ 📜StatisticsPage.jsx
 ┣ 📂recoil
 ┃ ┗ 📜atoms.js
 ┣ 📂utils
 ┃ ┣ 📜api.js
 ┃ ┣ 📜firebase.js
 ┃ ┗ 📜utils.js
 ┣ 📜App.jsx
 ┣ 📜index.css
 ┗ 📜main.jsx
```

## 🌚[BE]

### 📕 account

---
```
📦main
 ┣ 📂java
 ┃ ┗ 📂c104
 ┃ ┃ ┗ 📂sinbiaccount
 ┃ ┃ ┃ ┣ 📂account
 ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┣ 📜AccountController.java
 ┃ ┃ ┃ ┃ ┃ ┗ 📜AccountQueryController.java
 ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┣ 📜AccountCreateRequest.java
 ┃ ┃ ┃ ┃ ┃ ┣ 📜AccountDetailView.java
 ┃ ┃ ┃ ┃ ┃ ┣ 📜AccountEvent.java
 ┃ ┃ ┃ ┃ ┃ ┣ 📜AccountListView.java
 ┃ ┃ ┃ ┃ ┃ ┣ 📜CommandVirtualAccountDto.java
 ┃ ┃ ┃ ┃ ┃ ┣ 📜DepositRequestDto.java
 ┃ ┃ ┃ ┃ ┃ ┣ 📜GetAccountListResponse.java
 ┃ ┃ ┃ ┃ ┃ ┣ 📜RollBackDto.java
 ┃ ┃ ┃ ┃ ┃ ┣ 📜SaveTransactionHistoryRequest.java
 ┃ ┃ ┃ ┃ ┃ ┗ 📜TransferAccountRequest.java
 ┃ ┃ ┃ ┃ ┣ 📂repository
 ┃ ┃ ┃ ┃ ┃ ┣ 📜AccountQueryRepository.java
 ┃ ┃ ┃ ┃ ┃ ┗ 📜AccountRepository.java
 ┃ ┃ ┃ ┃ ┣ 📂service
 ┃ ┃ ┃ ┃ ┃ ┣ 📜AccountQueryService.java
 ┃ ┃ ┃ ┃ ┃ ┗ 📜AccountService.java
 ┃ ┃ ┃ ┃ ┗ 📜Account.java
 ┃ ┃ ┃ ┣ 📂config
 ┃ ┃ ┃ ┃ ┣ 📜KafkaConfig.java
 ┃ ┃ ┃ ┃ ┣ 📜RedisConfig.java
 ┃ ┃ ┃ ┃ ┗ 📜SecurityConfig.java
 ┃ ┃ ┃ ┣ 📂constant
 ┃ ┃ ┃ ┃ ┣ 📜BankTypeEnum.java
 ┃ ┃ ┃ ┃ ┗ 📜ErrorCode.java
 ┃ ┃ ┃ ┣ 📂exception
 ┃ ┃ ┃ ┃ ┣ 📂global
 ┃ ┃ ┃ ┃ ┃ ┣ 📜ApiResponse.java
 ┃ ┃ ┃ ┃ ┃ ┗ 📜ControllerExceptionAdvice.java
 ┃ ┃ ┃ ┃ ┣ 📜AccountAlreadyExistsException.java
 ┃ ┃ ┃ ┃ ┣ 📜AccountNotFoundException.java
 ┃ ┃ ┃ ┃ ┣ 📜IllgalArgumentException.java
 ┃ ┃ ┃ ┃ ┣ 📜ReceiverAlreadyExistsException.java
 ┃ ┃ ┃ ┃ ┣ 📜ReceiverSaveFailedException.java
 ┃ ┃ ┃ ┃ ┣ 📜RefreshTokenNotFoundException.java
 ┃ ┃ ┃ ┃ ┣ 📜UserAlreadyExistsException.java
 ┃ ┃ ┃ ┃ ┗ 📜UserNotFoundException.java
 ┃ ┃ ┃ ┣ 📂filter
 ┃ ┃ ┃ ┃ ┣ 📜AuthenticationFilter.java
 ┃ ┃ ┃ ┃ ┣ 📜CustomAccessDeniedHandler.java
 ┃ ┃ ┃ ┃ ┣ 📜CustomAuthenticationEntryPoint.java
 ┃ ┃ ┃ ┃ ┣ 📜JwtExceptionFilter.java
 ┃ ┃ ┃ ┃ ┗ 📜TokenProvider.java
 ┃ ┃ ┃ ┣ 📂receiver
 ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┣ 📜ReceiverController.java
 ┃ ┃ ┃ ┃ ┃ ┗ 📜ReceiverQueryController.java
 ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┣ 📜ReceiverAccountListResponse.java
 ┃ ┃ ┃ ┃ ┃ ┣ 📜ReceiverAccountListView.java
 ┃ ┃ ┃ ┃ ┃ ┣ 📜ReceiverEvent.java
 ┃ ┃ ┃ ┃ ┃ ┗ 📜ReceiverRegistrationRequest.java
 ┃ ┃ ┃ ┃ ┣ 📂repository
 ┃ ┃ ┃ ┃ ┃ ┣ 📜ReceiverQueryRepository.java
 ┃ ┃ ┃ ┃ ┃ ┗ 📜ReceiverRepository.java
 ┃ ┃ ┃ ┃ ┣ 📂service
 ┃ ┃ ┃ ┃ ┃ ┣ 📜ReceiverQueryService.java
 ┃ ┃ ┃ ┃ ┃ ┗ 📜ReceiverService.java
 ┃ ┃ ┃ ┃ ┗ 📜Receiver.java
 ┃ ┃ ┃ ┣ 📂transactionhistory
 ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┗ 📜TransactionHistoryController.java
 ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┗ 📜TransactionHistoryResponse.java
 ┃ ┃ ┃ ┃ ┣ 📂repository
 ┃ ┃ ┃ ┃ ┃ ┗ 📜TransactionHistoryRepository.java
 ┃ ┃ ┃ ┃ ┣ 📂service
 ┃ ┃ ┃ ┃ ┃ ┗ 📜TransactionHistoryService.java
 ┃ ┃ ┃ ┃ ┗ 📜TransactionHistory.java
 ┃ ┃ ┃ ┣ 📂util
 ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┗ 📜TokenDto.java
 ┃ ┃ ┃ ┃ ┣ 📜AccountEventListener.java
 ┃ ┃ ┃ ┃ ┣ 📜CookieUtil.java
 ┃ ┃ ┃ ┃ ┣ 📜HeaderUtil.java
 ┃ ┃ ┃ ┃ ┣ 📜KafkaConsumerUtil.java
 ┃ ┃ ┃ ┃ ┣ 📜KafkaProducerUtil.java
 ┃ ┃ ┃ ┃ ┣ 📜ReceiverEventListener.java
 ┃ ┃ ┃ ┃ ┣ 📜RedisUtil.java
 ┃ ┃ ┃ ┃ ┗ 📜VirtualAccountResponseHandler.java
 ┃ ┃ ┃ ┣ 📜BaseTimeEntity.java
 ┃ ┃ ┃ ┗ 📜SinbiAccountApplication.java
 ┗ 📂resources
 ┃ ┗ 📜application.yml
```

 ### 📗filter
---
```
 📦main
 ┣ 📂java
 ┃ ┗ 📂c104
 ┃ ┃ ┗ 📂sinbisecurity
 ┃ ┃ ┃ ┣ 📂config
 ┃ ┃ ┃ ┃ ┗ 📜SecurityConfig.java
 ┃ ┃ ┃ ┣ 📂constant
 ┃ ┃ ┃ ┃ ┗ 📜ErrorCode.java
 ┃ ┃ ┃ ┣ 📂exception
 ┃ ┃ ┃ ┃ ┣ 📂global
 ┃ ┃ ┃ ┃ ┃ ┗ 📜ApiResponse.java
 ┃ ┃ ┃ ┃ ┗ 📜RefreshTokenNotFoundException.java
 ┃ ┃ ┃ ┣ 📂filter
 ┃ ┃ ┃ ┃ ┣ 📜AuthenticationFilter.java
 ┃ ┃ ┃ ┃ ┣ 📜CustomAccessDeniedHandler.java
 ┃ ┃ ┃ ┃ ┣ 📜CustomAuthenticationEntryPoint.java
 ┃ ┃ ┃ ┃ ┣ 📜JwtExceptionFilter.java
 ┃ ┃ ┃ ┃ ┗ 📜TokenProvider.java
 ┃ ┃ ┃ ┣ 📂util
 ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┗ 📜TokenDto.java
 ┃ ┃ ┃ ┃ ┗ 📜CookieUtil.java
 ┃ ┃ ┃ ┗ 📜SinbiSecurityApplication.java
 ┗ 📂resources
 ┃ ┗ 📜application.yml
```

### 📘user
---
```
 📦main
 ┣ 📂java
 ┃ ┗ 📂c104
 ┃ ┃ ┗ 📂sinbicommon
 ┃ ┃ ┃ ┣ 📂config
 ┃ ┃ ┃ ┃ ┣ 📂s3
 ┃ ┃ ┃ ┃ ┃ ┣ 📜S3Config.java
 ┃ ┃ ┃ ┃ ┃ ┗ 📜S3Uploader.java
 ┃ ┃ ┃ ┃ ┣ 📜RedisConfig.java
 ┃ ┃ ┃ ┃ ┗ 📜SecurityConfig.java
 ┃ ┃ ┃ ┣ 📂constant
 ┃ ┃ ┃ ┃ ┣ 📜BankTypeEnum.java
 ┃ ┃ ┃ ┃ ┗ 📜ErrorCode.java
 ┃ ┃ ┃ ┣ 📂exception
 ┃ ┃ ┃ ┃ ┣ 📂global
 ┃ ┃ ┃ ┃ ┃ ┣ 📜ApiResponse.java
 ┃ ┃ ┃ ┃ ┃ ┗ 📜ControllerExceptionAdvice.java
 ┃ ┃ ┃ ┃ ┣ 📜AccountNotFoundException.java
 ┃ ┃ ┃ ┃ ┣ 📜FaceAuthenticationException.java
 ┃ ┃ ┃ ┃ ┣ 📜IllgalArgumentException.java
 ┃ ┃ ┃ ┃ ┣ 📜JsonFormatException.java
 ┃ ┃ ┃ ┃ ┣ 📜ReceiverAlreadyExistsException.java
 ┃ ┃ ┃ ┃ ┣ 📜ReceiverSaveFailedException.java
 ┃ ┃ ┃ ┃ ┣ 📜RefreshTokenNotFoundException.java
 ┃ ┃ ┃ ┃ ┣ 📜S3Exception.java
 ┃ ┃ ┃ ┃ ┣ 📜UserAlreadyExistsException.java
 ┃ ┃ ┃ ┃ ┗ 📜UserNotFoundException.java
 ┃ ┃ ┃ ┣ 📂jwt
 ┃ ┃ ┃ ┃ ┣ 📜FaceIdAuthenticationProvider.java
 ┃ ┃ ┃ ┃ ┗ 📜TokenProvider.java
 ┃ ┃ ┃ ┣ 📂sms
 ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┗ 📜SmsController.java
 ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┣ 📜CoolSmsRequestDto.java
 ┃ ┃ ┃ ┃ ┃ ┗ 📜SmsVerifyDto.java
 ┃ ┃ ┃ ┃ ┣ 📂repository
 ┃ ┃ ┃ ┃ ┃ ┗ 📜SmsRepository.java
 ┃ ┃ ┃ ┃ ┗ 📂service
 ┃ ┃ ┃ ┃ ┃ ┣ 📜CoolSmsService.java
 ┃ ┃ ┃ ┃ ┃ ┗ 📜SmsCertificationUtil.java
 ┃ ┃ ┃ ┣ 📂user
 ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┗ 📜UserController.java
 ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┣ 📜LoginDto.java
 ┃ ┃ ┃ ┃ ┃ ┣ 📜SignUpDto.java
 ┃ ┃ ┃ ┃ ┃ ┗ 📜TokenDto.java
 ┃ ┃ ┃ ┃ ┣ 📂repository
 ┃ ┃ ┃ ┃ ┃ ┗ 📜UserRepository.java
 ┃ ┃ ┃ ┃ ┣ 📂service
 ┃ ┃ ┃ ┃ ┃ ┣ 📜UserDetailsServiceImpl.java
 ┃ ┃ ┃ ┃ ┃ ┗ 📜UserService.java
 ┃ ┃ ┃ ┃ ┗ 📜User.java
 ┃ ┃ ┃ ┣ 📂util
 ┃ ┃ ┃ ┃ ┣ 📜CookieUtil.java
 ┃ ┃ ┃ ┃ ┣ 📜KakaoFaceAuthenticationUtil.java
 ┃ ┃ ┃ ┃ ┗ 📜RedisUtil.java
 ┃ ┃ ┃ ┣ 📜BaseTimeEntity.java
 ┃ ┃ ┃ ┗ 📜SinbiCommonApplication.java
 ┗ 📂resources
 ┃ ┗ 📜application.yml
```

### 📙virtualaccount
---
```
 📦main
 ┣ 📂java
 ┃ ┗ 📂c104
 ┃ ┃ ┗ 📂sinbireceiver
 ┃ ┃ ┃ ┣ 📂config
 ┃ ┃ ┃ ┃ ┣ 📜KafkaConfig.java
 ┃ ┃ ┃ ┃ ┗ 📜RedisConfig.java
 ┃ ┃ ┃ ┣ 📂constant
 ┃ ┃ ┃ ┃ ┣ 📜BankTypeEnum.java
 ┃ ┃ ┃ ┃ ┗ 📜ErrorCode.java
 ┃ ┃ ┃ ┣ 📂exception
 ┃ ┃ ┃ ┃ ┣ 📂global
 ┃ ┃ ┃ ┃ ┃ ┣ 📜ApiResponse.java
 ┃ ┃ ┃ ┃ ┃ ┗ 📜ControllerExceptionAdvice.java
 ┃ ┃ ┃ ┃ ┣ 📜AccountNotFoundException.java
 ┃ ┃ ┃ ┃ ┣ 📜DepositFailedException.java
 ┃ ┃ ┃ ┃ ┣ 📜IllgalArgumentException.java
 ┃ ┃ ┃ ┃ ┣ 📜ReceiverAlreadyExistsException.java
 ┃ ┃ ┃ ┃ ┣ 📜ReceiverSaveFailedException.java
 ┃ ┃ ┃ ┃ ┣ 📜UserAlreadyExistsException.java
 ┃ ┃ ┃ ┃ ┗ 📜UserNotFoundException.java
 ┃ ┃ ┃ ┣ 📂util
 ┃ ┃ ┃ ┃ ┣ 📜KafkaConsumerUtil.java
 ┃ ┃ ┃ ┃ ┣ 📜KafkaProducerUtil.java
 ┃ ┃ ┃ ┃ ┗ 📜RedisUtil.java
 ┃ ┃ ┃ ┣ 📂virtualaccount
 ┃ ┃ ┃ ┃ ┣ 📂controller
 ┃ ┃ ┃ ┃ ┃ ┗ 📜VirtualAccountController.java
 ┃ ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┃ ┃ ┣ 📜AccountCreateRequest.java
 ┃ ┃ ┃ ┃ ┃ ┣ 📜DepositRequestDto.java
 ┃ ┃ ┃ ┃ ┃ ┣ 📜VirtualAccountCheckRequest.java
 ┃ ┃ ┃ ┃ ┃ ┗ 📜VirtualAccountDto.java
 ┃ ┃ ┃ ┃ ┣ 📂repository
 ┃ ┃ ┃ ┃ ┃ ┗ 📜VirtualAccountRepository.java
 ┃ ┃ ┃ ┃ ┣ 📂service
 ┃ ┃ ┃ ┃ ┃ ┗ 📜VirtualAccountService.java
 ┃ ┃ ┃ ┃ ┗ 📜VirtualAccount.java
 ┃ ┃ ┃ ┗ 📜SinbiReceiverApplication.java
 ┗ 📂resources
 ┃ ┗ 📜application.yml
```
