// eslint-disable-next-line import/extensions
import validate from './validate.js';

const $emailInput = document.querySelector('.signup-form-email');

document.querySelector('.signup-form').oninput = e => {
  const $signupButton = document.querySelector('.form-button');
  if (e.target.matches('#name')) {
    validate.nameValidate(e.target.value, 0, $signupButton);
  } else if (e.target.matches('#email')) {
    validate.emailValidate(e.target.value, 1, $signupButton);
    $emailInput.querySelector('.icon-success').classList.add('hidden');
    $emailInput.querySelector('.icon-error').classList.remove('hidden');
  } else if (e.target.matches('#phone')) {
    validate.phoneValidate(e.target.value, 2, $signupButton);
  } else if (e.target.matches('#password')) {
    validate.passwordValidate(e.target.value, 3, $signupButton);
  } else if (e.target.matches('#confirm-password')) {
    validate.passwordConfirmValidate(document.querySelector('#password').value !== e.target.value, 4, $signupButton);
  }
};

document.querySelector('.form-button').onclick = async event => {
  try {
    event.preventDefault();
    const { data: maxId } = await axios.get('/users');
    const newId = maxId.maxId;

    await axios.post('/users/signup', {
      id: newId, // 왜 newId 변수설정안해주면 null로 들어가는지 ?
      name: document.querySelector('#name').value,
      email: document.querySelector('#email').value,
      phone: document.querySelector('#phone').value,
      password: document.querySelector('#password').value,
    });

    alert('회원가입이 완료되었습니다.');
    window.location.href = '/signin';
  } catch (e) {
    console.error(e);
  }
};

const $checkDuplicateMessage = document.querySelector('.signup-form-email .error');
const changeText = (message, color) => {
  $checkDuplicateMessage.innerHTML = message;
  $checkDuplicateMessage.style.color = color;
};

document.querySelector('.signup-form-email-button').onclick = async () => {
  const emailValue = document.querySelector('#email').value;

  const res = await axios.get(`/users/email/${emailValue}`);
  const { isDuplicate } = res.data;
  if (isDuplicate) {
    changeText('이미 존재하는 이메일 입니다.', '#ed2553');
  } else {
    changeText('사용 가능한 이메일 입니다.', '#2196f3');
    $emailInput.querySelector('.icon-success').classList.remove('hidden');
    $emailInput.querySelector('.icon-error').classList.add('hidden');
  }
};
