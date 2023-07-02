package com.example.chat.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.ResponseBody

@Controller
class ChatController {
    @PostMapping("/app/chat")
    @ResponseBody
    fun handleMessage(@RequestBody message: String): String {
        return "Echo: $message"
    }
}
