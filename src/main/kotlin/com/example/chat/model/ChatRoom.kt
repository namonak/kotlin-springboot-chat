package com.example.chat.model

data class ChatRoom(
    val id: Long,
    val name: String,
    val maxParticipants: Int,
    val password: String?
)
