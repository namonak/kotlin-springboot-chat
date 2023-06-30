# kotlin-springboot-chat

## 프로젝트 구조

* `com.example.chat`: 최상위 패키지
  * `ChatApplication`: Spring Boot 애플리케이션의 진입점인 메인 클래스
* `com.example.chat.model`: 모델 클래스들을 포함하는 패키지
  * `ChatMessage`: 채팅 메시지를 나타내는 클래스 (id, 내용, 작성자, 작성 시간 등의 속성 포함)
  * `ChatRoom`: 채팅방을 나타내는 클래스 (id, 이름, 참여자 수 등의 속성 포함)
  * `User`: 사용자를 나타내는 클래스 (id, 이름, 비밀번호 등의 속성 포함)
* `com.example.chat.controller`: 컨트롤러 클래스들을 포함하는 패키지
  * `ChatController`: 채팅 관련 API 엔드포인트를 처리하는 컨트롤러 클래스
* `com.example.chat.service`: 서비스 인터페이스와 구현 클래스를 포함하는 패키지
  * `ChatService`: 채팅과 관련된 비즈니스 로직을 처리하는 인터페이스
  * `ChatServiceImpl`: ChatService 인터페이스의 구현 클래스
* `com.example.chat.repository`: 데이터베이스와 상호작용하는 리포지토리 인터페이스와 구현 클래스를 포함하는 패키지
  * `ChatRoomRepository`: ChatRoom 엔티티와 상호작용하는 리포지토리 인터페이스
  * `UserRepository`: User 엔티티와 상호작용하는 리포지토리 인터페이스
* `com.example.chat.exception`: 예외 처리 관련 패키지
  * `ChatException`: 채팅 애플리케이션에서 발생하는 예외 클래스