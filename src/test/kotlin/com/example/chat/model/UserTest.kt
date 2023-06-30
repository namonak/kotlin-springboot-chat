package com.example.chat.model

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class UserTest {

    @Test
    fun `test creating User object`() {
        val user = User(1, "john", "password123")

        assertThat(1).isEqualTo(user.id)
        assertThat("john").isEqualTo(user.username)
        assertThat("password123").isEqualTo(user.password)
    }
}
