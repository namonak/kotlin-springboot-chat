const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messageContainer = document.getElementById('message-container');

// SockJS 연결 설정
const socket = new SockJS('http://localhost:8080/chat-websocket');

// Stomp 클라이언트 생성
const stompClient = Stomp.over(socket);

// 연결 성공 시 호출되는 콜백 함수
const onConnected = () => {
    console.log('Connected to WebSocket');

    stompClient.subscribe('/topic/messages', (message) => {
        //console.log('Received: ', receivedMessage);
        const receivedMessage = JSON.parse(message.body);
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.textContent = receivedMessage.sender + ': ' + receivedMessage.content;
        messageContainer.appendChild(messageElement);
    });
};

// 에러 발생 시 호출되는 콜백 함수
const onError = (error) => {
    console.error('Error: ', error);
};

// SockJS 연결 시도 및 Stomp 클라이언트 연결
stompClient.connect({}, onConnected, onError);

// Send 버튼 클릭 이벤트 처리
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message) {
        // 서버로 메시지 전송
        stompClient.send('/app/chat', {}, message);
        messageInput.value = '';
    }
});
