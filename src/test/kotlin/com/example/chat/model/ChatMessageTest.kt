package com.example.chat.model

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.time.LocalDateTime

class ChatMessageTest {

    @Test
    fun testChatMessage() {
        // Arrange
        val messageId = 1L
        val content = "Hello, how are you?"
        val sender = "John"
        val timestamp = LocalDateTime.now()

        // Act
        val chatMessage = ChatMessage(messageId, content, sender, timestamp)

        // Assert
        assertThat(messageId).isEqualTo(chatMessage.id)
        assertThat(content).isEqualTo(chatMessage.content)
        assertThat(sender).isEqualTo(chatMessage.sender)
        assertThat(timestamp).isEqualTo(chatMessage.timestamp)
    }
}
