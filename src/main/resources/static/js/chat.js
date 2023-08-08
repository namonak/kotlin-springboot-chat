let user

window.onload = async function() {
    user = supabase.auth.user();
    if (user) {
        // 사용자가 로그인한 경우
        console.log('User is signed in! User ID:', user.id);
        const { data, error } = await supabase
            .from('user_profiles')
            .select('nickname')
            .eq('user_id', user.id)
            .single();

        if (error) {
            console.error('Error fetching user profile:', error);
        } else {
            console.log('User nickname:', data.nickname);
            user.nickname = data.nickname;  // 사용자 객체에 닉네임 추가
        }

        // Display user's email
        document.getElementById('user-email').textContent = 'User: ' + user.email;
    } else {
        // 사용자가 로그아웃한 경우
        console.log('User is not signed in!');
        window.location.href = "/login.html";
    }
};

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messageContainer = document.getElementById('message-container');
const logoutButton = document.getElementById('logout-button');
const profileButton = document.getElementById('profile-button');

let stompClient;  // 전역 범위로 선언

// 메시지 전송 함수
const sendMessage = () => {
    const message = messageInput.value;
    if (message && stompClient) {  // stompClient가 초기화된 상태인지 체크
        // 서버로 메시지 전송
        const messageObject = {
            id: user.id, // id 필드 추가
            content: message,
            sender: user.nickname,  // 'DummySender' 대신 사용자의 닉네임 사용
            timestamp: new Date().toISOString() // timestamp 필드 추가
        };
        stompClient.send('/app/chat', {}, JSON.stringify(messageObject));
        messageInput.value = '';
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            messageInput.blur();  // 메시지를 보낸 후에는 입력 필드에 포커스를 주지 않습니다.
        }
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

        stompClient.subscribe('/topic/messages', async (message) => {
            console.log('Message received: ', message);
            const receivedMessage = JSON.parse(message.body);

            // 프로필 이미지 가져오기
            const profileImageUrl = await getProfileImage(receivedMessage.id);

            const messageElement = document.createElement('div');
            messageElement.classList.add('message');

            // 프로필 이미지 추가
            if (profileImageUrl) {
                const profileImageElement = document.createElement('img');
                profileImageElement.src = profileImageUrl;
                profileImageElement.classList.add('profile-image');
                messageElement.appendChild(profileImageElement);
            }

            const textElement = document.createElement('span');
            textElement.textContent = receivedMessage.sender + ': ' + receivedMessage.content;
            messageElement.appendChild(textElement);

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
    if (event.key === "Enter" && event.shiftKey === false) {
        // 기본 동작(여기서는 줄바꿈)을 취소
        event.preventDefault();

        // 메시지 전송 함수 호출
        sendMessage();
    }
});

const disconnectWebSocket = () => {
    if (stompClient) {
        stompClient.disconnect(() => {
            console.log('Disconnected from WebSocket');
        });
    }
};

logoutButton.addEventListener('click', async () => {
    disconnectWebSocket();
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error);
    else window.location.href = "/login.html";
});

profileButton.addEventListener('click', () => {
    disconnectWebSocket();
    window.location.href = "/profile.html";
});

const getProfileImage = async (userId) => {
    const { data: userProfile, error: userProfileError } = await supabase
        .from('user_profiles')
        .select('profile_image_name')
        .eq('user_id', userId)
        .single();

    if (userProfileError) {
        console.error('Error fetching user profile:', userProfileError);
        return null;
    }

    let base64Image = localStorage.getItem(`${userId}_profile_image`);
    if (!base64Image) {
        console.log('No cached profile image found, fetching from server')
        const { data, error } = await supabase.storage.from('profile_image').download(userProfile.profile_image_name);
        if (error) {
            console.error('Error downloading image:', error);
        } else {
            base64Image = await data.text(); // Assuming the data is in Base64 format
            localStorage.setItem(`${userId}_profile_image`, base64Image);
        }
    }
    return base64Image; // Returning the Base64 image string
};
