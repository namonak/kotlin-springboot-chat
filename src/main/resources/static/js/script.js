const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messageContainer = document.getElementById('message-container');

// WebSocket 연결 설정
const socket = new WebSocket('ws://localhost:8080/chat-websocket');

// Send 버튼 클릭 이벤트 처리
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message) {
        // 서버로 메시지 전송
        socket.send(message);
        messageInput.value = '';
    }
});

// WebSocket 메시지 수신 이벤트 처리
socket.addEventListener('message', (event) => {
    const message = event.data;

    // 채팅 메시지를 우측에 표시
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add('own-message'); // 사용자가 보낸 메시지임을 표시하기 위해 클래스 추가
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);
});
