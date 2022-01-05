import validate from './validate.js';

const $completeButton = document.querySelector('.complete-button');
const $email = document.querySelector('.mypage-form-email > input');
const $name = document.querySelector('.mypage-form-name > input');
const $phone = document.querySelector('.mypage-form-phone > input');
const $password = document.querySelector('.mypage-form-password > input');

let nowUserPassword;
let
  nowUserId;

window.onload = async () => {
  const {
    data: user
  } = await axios.get('/jjongBin');
  console.log('GET', user);

  $email.value = user.email;
  $name.value = user.name;
  $phone.value = user.phone;

  nowUserId = user.id;
  nowUserPassword = user.password;

  console.log($email.value);
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
    await axios.patch(`/users/${nowUserId}`, {
      name: $name.value,
      phone: $phone.value,
      password: $password.value,
    });

    window.location.href = '/mypage';
  } catch (e) {
    console.error(e);
  }
};

const $modal = document.querySelector('.popup');
const $modalError = $modal.querySelector('.error');
const popupHandle = () => {
  document.querySelector('.cover').classList.toggle('hidden');
  $modal.classList.toggle('hidden');
  $modalError.textContent = '';
};

document.querySelector('.withdraw-button').onclick = e => {
  e.preventDefault();
  popupHandle();
};
$modal.querySelector('.cancle-button').onclick = () => {
  popupHandle();
};

const $deletePasswordCheck = $modal.querySelector('.delete-password');
$deletePasswordCheck.oninput = () => {
  if ($deletePasswordCheck.value === nowUserPassword) {
    $modal.querySelector('.delete-button').removeAttribute('disabled');
    $modalError.textContent = '';
  } else {
    $modalError.textContent = '비밀번호가 일치하지 않습니다!';
  }
};
// 그럼 나 이거 칠동안 생각해내면 그걸로 바꿔주지
const $deleteButton = document.querySelector('.delete-button');
$deleteButton.onclick = async () => {
  // 혹시 내가 피시방에서 정보를 수정하고 있는데 어떤 fe나쁜놈이 disabled를 해제하고 버튼을 클릭해서 내 계정을 삭제할 때를 대비해서 !
  if ($deleteButton.getAttribute('disabled') || $deletePasswordCheck.value !== nowUserPassword) return;

  const check = await axios.delete(`/users/${nowUserId}`);

  if (check.status === 204) window.location.href = '/signin';
};

document.querySelector('.form-back').onclick = () => {
  window.location.href = '/mypage';
};