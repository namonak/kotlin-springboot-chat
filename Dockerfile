FROM openjdk:17-jdk
COPY build/libs/kotlin-springboot-chat-0.0.1-SNAPSHOT.jar /app/kotlin-springboot-chat-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java", "-jar", "/app/kotlin-springboot-chat-0.0.1-SNAPSHOT.jar"]