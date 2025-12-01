# 1. 빌드 환경 (Maven + JDK 17)
FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /app

# 종속성 캐시 최적화
COPY pom.xml .
RUN mvn dependency:go-offline

# 소스 복사 후 빌드
COPY src ./src
RUN mvn package -DskipTests

# 2. 실행 환경 (JRE 17 경량)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
EXPOSE 8080

# 빌드된 JAR 파일 복사
COPY --from=builder /app/target/*.jar app.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
