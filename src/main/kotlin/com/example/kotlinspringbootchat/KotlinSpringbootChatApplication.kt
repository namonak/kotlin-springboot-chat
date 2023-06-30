package com.example.kotlinspringbootchat

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class KotlinSpringbootChatApplication

fun main(args: Array<String>) {
    runApplication<KotlinSpringbootChatApplication>(*args)
}
