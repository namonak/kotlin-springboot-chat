const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messageContainer = document.getElementById('message-container');

let stompClient;  // 전역 범위로 선언

// 메시지 전송 함수
const sendMessage = () => {
    const message = messageInput.value;
    if (message && stompClient) {  // stompClient가 초기화된 상태인지 체크
        // 서버로 메시지 전송
        const messageObject = {
            id: 1, // id 필드 추가
            content: message,
            sender: "DummySender",
            timestamp: new Date().toISOString() // timestamp 필드 추가
        };
        stompClient.send('/app/chat', {}, JSON.stringify(messageObject));
        messageInput.value = '';
    }
};

// 환경 변수를 가져오는 API 호출
fetch('/api/host-endpoint', {
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    }
})
.then(response => response.json())
.then(data => {
    const hostEndpointValue = data.hostEndpoint;

    console.log('hostEndpointValue: ', hostEndpointValue);

    // SockJS 연결 설정
    const socket = new SockJS(`${hostEndpointValue}/chat-websocket`);

    // Stomp 클라이언트 생성
    stompClient = Stomp.over(socket);  // 초기화

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
});

// Send 버튼 클릭 이벤트 처리
sendButton.addEventListener('click', sendMessage);

// 메시지 입력 필드에 keypress 이벤트 리스너 추가
messageInput.addEventListener('keypress', (event) => {
    // 엔터 키가 눌렸는지 확인 (event.keyCode === 13)
    // 이때, shift 키가 눌려진 상태가 아닌지도 확인 (event.shiftKey === false)
    // shift 키가 눌려진 상태에서 엔터 키를 누르면 줄바꿈을 해야 하므로 메시지를 전송하지 않습니다
    if (event.keyCode === 13 && event.shiftKey === false) {
        // 기본 동작(여기서는 줄바꿈)을 취소
        event.preventDefault();

        // 메시지 전송 함수 호출
        sendMessage();
    }
});
