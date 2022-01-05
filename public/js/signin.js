const auth = (() => {
  const $iconSuccess = document.querySelectorAll('.icon-success');
  const $iconError = document.querySelectorAll('.icon-error');
  const $error = document.querySelectorAll('.error');

  return {
    iconChange(index, isError) {
      if (isError) {
        $iconSuccess[index].classList.add('hidden');
        $iconError[index].classList.remove('hidden');
      } else {
        $iconSuccess[index].classList.remove('hidden');
        $iconError[index].classList.add('hidden');
      }
    },

    countCorrectInput(arr, index, btn) {
      const cnt = arr.filter(idx => (idx !== index ? !$iconSuccess[idx].classList.contains('hidden') : false)).length;
      if (cnt === arr.length - 1) btn.removeAttribute('disabled');
    },

    activeSubmitButton(reg, index, btn) {
      if (reg) btn.setAttribute('disabled', '');
      else {
        auth.countCorrectInput([0, 1], index, btn);
      }
    },

    checkIsCorrectForm(reg, index, msg, btn) {
      auth.iconChange(index, reg);
      $error[index].textContent = reg ? msg : '';
      auth.activeSubmitButton(reg, index, btn);
    },
  };
})();

// email validate
const emailValidate = (expression, index, button) => {
  const regEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
  if (!regEmail.test(expression)) {
    document.querySelector('.signin-form-info label').style.top = '0';
  }
  auth.checkIsCorrectForm(!regEmail.test(expression), index, '이메일 형식에 맞게 입력해 주세요.', button);
};

// password validate
const passwordValidate = (expression, index, button) => {
  const regPassword = /^[A-Za-z0-9]{6,12}$/;

  auth.checkIsCorrectForm(!regPassword.test(expression), index, '영문 또는 숫자를 6~12자 입력하세요.', button);
};

// 회원가입했을 때 database에 user 추가
// const addUsers = async content => {};

// 로그인했을때

// vaildate event
document.querySelector('.signin-form').oninput = e => {
  const $loginButton = document.querySelector('.form-button');

  if (e.target.matches('#email')) {
    emailValidate(e.target.value, 0, $loginButton);
  } else if (e.target.matches('#password')) {
    passwordValidate(e.target.value, 1, $loginButton);
  }
};

const $autoLogin = document.querySelector('#auto__login');
const $formButton = document.querySelector('.form-button');
const $emailInput = document.querySelector('#email');
const $passwordInput = document.querySelector('#password');
const $singinError = document.querySelector('.singin-error-login');

let checked = false;

$autoLogin.onchange = () => {
  checked = !checked;
};

$formButton.onclick = async event => {
  try {
    event.preventDefault();
    const { data: user } = await axios.post('/users/signin', {
      email: $emailInput.value,
      password: $passwordInput.value,
    });

    if (user) {
      checked ? localStorage.setItem('auth', user.id) : sessionStorage.setItem('auth', user.id);
      window.location.href = './mypage.html';
    } else {
      $singinError.innerHTML = '아이디 또는 비밀번호가 잘못 입력 되었습니다.';
    }
  } catch (e) {
    console.error(e);
  }
};
// 입력된 email 로 아이디 값을 가져오기
