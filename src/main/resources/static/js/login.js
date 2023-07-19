document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = e.target.elements.email.value
    const password = e.target.elements.password.value
    const { user, session, error } = await supabase.auth.signIn({
        email,
        password
    })
    if (error) {
        console.error('Error: ', error.message)
    } else {
        // 로그인 성공, 채팅 페이지로 이동
        window.location.href = '/chat.html'
    }
})

document.getElementById('signup-button').addEventListener('click', () => {
    // 회원가입 페이지로 이동
    window.location.href = '/signup.html'
})
