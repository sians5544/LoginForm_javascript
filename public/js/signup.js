// eslint-disable-next-line import/extensions
import validate from './validate.js';

// const auth = (() => {
//   const $iconSuccess = document.querySelectorAll('.icon-success');
//   const $iconError = document.querySelectorAll('.icon-error');
//   const $error = document.querySelectorAll('.error');

//   return {
//     iconChange(index, isError) {
//       if (isError) {
//         $iconSuccess[index].classList.add('hidden');
//         $iconError[index].classList.remove('hidden');
//       } else {
//         $iconSuccess[index].classList.remove('hidden');
//         $iconError[index].classList.add('hidden');
//       }
//     },

//     countCorrectInput(arr, index, btn) {
//       const cnt = arr.filter(idx => (idx !== index ? !$iconSuccess[idx].classList.contains('hidden') : false)).length;
//       if (cnt === arr.length - 1) btn.removeAttribute('disabled');
//     },

//     activeSubmitButton(reg, index, btn) {
//       if (reg) btn.setAttribute('disabled', '');
//       else {
//         auth.countCorrectInput([0, 1, 2, 3, 4], index, btn);
//       }
//     },

//     checkIsCorrectForm(reg, index, msg, btn) {
//       auth.iconChange(index, reg);
//       $error[index].textContent = reg ? msg : '';
//       auth.activeSubmitButton(reg, index, btn);
//     },
//   };
// })();

// // email validate
// const emailValidate = (expression, index, button) => {
//   const regEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

//   auth.checkIsCorrectForm(!regEmail.test(expression), index, '이메일 형식에 맞게 입력해 주세요.', button);
// };

// // password validate
// const passwordValidate = (expression, index, button) => {
//   const regPassword = /^[A-Za-z0-9]{6,12}$/;

//   auth.checkIsCorrectForm(!regPassword.test(expression), index, '영문 또는 숫자를 6~12자 입력하세요.', button);
// };

document.querySelector('.signup-form').oninput = e => {
  const $signupButton = document.querySelector('.form-button');
  if (e.target.matches('#name')) {
    console.log('d');
    validate.nameValidate(e.target.value, 0, $signupButton);
  } else if (e.target.matches('#email')) {
    validate.emailValidate(e.target.value, 1, $signupButton);
  } else if (e.target.matches('#phone')) {
    validate.phoneValidate(e.target.value, 2, $signupButton);
  } else if (e.target.matches('#password')) {
    validate.passwordValidate(e.target.value, 3, $signupButton);
  } else if (e.target.matches('#confirm-password')) {
    validate.passwordConfirmValidate(document.querySelector('#password').value !== e.target.value, 4, $signupButton);
  }
};
