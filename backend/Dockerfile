# === build stage ===
FROM eclipse-temurin:21-jdk as builder

# image 내 working directory를 '/app'으로 설정. 
WORKDIR /app

# 프로젝트 내 현재 디렉토리를 image의 workdir인 `.` 현재 디렉토리에 복사. 
COPY . .

# gradle을 이용하여 앱 빌드
RUN chmod +x gradlew
RUN ./gradlew clean build -x test

# === Runtime stage ===
# 런타임 환경에서는 빌드가 필요없기에 런타임 환경인 jre만 사용.
FROM eclipse-temurin:21-jre

WORKDIR /app

# 이전 스테이지인 builder 스테이지에서 빌드된 결과물을 복사.
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

# 빌드된 앱 실행
ENTRYPOINT ["java", "-jar", "app.jar"]