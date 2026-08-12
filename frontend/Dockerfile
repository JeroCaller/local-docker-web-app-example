# === build stage ===
FROM node:22 AS builder
WORKDIR /app

# 소스 코드는 자주 변경되고, 의존성 파일은 잘 안 바뀌므로 
# build cache를 위해 이들을 분리하여 작업 진행. 
# 원래는 package-lock.json까지 복사하여 `npm ci` 명령을 대신 실행하면 
# 더 깔끔하고 재현 가능한 설치를 구현할 수 있다. 
# 다만 여기서는 해당 파일을 `.gitignore`에 추가하였기에 
# 처음 소스 코드를 받은 상태라면 로컬에서 먼저 `npm i`를 진행하여 `package-lock.json`
# 파일을 먼저 만들고 진행해야 하는데, 실수로 이 과정을 까먹을 수도 있어
# 여기서는 `npm install` 로 대신함.
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# === runtime stage ===
FROM nginx:alpine

# 앞서 build stage에서 build되어 나온 html, js 등의 정적 파일들을 
# nginx 웹 서버 내 특정 경로로 주입하여 웹 서버가 정적 파일 서빙이 가능하도록 한다. 
COPY --from=builder /app/build /usr/share/nginx/html