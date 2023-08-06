package com.example.chat.controller

import com.example.chat.service.SupabaseService
import org.springframework.http.ResponseEntity
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

data class ProfileImage(val userId: String, val name: String)

@RestController
class ProfileController(@Autowired private val supabaseService: SupabaseService) {

    @PutMapping("/profile_image_name/update")
    fun updateProfileImageName(@RequestBody profileImage: ProfileImage): ResponseEntity<String> {
        val result = supabaseService.updateProfileImageName(profileImage.userId, profileImage.name)
        return if (result) {
            ResponseEntity.ok("Profile image status updated successfully.")
        } else {
            ResponseEntity.badRequest().body("Failed to update profile image status.")
        }
    }

    @DeleteMapping("/profile_image/delete")
    fun deleteProfileImage(@RequestBody profileImage: ProfileImage): ResponseEntity<String> {
        val result = supabaseService.deleteProfileImage(profileImage.name)
        return if (result) {
            ResponseEntity.ok("Profile image status deleted successfully.")
        } else {
            ResponseEntity.badRequest().body("Failed to delete profile image status.")
        }
    }
}
