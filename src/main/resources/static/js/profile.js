window.onload = async function() {
  const user = supabase.auth.user();
  if (user) {
    // 사용자가 로그인한 경우, 사용자 프로필 이미지를 불러옵니다.
    console.log('User is signed in!');

    // public.user_profiles 데이터베이스에서 profile_image 필드 확인
    const { data: userProfile, error: userProfileError } = await supabase
        .from('user_profiles')
        .select('profile_image')
        .eq('user_id', user.id)
        .single();

    if (userProfileError) {
      console.error('Error fetching user profile:', userProfileError);
      return;
    }
    console.log('userProfile.profile_image:', userProfile.profile_image);
    const filePath = userProfile.profile_image ? `${user.id}_profile_image` : 'default_profile_image.jpg';
    const { data, error } = await supabase.storage.from('profile_image').download(filePath);

    if (error) {
      console.error('Error downloading image:', error);
    } else {
      document.getElementById('preview-image').src = URL.createObjectURL(data);
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

async function updateProfileImageStatus(userId, profileImageStatus) {
  return await fetch('/profile_image_status', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId: userId, profileImageStatus: profileImageStatus} )
  });
}

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

      // 이미지 업로드 성공 후, 새로운 이미지 URL을 로컬 스토리지에 저장
      const { data, error } = await supabase.storage.from('profile_image').download(filePath);
      if (error) {
        console.error('Error downloading image:', error);
      } else {
        localStorage.setItem(`${user.id}_profile_image_url`, URL.createObjectURL(data));
      }

      const response = await updateProfileImageStatus(user.id, true);
      if (!response.ok) {
        console.error('Error: ', response.statusText)
        alert('프로필 이미지 상태 저장에 실패하였습니다: ' + response.statusText)
      } else {
        // 프로필 이미지 상태 저장 성공, 채팅 페이지로 이동
        alert('프로필 이미지 상태 저장이 성공적으로 완료되었습니다.')
        window.location.href = '/chat.html'
      }
    }
  }
});

document.getElementById('back-button').addEventListener('click', function(e) {
  e.preventDefault();
  window.location.href = "/chat.html";
});

document.getElementById('reset-profile-image').addEventListener('click', async function(e) {
  e.preventDefault();

  const user = supabase.auth.user();
  const filePath = `${user.id}_profile_image`;

  // 서버에서 프로필 이미지 삭제
  const { error: deleteError } = await supabase.storage.from('profile_image').remove([filePath]);
  if (deleteError) {
    console.error('Error deleting image:', deleteError);
    alert('프로필 이미지 삭제에 실패하였습니다: ' + deleteError.message);
    return;
  }

  // 로컬 스토리지에서 프로필 이미지 URL 삭제
  localStorage.removeItem(`${user.id}_profile_image_url`);

  // public.user_profiles 데이터베이스의 profile_image 필드를 false로 업데이트
  const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ profile_image: false })
      .eq('user_id', user.id);

  if (updateError) {
    console.error('Error updating profile_image:', updateError);
  }

  // 기본 프로필 이미지로 세팅
  const { data, error } = await supabase.storage.from('profile_image').download('default_profile_image.jpg');
  if (error) {
    console.error('Error downloading default profile image:', error);
    alert('기본 프로필 이미지 로딩에 실패하였습니다: ' + error.message);
    return;
  }
  document.getElementById('preview-image').src = URL.createObjectURL(data);
  document.getElementById('preview-image').style.display = 'block';
});
