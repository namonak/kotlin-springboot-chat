package com.example.chat.controller

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext

@WebMvcTest(ChatController::class)
class ChatControllerTest {
    @Autowired
    private lateinit var context: WebApplicationContext

    private val mockMvc: MockMvc by lazy {
        MockMvcBuilders.webAppContextSetup(context).build()
    }

    @Test
    fun testHandleMessage() {
        val message = "Hello, World!"

        mockMvc.perform(
            post("/app/chat")
                .content(message)
        )
            .andExpect(status().isOk)
            .andExpect(content().string("Echo: $message"))
    }
}
