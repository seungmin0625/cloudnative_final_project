# 1. 빌드 환경 설정 (JDK 17)
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Maven 빌드
COPY pom.xml .
RUN mkdir -p /root/.m2/repository
RUN --mount=type=cache,target=/root/.m2/repository \
    mvn dependency:go-offline

COPY src /app/src
RUN --mount=type=cache,target=/root/.m2/repository \
    mvn package -DskipTests

# 2. 실행 환경 (JRE 17, 경량)
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app
EXPOSE 8080

COPY --from=builder /app/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
