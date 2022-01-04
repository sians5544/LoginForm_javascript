// eslint-disable-next-line import/extensions
import validate from './validate.js';

const test = (() => {
  window.onload = async () => {
    sessionStorage.setItem('auth', 1);
    const id = +localStorage.getItem('auth') ? +localStorage.getItem('auth') : +sessionStorage.getItem('auth');

    console.log(id);

    const {
      data: user
    } = await axios.get(`/users/${id}`);

    document.querySelector('.mypage-form-email > input').value = user.email;
    document.querySelector('.mypage-form-name > input').value = user.name;
    document.querySelector('.mypage-form-phone > input').value = user.phone;

    const regName = /^[^\s]{1,}$/;

    // document.querySelector('.mypage-form-email > input').setAttribute('value', user.email);
    // document.querySelector('.mypage-form-name > input').setAttribute('value', user.name);
    // document.querySelector('.mypage-form-phone > input').setAttribute('value', user.phone);
  };
})();

document.querySelector('.mypage-form').oninput = e => {
  const $completeButton = document.querySelector('.complete-button');

  if (e.target.matches('#email')) {
    validate.emailValidate(e.target.value, 0, $completeButton);
  } else if (e.target.matches('#password')) {
    console.log(e.target);
    validate.passwordValidate(e.target.value, 3, $completeButton);
  }
};