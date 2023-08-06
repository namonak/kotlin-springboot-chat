window.onload = async function() {
  const user = supabase.auth.user();
  if (user) {
    console.log('User is signed in!');

    const userProfile = await getUserProfile(user.id);

    let base64Image = localStorage.getItem(`${user.id}_profile_image`);
    if (!base64Image) {
      console.log('No cached profile image found, fetching from server')
      const { data, error } = await supabase.storage.from('profile_image').download(userProfile.profile_image_name);
      if (error) {
        console.error('Error downloading image:', error);
      } else {
        loadAndDisplayImage(user.id, data);
      }
    } else {
      console.log('Cached profile image found, using that instead')
      document.getElementById('preview-image').src = base64Image;
      document.getElementById('preview-image').style.display = 'block';
    }
  } else {
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
    if (file.size > 1024 * 1024) { // 1MB
      alert('이미지 파일의 크기가 너무 큽니다. (최대 1MB)');
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

    const user = supabase.auth.user();
    const timestamp = Date.now();
    const filePath = `ts_${timestamp}`;
    const { error } = await supabase.storage.from('profile_image').upload(filePath, file, { upsert: true });

    if (error) {
      console.error('Error uploading image:', error);
      alert('프로필 이미지 업로드에 실패하였습니다: ' + error.message)
    } else {
      console.log('Image uploaded successfully');

      const updateSuccess = await updateProfileImageName(user.id, filePath);
      if (updateSuccess) {
        loadAndDisplayImage(user.id, file);
        alert('프로필 이미지 변경이 성공적으로 완료되었습니다.')
        window.location.href = '/chat.html'
      } else {
        console.error('Error: ', response.statusText)
        alert('프로필 이미지 변경에 실패하였습니다: ' + response.statusText)
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
  if (user) {
    const userProfile = await getUserProfile(user.id);

    // 서버에서 프로필 이미지 삭제
    const deleteSuccess = await deleteProfileImage(user.id, userProfile.profile_image_name)
    if (!deleteSuccess) {
      console.error('Error deleting image');
      alert('프로필 이미지 삭제에 실패하였습니다.');
      return;
    }

    // 로컬 스토리지에서 프로필 이미지 URL 삭제
    localStorage.removeItem(`${user.id}_profile_image`);

    // 기본 프로필 이미지로 세팅
    const { data, error } = await supabase.storage.from('profile_image').download('default_profile_image.jpg');
    if (error) {
      console.error('Error downloading default profile image:', error);
      alert('기본 프로필 이미지 로딩에 실패하였습니다: ' + error.message);
      return;
    }

    loadAndDisplayImage(user.id, data);

    const updateSuccess = await updateProfileImageName(user.id, 'default_profile_image.jpg');
    if (updateSuccess) {
      console.log('Profile image reset successfully');
      //window.location.href = '/chat.html'
    } else {
      console.error('Error: ', response.statusText)
      alert('프로필 이미지 초기화에 실패하였습니다: ' + response.statusText)
    }
  }
});

function loadAndDisplayImage(userId, data) {
  const reader = new FileReader();
  reader.onloadend = function() {
    if (typeof reader.result === 'string') {
      localStorage.setItem(`${userId}_profile_image`, reader.result);
      document.getElementById('preview-image').src = reader.result;
      document.getElementById('preview-image').style.display = 'block';
    } else {
      console.error('Error: reader.result is not a string');
    }
  };
  reader.readAsDataURL(data);
}

async function getUserProfile(userId) {
  const { data: userProfile, error: userProfileError } = await supabase
    .from('user_profiles')
    .select('profile_image_name')
    .eq('user_id', userId)
    .single();

  if (userProfileError) {
    console.error('Error fetching user profile:', userProfileError);
    return null;
  }
  console.log('userProfile.profile_image_name:', userProfile.profile_image_name);
  return userProfile;
}

async function updateProfileImageName(userId, profileImageName) {
  try {
    const response = await fetch('/profile_image_name/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: userId, name: profileImageName })
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`Error updating profile image: ${errorMessage}`);
      return false;
    }

    console.log("Profile image status updated successfully.");
    return true;
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    return false;
  }
}

async function deleteProfileImage(userId, profileImageName) {
  try {
    const response = await fetch('/profile_image/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: userId, name: profileImageName} )
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`Error updating profile image: ${errorMessage}`);
      return false;
    }

    console.log("Profile image status updated successfully.");
    return true;

  } catch (error) {
    console.error(`An error occurred: ${error}`);
    return false;
  }
}
