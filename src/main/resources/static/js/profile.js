window.onload = async function() {
  const user = supabase.auth.user();
  if (user) {
    // 사용자가 로그인한 경우, 사용자 프로필 이미지를 불러옵니다.
    console.log('User is signed in!');
    const filePath = `${user.id}_profile_image`;
    const { data, error } = await supabase.storage.from('profile_image').download(filePath);

    if (error) {
      console.error('Error downloading image:', error);
    } else {
      const url = URL.createObjectURL(data);
      document.getElementById('preview-image').src = url;
      document.getElementById('preview-image').style.display = 'block';
    }
  } else {
    // 사용자가 로그아웃한 경우, 로그인 페이지로 리다이렉트합니다.
    window.location.href = "/login.html";
  }
};

document.getElementById('profile-image').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(file.type)) {
      alert('이미지 파일을 업로드해주세요. (jpeg, png, gif)');
      e.target.value = ''; // 파일 입력 필드 초기화
      document.getElementById('preview-image').style.display = 'none'; // 이미지 미리보기 영역 초기화
      return;
    }
    if (file.size > 3 * 1024 * 1024) { // 3MB
      alert('이미지 파일의 크기가 너무 큽니다. (최대 3MB)');
      e.target.value = ''; // 파일 입력 필드 초기화
      document.getElementById('preview-image').style.display = 'none'; // 이미지 미리보기 영역 초기화
      return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('preview-image').src = e.target.result;
      document.getElementById('preview-image').style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById('profile-form').addEventListener('submit', async (e) => {
  e.preventDefault()

  const fileInput = document.getElementById('profile-image');
  const file = fileInput.files[0];

  if (file) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(file.type)) {
      alert('이미지 파일을 업로드해주세요. (jpeg, png, gif)');
      return;
    }

    // 사용자 ID와 "_profile_image"를 결합하여 파일 경로 생성
    const user = supabase.auth.user();
    const filePath = `${user.id}_profile_image`;
    console.log('filePath:', filePath);
    const { error } = await supabase.storage.from('profile_image').upload(filePath, file, { upsert: true });

    if (error) {
      console.error('Error uploading image:', error);
      alert('프로필 이미지 업로드에 실패하였습니다: ' + error.message)
    } else {
      console.log('Image uploaded successfully');
      alert('프로필 이미지 업로드가 성공적으로 완료되었습니다.')
      window.location.href = '/chat.html'
    }
  }
});

document.getElementById('back-button').addEventListener('click', function(e) {
  e.preventDefault();
  window.location.href = "/chat.html";
});
