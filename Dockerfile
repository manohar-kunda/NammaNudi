# Multi-stage Dockerfile for NammaNudi Spring Boot Backend (Java 21)
# Stage 1: Build JAR using Maven with Eclipse Temurin JDK 21
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy root data directory (contains scenarios.json, phrases.json, roleplay.json, quiz.json)
COPY data/ ./data/

# Copy backend pom.xml and source code
COPY backend/pom.xml ./backend/
COPY backend/src ./backend/src

# Package JAR (data is embedded via pom.xml resource config)
WORKDIR /app/backend
RUN mvn clean package -DskipTests

# Stage 2: Minimal runtime image with Temurin JRE 21
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=build /app/backend/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Render assigns port 10000 by default, fallback to 8081 if not provided
ENV SERVER_PORT=10000
EXPOSE 10000

# Start Spring Boot application, reading SERVER_PORT and APP_CORS_ALLOWED_ORIGINS
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
