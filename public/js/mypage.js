const render = (() => {
  window.onload = async () => {
    const { data: user } = await axios.get('/jjongBin');

    if (user) {
      document.querySelector('.mypage-form-email > input').value = user.email;
      document.querySelector('.mypage-form-name > input').value = user.name;
      document.querySelector('.mypage-form-phone > input').value = user.phone;
    }
  };
})();

document.querySelector('.edit-profile-button').onclick = () => {
  window.location.href = '/mypage_edit';
};

document.querySelector('.form-back').onclick = async () => {
  const check = await axios.post('/users/logout');
  if (check.status === 204) window.location.href = '/signin';
};
