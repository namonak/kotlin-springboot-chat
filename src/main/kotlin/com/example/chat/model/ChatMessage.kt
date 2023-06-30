package com.example.chat.model

import java.time.LocalDateTime

data class ChatMessage(
    val id: Long,
    val content: String,
    val sender: String,
    val timestamp: LocalDateTime
)
