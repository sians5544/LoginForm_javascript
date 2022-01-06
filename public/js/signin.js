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
    const { data: user } = await axios.post('/signin', {
      email: $emailInput.value,
      password: $passwordInput.value,
    });

    if (user) window.location.href = '/mypage';
  } catch (e) {
    $signinError.innerHTML = '아이디 또는 비밀번호가 잘못 입력 되었습니다.';
    console.error(e);
  }
};

const $modal = document.querySelector('.popup');
const $modalError = $modal.querySelector('.error');

const popupHandle = () => {
  document.querySelector('.cover').classList.toggle('hidden');
  $modal.classList.toggle('hidden');
  $modalError.textContent = '';
  document.querySelector('.find-password').value = '';
  document.querySelector('.popup-button').setAttribute('disabled', '');
};

document.querySelector('.find').onclick = e => {
  e.preventDefault();
  popupHandle();
};

$modal.querySelector('.cancle-button').onclick = () => {
  popupHandle();
};

document.querySelector('.find-password').oninput = e => {
  const regEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

  if (regEmail.test(e.target.value)) {
    document.querySelector('.popup-button').removeAttribute('disabled');
  } else {
    document.querySelector('.popup-button').setAttribute('disabled', '');
  }
};

document.querySelector('.popup-button').onclick = async e => {
  e.preventDefault();
  try {
    const findPassword = document.querySelector('.find-password').value;
    const res = await axios.get(`/user/find/${findPassword}`);
    document.querySelector('.find-password').value = res.data.passwordHint;
  } catch (e) {
    console.error(e);
    document.querySelector('.popup .error').innerHTML = '존재하지 않는 이메일 입니다.';
  }
};
