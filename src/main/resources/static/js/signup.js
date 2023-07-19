document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = e.target.elements.email.value
    const password = e.target.elements.password.value
    const { user, session, error } = await supabase.auth.signUp({
        email,
        password
    })
    if (error) {
        console.error('Error: ', error.message)
    } else {
        // 회원가입 성공, 로그인 페이지로 이동
        alert('Signup successful, please check your email for verification link.')
        window.location.href = '/login.html'
    }
})
