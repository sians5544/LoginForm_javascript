const render = (() => {
  document.querySelector('.form-back').onclick = () => {};

  window.onload = async () => {
    const { data: user } = await axios.get(`/users/${id}`);

    document.querySelector('.mypage-form-email > input').value = user.email;
    document.querySelector('.mypage-form-name > input').value = user.name;
    document.querySelector('.mypage-form-phone > input').value = user.phone;
  };
})();

document.querySelector('.edit-profile-button').onclick = () => {
  window.location.href = '/mypage_edit.html';
};
