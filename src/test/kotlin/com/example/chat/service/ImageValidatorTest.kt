package com.example.chat.service

import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock
import org.mockito.Mockito.`when`
import org.springframework.web.multipart.MultipartFile
import java.io.ByteArrayInputStream
import java.io.IOException

class ImageValidatorTest {

    private val imageValidator = ImageValidator()

    @Test
    fun `isValidImage should return true for valid image`() {
        val file = mock(MultipartFile::class.java)
        val imageBytes = javaClass.getResourceAsStream("/valid_image.jpg")?.readBytes()
        `when`(file.inputStream).thenReturn(ByteArrayInputStream(imageBytes))

        val result = imageValidator.isValidImage(file)

        assertTrue(result)
    }

    @Test
    fun `isValidImage should return false for invalid image`() {
        val file = mock(MultipartFile::class.java)
        val invalidBytes = "invalid_image".toByteArray()
        `when`(file.inputStream).thenReturn(ByteArrayInputStream(invalidBytes))

        val result = imageValidator.isValidImage(file)

        assertFalse(result)
    }

    @Test
    fun `isValidImage should return false when IOException occurs`() {
        val file = mock(MultipartFile::class.java)
        `when`(file.inputStream).thenThrow(IOException::class.java)

        val result = imageValidator.isValidImage(file)

        assertFalse(result)
    }
}
