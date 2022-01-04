const $iconSuccess = document.querySelectorAll('.icon-success');
const $iconError = document.querySelectorAll('.icon-error');
const $error = document.querySelectorAll('.error');

const iconChange = (index, isError) => {
  if (isError) {
    $iconSuccess[index].classList.add('hidden');
    $iconError[index].classList.remove('hidden');
  } else {
    $iconSuccess[index].classList.remove('hidden');
    $iconError[index].classList.add('hidden');
  }
};

const countCorrectInput = (arr, index, btn) => {
  const cnt = arr.filter(idx => (idx !== index ? !$iconSuccess[idx].classList.contains('hidden') : false)).length;
  if (cnt === arr.length - 1) btn.removeAttribute('disabled');
};

const activeSubmitButton = (reg, index, btn) => {
  if (reg) btn.setAttribute('disabled', '');
  else {
    countCorrectInput([0, 1], index, btn);
  }
};

const checkIsCorrectForm = (reg, index, msg, btn) => {
  iconChange(index, reg);
  $error[index].textContent = reg ? msg : '';
  activeSubmitButton(reg, index, btn);
};

// email validate

export default {
  emailValidate(expression, index, button) {
    const regEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

    return checkIsCorrectForm(!regEmail.test(expression), index, '이메일 형식에 맞게 입력해 주세요.', button);
  },

  // password validate
  passwordValidate(expression, index, button) {
    const regPassword = /^[A-Za-z0-9]{6,12}$/;

    return checkIsCorrectForm(!regPassword.test(expression), index, '영문 또는 숫자를 6~12자 입력하세요.', button);
  }
};