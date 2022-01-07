const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config();

const app = express();
const port = 9001;

// Mock data
let users = [
  {
    id: 1,
    name: '조용우',
    email: 'ywc8851@naver.com',
    phone: '010-8661-9497',
    password: 'dyddn123',
  },
  {
    id: 2,
    name: '박시안',
    email: 'sian@naver.com',
    phone: '010-1234-5678',
    password: 'tldks123',
  },
  {
    id: 3,
    name: '원종빈',
    email: 'jongbin@naver.com',
    phone: '010-1234-8765',
    password: 'whdqls123',
  },
  {
    id: 4,
    name: '안현서',
    email: '1410ahs@naver.com',
    phone: '010-1234-9876',
    password: 'gustj123',
  },
];

users = users.map(user => ({
  ...user,
  passwordHint: user.password.slice(0, 2) + '*'.repeat(user.password.length - 2),
}));
console.log(users);
users = users.map(user => ({ ...user, password: bcrypt.hashSync(user.password, 10) }));
console.log(users);

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// middleware
const auth = (req, res, next) => {
  const accessToken = req.headers.authorization || req.cookies.accessToken;

  try {
    jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    next();
  } catch (e) {
    return res.redirect('/signin');
  }
};

// root route
app.get('/checkAuth', (req, res) => {
  const accessToken = req.headers.authorization || req.cookies.accessToken;

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

    res.send(users.find(user => user.email === decoded.email));
  } catch (e) {
    return res.redirect('/signin');
  }
});

app.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, './public/signin.html'));
});

// 미들웨어 auth를 사용해 로그인 여부를 체크
app.get('/', auth, (req, res) => {
  res.sendFile(path.join(__dirname, './public/mypage.html'));
});

app.get('/mypage', auth, (req, res) => {
  res.sendFile(path.join(__dirname, './public/mypage.html'));
});

app.get('/mypage_edit', auth, (req, res) => {
  res.sendFile(path.join(__dirname, './public/mypage_edit.html'));
});

// id 번호 자동 생성
app.get('/users', (req, res) => {
  const maxId = Math.max(...users.map(user => user.id), 0) + 1;

  res.send({
    maxId,
  });
});

// 이메일 중복확인
app.get('/users/email/:email', (req, res) => {
  const { email } = req.params;
  const user = users.find(user => user.email === email);
  const isDuplicate = !!user;

  res.send({
    isDuplicate,
  });
});

// 회원탈퇴 비밀번호 검증
app.post('/hashPassword', (req, res) => {
  // const { password } = req.body;
  // const hashPassword = bcrypt.hashSync(password, 10);
  // res.send(hashPassword);
  const check = bcrypt.hashSync(req.body.password, 10) === req.body.compare;
  console.log(bcrypt.hashSync(req.body.password, 10), req.body.compare);
  console.log(check);
  res.send(check);
});

// 비밀번호 찾기
app.get('/user/find/:email', (req, res) => {
  const { email } = req.params;
  const user = users.find(user => user.email === email);

  if (user) {
    // const len = user.password.length;
    // const passwordHint = user.password.slice(0, 2) + '*'.repeat(len - 2);

    // res.send({
    //   passwordHint,
    // });
    console.log(user);
    res.send(user.passwordHint);
  } else {
    return res.status(401).send({
      error: '존재하지 않는 이메일 입니다.',
    });
  }
});

// 로그아웃
app.get('/users/logout', (req, res) => {
  res.clearCookie('accessToken').sendStatus(204);
});

const createToken = (email, expirePeriod) => {
  return jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: expirePeriod });
};

// 로그인
app.post('/signin', (req, res) => {
  const { email, password, autoLogin } = req.body;

  if (!email || !password) {
    return res.status(401).send({
      error: '사용자 아이디 또는 패스워드가 전달되지 않았습니다.',
    });
  }

  const user = users.find(user => email === user.email && bcrypt.compareSync(password, user.password));

  if (!user) {
    return res.status(401).send({
      error: '등록되지 않은 사용자입니다.',
    });
  }
  let accessToken;

  // 자동로그인 check에 따른 expire 기간 설정
  if (autoLogin) {
    accessToken = createToken(email, '1d');
  } else {
    accessToken = createToken(email, '10s');
  }

  res.cookie('accessToken', accessToken, {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
    httpOnly: true,
  });

  const _id = user.id;

  res.send({
    _id,
  });
});

// 회원가입
app.post('/users/signup', (req, res) => {
  users = [...users, { ...req.body, password: bcrypt.hashSync(req.body.password, 10) }];
  console.log(users);
  res.send(users);
});

// 마이페이지 수정
app.patch('/users/:id', (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  const payload = { ...req.body, password: bcrypt.hashSync(req.body.password, 10) };
  users = users.map(user => (user.id === +id ? { ...user, ...payload } : user));
  res.send(users);
});

// 회원탈퇴
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  users = users.filter(user => user.id !== +id);

  res.clearCookie('accessToken').sendStatus(204);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
