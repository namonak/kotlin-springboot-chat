package com.example.chat.controller

import com.example.chat.service.SupabaseService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.PostMapping

data class SignupRequest(val userId: String, val nickname: String)

@RestController
private class SignupController(@Autowired private val supabaseService: SupabaseService) {
    private val logger = LoggerFactory.getLogger(ChatController::class.java)

    @PostMapping("/signup")
    fun signup(@RequestBody signupRequest: SignupRequest) {
        // Create user profile in Supabase
        logger.info("Creating user profile for user ${signupRequest.userId}, nickname ${signupRequest.nickname}")
        supabaseService.createUserProfile(signupRequest.userId, signupRequest.nickname)
    }
}
