package com.example.chat.controller

import com.example.chat.service.SupabaseService
import org.springframework.http.ResponseEntity
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

data class ProfileImageStatus(val userId: String, val profileImageStatus: Boolean)

@RestController
class ProfileController(@Autowired private val supabaseService: SupabaseService) {
    @PutMapping("/profile_image_status")
    fun updateProfileImageStatus(@RequestBody profileImageStatus: ProfileImageStatus): ResponseEntity<String> {
        val result = supabaseService.updateProfileImageStatus(profileImageStatus.userId, profileImageStatus.profileImageStatus)
        return if (result) {
            ResponseEntity.ok("Profile image status updated successfully.")
        } else {
            ResponseEntity.badRequest().body("Failed to update profile image status.")
        }
    }
}
