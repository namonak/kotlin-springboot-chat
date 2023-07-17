package com.example.chat.controller

import com.example.chat.model.ChatMessage
import com.example.chat.model.ChatRoom
import com.example.chat.model.User
import org.slf4j.LoggerFactory
import org.springframework.context.event.EventListener
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.messaging.simp.SimpMessageHeaderAccessor
import org.springframework.messaging.simp.stomp.StompHeaderAccessor
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.socket.messaging.SessionConnectEvent
import org.springframework.web.socket.messaging.SessionDisconnectEvent
import java.time.LocalDateTime
import java.util.concurrent.ConcurrentHashMap


@Controller
class ChatController {
    private val chatRoom = ChatRoom(1, "General", null)
    private val users: MutableMap<String, User> = ConcurrentHashMap()
    private val logger = LoggerFactory.getLogger(ChatController::class.java)

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    fun handleMessage(message: ChatMessage, headerAccessor: SimpMessageHeaderAccessor): ChatMessage {
        logger.info("Received message: $message")
        val sessionId = headerAccessor.sessionId
        val sender = users[headerAccessor.sessionId] // Get the user associated with the current session
        if (sender != null) {
            val chatMessage = ChatMessage(1L, message.content, sender.username, LocalDateTime.now())
            chatRoom.broadcastMessage(chatMessage)
            return chatMessage
        }
        throw RuntimeException("User not found for session id: $sessionId")
    }

    @GetMapping("/api/host-endpoint")
    @ResponseBody
    fun getHostEndpoint(): Map<String, String> {
        val hostEndpoint = System.getenv("HOST_ENDPOINT")
        return mapOf("hostEndpoint" to hostEndpoint)
    }

    @EventListener
    fun handleSessionConnected(event: SessionConnectEvent) {
        val accessor = StompHeaderAccessor.wrap(event.message)
        val sessionId = accessor.sessionId
        val user = User(1L, sessionId!!, "password") // Create a new user

        users[sessionId] = user // Associate the user with the session

        chatRoom.addParticipant(user) // Add the user to the chat room

        logger.info("User ${user.username} connected")
    }

    @EventListener
    fun handleSessionDisconnect(event: SessionDisconnectEvent) {
        val accessor = StompHeaderAccessor.wrap(event.message)
        val sessionId = accessor.sessionId
        val user = users[sessionId] // Get the user associated with the session

        if (user != null) {
            chatRoom.removeParticipant(user) // Remove the user from the chat room
            users.remove(sessionId) // Remove the user
            logger.info("User ${user.username} disconnected")
        }
    }
}
