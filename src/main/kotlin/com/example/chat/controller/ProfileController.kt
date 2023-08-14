package com.example.chat.controller

import com.example.chat.service.ImageValidator
import com.example.chat.service.SupabaseService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile


data class ProfileImage(val userId: String, val name: String)

@RestController
class ProfileController(@Autowired private val supabaseService: SupabaseService, @Autowired private val imageValidator: ImageValidator) {

    @PutMapping("/profile_image_name/update")
    fun updateProfileImageName(@RequestBody profileImage: ProfileImage): ResponseEntity<String> {
        val result = supabaseService.updateProfileImageName(profileImage.userId, profileImage.name)
        return if (result) {
            ResponseEntity.ok("Profile image name updated successfully.")
        } else {
            ResponseEntity.badRequest().body("Failed to update profile image name.")
        }
    }

    @DeleteMapping("/profile_image/delete")
    suspend fun deleteProfileImage(@RequestBody profileImage: ProfileImage): ResponseEntity<String> {
        if (profileImage.name == "default_profile_image.jpg") return ResponseEntity.ok().body("Cannot delete default profile image.")

        val result = supabaseService.deleteProfileImage(profileImage.name)
        return if (result) {
            ResponseEntity.ok("Profile image deleted successfully.")
        } else {
            ResponseEntity.badRequest().body("Failed to delete profile image.")
        }
    }

    @PostMapping("/profile_image/upload")
    suspend fun uploadProfileImage(@RequestParam("filePath") filePath: String, @RequestParam("file") file: MultipartFile): ResponseEntity<String> {
        if (!imageValidator.isValidImage(file)) {
            return ResponseEntity.badRequest().body("Invalid image file.")
        }

        val result: Boolean = supabaseService.uploadProfileImage(filePath, file.bytes)
        return if (result) {
            ResponseEntity.ok("Profile image uploaded successfully.")
        } else {
            ResponseEntity.badRequest().body("Failed to upload profile image.")
        }
    }
}
