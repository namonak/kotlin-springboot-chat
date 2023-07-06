package com.example.chat.model

import java.net.http.WebSocket
import java.util.concurrent.CopyOnWriteArrayList

data class ChatRoom(
    val id: Long,
    val name: String,
    val maxParticipants: Int,
    val password: String?
) {
    private val participants: CopyOnWriteArrayList<User> = CopyOnWriteArrayList()
    private val webSockets: CopyOnWriteArrayList<WebSocket> = CopyOnWriteArrayList()

    fun addParticipant(user: User) {
        participants.add(user)
    }

    fun removeParticipant(user: User) {
        participants.remove(user)
    }

    fun addWebSocket(webSocket: WebSocket) {
        webSockets.add(webSocket)
    }

    fun removeWebSocket(webSocket: WebSocket) {
        webSockets.remove(webSocket)
    }

    fun receiveMessage(message: ChatMessage) {
        // 채팅 메시지를 ChatRoom에 추가
        // ...

        // 웹소켓 리스트를 순회하며 각 소켓에 메시지를 브로드캐스팅
        for (webSocket in webSockets) {
            webSocket.sendText(message.content, true)
        }
    }
}
