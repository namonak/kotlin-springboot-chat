package com.example.chat.service

import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.IOException
import javax.imageio.ImageIO

@Service
class ImageValidator {
    fun isValidImage(file: MultipartFile): Boolean {
        return try {
            val image = ImageIO.read(file.inputStream)
            image != null
        } catch (e: IOException) {
            false
        }
    }
}
