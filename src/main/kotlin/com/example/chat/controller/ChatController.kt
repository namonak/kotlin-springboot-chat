package com.example.chat.controller

import com.example.chat.model.ChatMessage
import com.example.chat.model.ChatRoom
import com.example.chat.model.User
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ResponseBody
import java.time.LocalDateTime

@Controller
class ChatController {
    private val chatRoom = ChatRoom(1, "General", null)

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    fun handleMessage(message: String): ChatMessage {
        val sender = User(1L, "John", "password") // Replace with actual sender information
        val chatMessage = ChatMessage(1L, message, sender.username, LocalDateTime.now())

        chatRoom.broadcastMessage(chatMessage)

        return chatMessage
    }

    @GetMapping("/api/host-endpoint")
    @ResponseBody
    fun getHostEndpoint(): Map<String, String> {
        val hostEndpoint = System.getenv("HOST_ENDPOINT")
        return mapOf("hostEndpoint" to hostEndpoint)
    }
}
