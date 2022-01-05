import validate from './validate.js';

const test = (() => {
  window.onload = async () => {
    sessionStorage.setItem('auth', 1);
    const id = +localStorage.getItem('auth') ? +localStorage.getItem('auth') : +sessionStorage.getItem('auth');

    const {
      data: user
    } = await axios.get(`/users/${id}`);

    document.querySelector('.mypage-form-email > input').value = user.email;
    document.querySelector('.mypage-form-name > input').value = user.name;
    document.querySelector('.mypage-form-phone > input').value = user.phone;

    // document.querySelector('.mypage-form-email > input').setAttribute('value', user.email);
    // document.querySelector('.mypage-form-name > input').setAttribute('value', user.name);
    // document.querySelector('.mypage-form-phone > input').setAttribute('value', user.phone);
  };
})();

document.querySelector('.mypage-form').oninput = e => {
  const $completeButton = document.querySelector('.complete-button');

  if (e.target.matches('#name')) {
    validate.nameValidate(e.target.value, 0, $completeButton);
  } else if (e.target.matches('#phone')) {
    validate.phoneValidate(e.target.value, 1, $completeButton);
  } else if (e.target.matches('#password')) {
    validate.passwordValidate(e.target.value, 2, $completeButton);
  } else if (e.target.matches('#confirm-password')) {
    validate.passwordConfirmValidate(document.querySelector('#password').value !== e.target.value, 3, $completeButton);
  }

  // 비밀번호 정규식 맞게 && 비밀번호===비밀번호 확인
};