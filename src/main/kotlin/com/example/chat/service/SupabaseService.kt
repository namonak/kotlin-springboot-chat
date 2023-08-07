package com.example.chat.service

import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.storage.Storage
import io.github.jan.supabase.storage.storage
import org.slf4j.LoggerFactory
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.ExchangeFilterFunction
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono
import kotlin.time.Duration.Companion.seconds

private const val SUPABASE_BUCKET_NAME = "profile_image"

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
        .filter(ExchangeFilterFunction.ofRequestProcessor { clientRequest ->
            logger.info("Request: {} {}", clientRequest.method(), clientRequest.url())
            logger.info("Headers: {}", clientRequest.headers())
            Mono.just(clientRequest)
        })
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

    suspend fun deleteProfileImage(name: String): Boolean {
        val client = createSupabaseClient(
            supabaseUrl,
            serviceRoleKey
        ) {
            install(Storage) {
                transferTimeout = 90.seconds
            }
        }

        logger.info("Deleting profile image $name")

        return try {
            val bucket = client.storage[SUPABASE_BUCKET_NAME]
            bucket.delete(name)
            true
        } catch (e: Exception) {
            logger.error("Error: ${e.message}")
            false
        }
    }
}
