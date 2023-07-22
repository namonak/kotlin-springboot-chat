package com.example.chat.model

import java.net.http.WebSocket
import java.time.LocalDateTime
import java.util.concurrent.CopyOnWriteArrayList

data class ChatRoom(
    val id: Long,
    val name: String,
    val password: String?
) {
    private val participants: CopyOnWriteArrayList<User> = CopyOnWriteArrayList()
    private val webSockets: CopyOnWriteArrayList<WebSocket> = CopyOnWriteArrayList()
    private val messageList: MutableList<ChatMessage> = mutableListOf()

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

    fun broadcastMessage(message: ChatMessage) {
        messageList.add(message)

        for (webSocket in webSockets) {
            webSocket.sendText(message.content, true)
        }
    }
}
