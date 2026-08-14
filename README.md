리눅스 환경에서 3 tier architecture로 구성된 웹 앱을 동일한 호스트 내에서 Docker Compose로 띄워보는 예시 프로젝트.  

파일 업로드 및 다운로드, 이미지 파일 화면 출력 실습을 위해 만들어뒀던 프론트엔드, 백엔드 프로젝트들을 하나로 합쳐 Docker Compose 실습으로 활용하였습니다. 

# Overview of web app
username-password 기반 로그인 기능과 이미지 파일 업로드 및 다운로드 기능을 학습하기 위해 구현한 간단한 이미지 앨범 웹앱입니다. 로그인한 사용자는 자신의 이미지만 볼 수 있으며, 비로그인한 사용자는 어떤 이미지도 볼 수 없습니다. 

<div align="center">
  <img src="/readme-resources/image-album-signin.gif" alt="image">
</div>

<div align="center">
  <img src="/readme-resources/image-album-upload-and-download-image.gif" alt="image">
</div>

# Skills

- Frontend
  - React (CRA)
  - Nginx (web server)
- Backend
  - Spring Boot 3.4.1
  - Spring Data JPA
  - Gradle
  - MariaDB
  - REST API
- Deployment
  - WSL 2
  - Ubuntu 26.04 LTS
  - Docker Desktop 4.81.0
  - Docker Compose v5.2.0

# Deployment

- 3 tier architecture 구조를 따라 웹 서버, 애플리케이션 서버, DBMS 프로그램들을 각각 컨테이너로 격리한 후, 동일한 호스트 위에서 컨테이너들을 실행하는 방식으로 로컬에 배포 연습을 진행하였습니다. 

<div align="center">
  <img src="/readme-resources/local-web-app-docker.drawio.png" alt="image">
</div>

# Details

- 프로젝트 폴더 구조

```
/project
  /frontend
    /src
    package.json
    Dockerfile
    nginx.conf
    ...
  /backend
    /src
    build.gradle
    Dockerfile
    ...
  /secrets  # docker secrets
    db-root-password.txt
    db-name.txt
    spring-datasource-password.txt
    spring-datasource-url.txt
    spring-datasource-user.txt
  .env
  .gitignore
  compose.yaml
```

프론트엔드와 백엔드 모두 Docker 내에서 artifact(빌드 결과물)를 생성한 뒤 이를 토대로 실행 환경을 마련하는 방식으로 Docker image를 구성하였습니다.

프론트엔드에서는 다음과 같은 설정을 하였습니다.

- Dockerfile

```Dockerfile
# === build stage ===
FROM node:22 AS builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# === runtime stage ===
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
```

- nginx.conf

```nginx
server {
  listen 80;

  location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
  }

  location /api/ {
    proxy_pass http://backend:8080;
  }
}
```

백엔드에서는 다음과 같은 설정을 하였습니다.

```Dockerfile
# === build stage ===
FROM eclipse-temurin:21-jdk as builder
WORKDIR /app
COPY . .
RUN ./gradlew clean build -x test

# === Runtime stage ===
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Docker compose는 다음과 같이 구성하였습니다.

```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - ${FRONTEND_PORT}:80
    networks:
      - frontend-net
    volumes:
      # ro: read-only
      - ./frontend/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - backend
      - db-server
  
  backend:
    build: ./backend
    ports: 
      - ${BACKEND_PORT}:8080
    networks:
      - backend-net
      - frontend-net
    volumes:
      # Dockerfile에서의 디렉터리 구조를 참고. 
      - image-vol:/app/files
    depends_on:
      db-server:
        condition: service_healthy
    secrets:
      - db-url
      - db-user
      - db-password
  
  db-server:
    image: mariadb:latest
    volumes:
      - db-vol:/var/lib/mysql
    networks:
      - backend-net
    ports:
      - ${DB_PORT}:3306
    restart: unless-stopped
    environment:
      MARIADB_ROOT_PASSWORD_FILE: /run/secrets/db-root-password
      MARIADB_USER_FILE: /run/secrets/db-user
      MARIADB_PASSWORD_FILE: /run/secrets/db-password
      MARIADB_DATABASE_FILE: /run/secrets/db-name
    secrets:
      - db-root-password
      - db-user
      - db-password
      - db-name
    healthcheck:
      test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
      interval: 10s
      timeout: 10s
      retries: 5
      start_period: 10s

secrets:
  db-url:
    file: ./secrets/spring-datasource-url.txt
  db-user:
    file: ./secrets/spring-datasource-user.txt
  db-password:
    file: ./secrets/spring-datasource-password.txt
  db-root-password:
    file: ./secrets/db-root-password.txt
  db-name:
    file: ./secrets/db-name.txt

volumes:
  db-vol:
  image-vol:

networks:
  backend-net:
  frontend-net:

```

## How to run this web app in local

이 repo의 소스 코드를 다음과 같이 다운로드받습니다. 
```shell
git clone https://github.com/JeroCaller/local-docker-web-app-example.git
```

Docker Compose 실행을 위해 필요한 파일들을 설정합니다. 먼저 프로젝트 폴더 루트에 `.env` 파일을 만들고 다음과 같은 형식으로 각 설정값들을 자유롭게 지정합니다.

```.env
# .env example
DB_PORT=3306
BACKEND_PORT=8080
FRONTEND_PORT=80
```

그 후, 프로젝트 폴더 루트에 `/secrets` 폴더를 만든 후, 그 안에 각각의 텍스트 파일들을 만듭니다.

```txt
db-root-password.txt
db-name.txt  # database name

# application.properties의 
# - spring.datasource.password
# - spring.datasource.url
# - spring.datasource.username
# 속성값들을 각 텍스트 파일 내부에 저장.
spring-datasource-password.txt  
spring-datasource-url.txt
spring-datasource-user.txt
```

```
# 예) db-name.txt 파일 내부. 사용할 데이터베이스 이름을 정한다.
image-album-db
```

보안을 위해 `/secrets` 폴더 및 `.env` 파일이 git에 업로드되지 않도록 `.gitignore`에 추가되어 있는지 다시 한 번 확인합니다.

실행을 위해 Docker에서 다음과 같은 명령어를 사용합니다.
```shell
docker compose up -d

# 소스 코드 변경으로 인해 이미지 재빌드해야하는 경우 다음의 명령어를 사용
# docker compose up -d --build
```

모든 컨테이너들이 실행 중이라면 웹 브라우저에서 `http://localhost:<FRONTEND_PORT>`으로 방문하면 됩니다. 

실행 중인 Docker compose를 종료하려면 `docker compose down`을, 볼륨까지 삭제하려면 `docker compose down -v`를 입력합니다. 
