package com.example.chat.controller

import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.stereotype.Controller

@Controller
class ChatController {
    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    fun handleMessage(message: String): String {
        println("Received message: $message")
        return message
    }
}
