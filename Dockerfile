# Dockerfile: 최종 이미지를 만들기 위한 설정 파일
# ----------------------------------------------------

# 1. 빌드 환경 설정: Java 17을 사용합니다.
FROM openjdk:17-jdk-slim as builder

# 작업 디렉토리를 /app으로 설정
WORKDIR /app

# Maven 빌드
# pom.xml을 복사하여 종속성 다운로드 (빌드 속도 향상)
COPY pom.xml .
RUN mkdir -p /root/.m2/repository
RUN --mount=type=cache,target=/root/.m2/repository \
    mvn dependency:go-offline

# 소스 코드를 복사하고 실제 빌드를 수행
COPY src /app/src
RUN --mount=type=cache,target=/root/.m2/repository \
    mvn package -DskipTests

# 2. 실행 환경 설정: 더 가벼운 JRE 환경 사용
FROM openjdk:17-jre-slim

# JAR 파일이 실행될 경로 설정
WORKDIR /app

# 컨테이너 포트 8080 노출
EXPOSE 8080

# 빌드 환경에서 생성된 JAR 파일을 복사
# cloudnative-0.0.1-SNAPSHOT.jar는 Spring Boot 빌드 시 생성되는 기본 이름입니다.
COPY --from=builder /app/target/*.jar app.jar

# 애플리케이션 실행 명령어
ENTRYPOINT ["java", "-jar", "app.jar"]