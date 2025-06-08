# Docker Desktop 설치 및 프로젝트 연결 사용법

## 1. Docker Desktop 설치

1. [Docker 공식 홈페이지](https://www.docker.com/products/docker-desktop/)에서 Docker Desktop을 다운로드합니다.
2. 설치 파일을 실행하여 안내에 따라 설치를 완료합니다.
3. 설치 후 Docker Desktop을 실행하고, 정상적으로 동작하는지 확인합니다.

## 2. Docker Desktop 기본 설정

- Windows의 경우 WSL2(Windows Subsystem for Linux) 활성화가 필요할 수 있습니다.
- Docker Desktop 실행 후, 우측 하단의 Docker 아이콘이 정상적으로 떠 있으면 준비 완료입니다.

## 3. 프로젝트에 Docker 연결

1. 이 프로젝트 폴더(`youth-polcy-embedding`)로 이동합니다.
2. 터미널(명령 프롬프트, PowerShell, 또는 VS Code 터미널)에서 아래 명령어를 실행합니다.
3. docker-compose.yml 파일에서 be아래의 environment 아래에 
# Docker Desktop 설치 및 프로젝트 연결 사용법

## 1. Docker Desktop 설치

1. [Docker 공식 홈페이지](https://www.docker.com/products/docker-desktop/)에서 Docker Desktop을 다운로드합니다.
2. 설치 파일을 실행하여 안내에 따라 설치를 완료합니다.
3. 설치 후 Docker Desktop을 실행하고, 정상적으로 동작하는지 확인합니다.

## 2. Docker Desktop 기본 설정

- Windows의 경우 WSL2(Windows Subsystem for Linux) 활성화가 필요할 수 있습니다.
- Docker Desktop 실행 후, 우측 하단의 Docker 아이콘이 정상적으로 떠 있으면 준비 완료입니다.

## 3. 프로젝트에 Docker 연결

1. 이 프로젝트 폴더(`youth-polcy-embedding`)로 이동합니다.
2. 터미널(명령 프롬프트, PowerShell, 또는 VS Code 터미널)에서 아래 명령어를 실행합니다.

   ```bash
   cd "c:\Users\yug67\OneDrive\바탕 화면\대학원 수업\텐서플로우 활용기초 정화민\project\youth-polcy-embedding"# Docker Desktop 설치 및 프로젝트 연결 사용법

## 1. Docker Desktop 설치

1. [Docker 공식 홈페이지](https://www.docker.com/products/docker-desktop/)에서 Docker Desktop을 다운로드합니다.
2. 설치 파일을 실행하여 안내에 따라 설치를 완료합니다.
3. 설치 후 Docker Desktop을 실행하고, 정상적으로 동작하는지 확인합니다.

## 2. Docker Desktop 기본 설정

- Windows의 경우 WSL2(Windows Subsystem for Linux) 활성화가 필요할 수 있습니다.
- Docker Desktop 실행 후, 우측 하단의 Docker 아이콘이 정상적으로 떠 있으면 준비 완료입니다.

## 3. 프로젝트에 Docker 연결

1. 이 프로젝트 폴더(`youth-polcy-embedding`)로 이동합니다.
2. 터미널(명령 프롬프트, PowerShell, 또는 VS Code 터미널)에서 아래 명령어를 실행합니다.
3. docker-compose.yml 파일 아래 be 아래 environment:에 아래 세줄 추가.
- MONGODB_URL=mongodb+srv://llmteam:llmteam123$@llm-cluster.zkkxnm3.mongodb.net/?retryWrites=true&w=majority&appName=llm-cluster
- ONTO_API_KEY=fae4bce6-a7b9-437f-af07-4293a2e16840
- PINECONE_API_KEY=pcsk_5ACT98_7pTiTzDhGmkSA4dj9Jr4RxCXmYqUBEwhE57fSA5hHGpCKpcAiZMXX2pHtRXYcjF
4. docker compose up --build or docker-compose up --build
 - 처음 실행 시 필요한 이미지와 모델을 다운로드하므로 시간이 소요됩니다.
 - docker compose down or ctrl + c or docker-compose down 으로 실행 도커 내릴 수 있음.

5. 서비스 접속
FE(프론트엔드): http://localhost:3000
BE(백엔드 API): http://localhost:8000/docs (FastAPI Swagger 문서)
Ollama API: http://localhost:11434 (모델 inference)