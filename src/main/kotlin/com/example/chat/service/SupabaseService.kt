package com.example.chat.service

import org.slf4j.LoggerFactory
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient

@Service
class SupabaseService {
    private val supabaseUrl: String = System.getenv("SUPABASE_URL") ?: "default_url"
    private val serviceRoleKey: String = System.getenv("SUPABASE_SERVICE_ROLE_KEY") ?: "default_key"
    private val logger = LoggerFactory.getLogger(SupabaseService::class.java)

    private val webClient = WebClient.builder()
        .baseUrl(supabaseUrl)
        .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer $serviceRoleKey")
        .defaultHeader("apikey", serviceRoleKey)
        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .build()

    fun createUserProfile(userId: String, nickname: String) {
        val userProfile = mapOf("user_id" to userId, "nickname" to nickname)
        val response = webClient.post()
            .uri("/rest/v1/user_profiles")
            .bodyValue(userProfile)
            .retrieve()
            .bodyToMono(String::class.java)

        response.subscribe(
            { result -> logger.info("Result: $result") },
            { error -> logger.error("Error: $error") }
        )
    }

    fun updateProfileImageName(id: String, name: String): Boolean {
        val userProfile = mapOf("profile_image_name" to name)
        val response = webClient.patch()
            .uri("/rest/v1/user_profiles?user_id=eq.$id")
            .bodyValue(userProfile)
            .retrieve()
            .bodyToMono(String::class.java)

        return try {
            response.block()
            true
        } catch (e: Exception) {
            logger.error("Error: ${e.message}")
            false
        }
    }

    fun deleteProfileImage(name: String): Boolean {
        val response = webClient.delete()
            .uri("/storage/v1/object/profile_images/$name") // 경로 수정
            .header(HttpHeaders.AUTHORIZATION, "Bearer $serviceRoleKey")
            .retrieve()
            .bodyToMono(String::class.java)

        return try {
            response.block()
            true
        } catch (e: Exception) {
            logger.error("Error: ${e.message}")
            false
        }
    }
}
