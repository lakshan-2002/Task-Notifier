# Stage 1: Build the application
FROM maven:3.8.6-temurin-17-jdk AS builder
WORKDIR /app
COPY . .
RUN mvn clean install -Dmaven.test.skip

# Stage 2: Create the final image
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=builder /app/target/TaskNotifier-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
