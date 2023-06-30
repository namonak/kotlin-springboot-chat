package com.example.chat.model

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test

class ChatRoomTest {

    @Test
    fun `test creating ChatRoom object`() {
        val chatRoom = ChatRoom(1, "General", 100, null)

        assertThat(1).isEqualTo(chatRoom.id)
        assertThat("General").isEqualTo(chatRoom.name)
        assertThat(100).isEqualTo(chatRoom.maxParticipants)
        assertNull(chatRoom.password)
    }
}
