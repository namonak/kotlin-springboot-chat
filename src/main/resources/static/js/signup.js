document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = e.target.elements.email.value
    const password = e.target.elements.password.value
    const nickname = e.target.elements.nickname.value
    const { user, session, error } = await supabase.auth.signUp({
        email,
        password
    })
    if (error) {
        console.error('Error: ', error.message)
        alert('회원가입에 실패하였습니다: ' + error.message)
    } else {
        console.log('user.id: ', user.id + ', nickname: ', nickname)

        // 회원가입 성공, 서버에 닉네임 저장 요청
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: user.id, nickname: nickname })
        })
        if (!response.ok) {
            console.error('Error: ', response.statusText)
            alert('닉네임 저장에 실패하였습니다: ' + response.statusText)
        } else {
            // 닉네임 저장 성공, 로그인 페이지로 이동
            alert('회원가입이 성공적으로 완료되었습니다.')
            window.location.href = '/login.html'
        }
    }
})
