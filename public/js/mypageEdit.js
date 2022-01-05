import validate from './validate.js';

const $completeButton = document.querySelector('.complete-button');
const $email = document.querySelector('.mypage-form-email > input');
const $name = document.querySelector('.mypage-form-name > input');
const $phone = document.querySelector('.mypage-form-phone > input');
const $password = document.querySelector('.mypage-form-password > input');
const id = +localStorage.getItem('auth') ? +localStorage.getItem('auth') : +sessionStorage.getItem('auth');

window.onload = async () => {
  sessionStorage.setItem('auth', 1);

  const { data: user } = await axios.get(`/users/${id}`);
  console.log('GET', user);

  $email.value = user.email;
  $name.value = user.name;
  $phone.value = user.phone;
};

document.querySelector('.mypage-form').oninput = e => {

  if (e.target.matches('#name')) {
    validate.nameValidate(e.target.value, 0, $completeButton);
  } else if (e.target.matches('#phone')) {
    validate.phoneValidate(e.target.value, 1, $completeButton);
  } else if (e.target.matches('#password')) {
    validate.passwordValidate(e.target.value, 2, $completeButton);
  } else if (e.target.matches('#confirm-password')) {
    validate.passwordConfirmValidate(document.querySelector('#password').value !== e.target.value, 3, $completeButton);
  }
};

$completeButton.onclick = async e => {
  e.preventDefault();
  try {
    await axios.patch(`/users/${id}`, {
      name: $name.value,
      phone: $phone.value,
      password: $password.value,
    });

    window.location.href = '/mypage.html';
  } catch (e) {
    console.error(e);
  }
};

