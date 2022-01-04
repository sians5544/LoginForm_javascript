const render = (() => {
  document.querySelector('.form-back').onclick = () => sessionStorage.setItem('auth', 0);

  sessionStorage.setItem('auth', 1);

  window.onload = async () => {
    const id = +localStorage.getItem('auth') ? +localStorage.getItem('auth') : +sessionStorage.getItem('auth');

    if (id) {
      const { data: user } = await axios.get(`/users/${id}`);

      document.querySelector('.mypage-form-email > input').value = user.email;
      document.querySelector('.mypage-form-name > input').value = user.name;
      document.querySelector('.mypage-form-phone > input').value = user.phone;
    }
  };
})();
