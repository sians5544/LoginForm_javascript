// eslint-disable-next-line import/extensions
import validate from './validate.js';

const $formButton = document.querySelector('.form-button');
const $autoLogin = document.querySelector('#auto__login');
const $emailInput = document.querySelector('#email');
const $passwordInput = document.querySelector('#password');
const $signinError = document.querySelector('.singin-error-login');

let checked = false;

document.querySelector('.signin-form').oninput = e => {
  if (e.target.matches('#email')) {
    validate.emailValidate(e.target.value, 0, $formButton);
  } else if (e.target.matches('#password')) {
    validate.passwordValidate(e.target.value, 1, $formButton);
  }
};

$autoLogin.onchange = () => {
  checked = !checked;
};

$formButton.onclick = async event => {
  try {
    event.preventDefault();
    const {
      data: user
    } = await axios.post('/signin', {
      email: $emailInput.value,
      password: $passwordInput.value,
    });
    if (user) {
      window.location.href = '/mypage';
    } else {
      $signinError.innerHTML = '아이디 또는 비밀번호가 잘못 입력 되었습니다.';
    }
  } catch (e) {
    console.error(e);
  }
};
// 입력된 email 로 아이디 값을 가져오기