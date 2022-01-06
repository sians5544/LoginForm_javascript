const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();
const port = 9001;

// Mock data
let users = [{
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

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

const auth = (req, res, next) => {
  const accessToken = req.headers.authorization || req.cookies.accessToken;
  try {
    jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    next();
  } catch (e) {
    return res.redirect('/signin');
  }
};

app.get('/users', (req, res) => {
  const maxId = Math.max(...users.map(user => user.id), 0) + 1;
  res.send({
    maxId,
  });
});

// 마이페이지에 데이터 뿌려주기
app.get('/users/:id', (req, res) => {
  const {
    id
  } = req.params;
  const user = users.find(user => user.id === +id);

  res.send(user);
});

// 이메일 중복확인
app.get('/users/email/:email', (req, res) => {
  const {
    email
  } = req.params;
  const user = users.find(user => user.email === email);
  const isDuplicate = !!user;
  res.send({
    isDuplicate,
  });
});

app.get('/user/find/:email', (req, res) => {
  const {
    email
  } = req.params;

  const user = users.find(user => user.email === email);

  if (user) {
    const len = user.password.length;
    const passwordHint = user.password.slice(0, 2) + '*'.repeat(len - 2);
    res.send({
      passwordHint
    });
  } else {
    return res.status(401).send({
      error: '존재하지 않는 이메일 입니다.',
    });
  }
});

app.get('/checkAuth', (req, res) => {
  const accessToken = req.headers.authorization || req.cookies.accessToken;
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

    res.send(users.find(user => user.email === decoded.email));
  } catch (e) {
    return res.redirect('/signin');
  }
});

// 로그인
app.post('/signin', (req, res) => {
  // const payload = req.body;
  // const user = users.find(user => user.email === payload.email && payload.password === user.password);
  // res.send(user);
  const {
    email,
    password
  } = req.body;
  if (!email || !password) {
    return res.status(401).send({
      error: '사용자 아이디 또는 패스워드가 전달되지 않았습니다.',
    });
  }
  const user = users.find(user => email === user.email && password === user.password);
  // const user = users.findUser(email, password);
  console.log('사용자 정보:', user);

  if (!user) {
    return res.status(401).send({
      error: '등록되지 않은 사용자입니다.',
    });
  }

  const accessToken = jwt.sign({
      email,
    },
    process.env.JWT_SECRET_KEY,

    {
      expiresIn: '1d',
    }
  );

  res.cookie('accessToken', accessToken, {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
    httpOnly: true,
  });
  const _id = user.id;
  res.send({
    _id,
  });
});

// 로그아웃
app.post('/users/logout', (req, res) => {
  res.clearCookie('accessToken').sendStatus(204);
});

// 회원가입
app.post('/users/signup', (req, res) => {
  users = [req.body, ...users];
  res.send(users);
});

// 마이페이지 수정
app.patch('/users/:id', (req, res) => {
  const {
    id
  } = req.params;
  const payload = req.body;
  users = users.map(user => (user.id === +id ? {
      ...user,
      ...payload,
    } :
    user));
  res.send(users);
});

// 회원탈퇴
app.delete('/users/:id', (req, res) => {
  const {
    id
  } = req.params;
  users = users.filter(user => user.id !== +id);

  res.clearCookie('accessToken').sendStatus(204);
});

// auth route
app.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, './public/signin.html'));
});

// root route
// 미들웨어 auth를 사용해 로그인 여부를 체크한다.
app.get('/mypage', auth, (req, res) => {
  res.sendFile(path.join(__dirname, './public/mypage.html'));
});

app.get('/mypage_edit', auth, (req, res) => {
  res.sendFile(path.join(__dirname, './public/mypage_edit.html'));
});

app.get('/', auth, (req, res) => {
  console.log(req.header);
  res.sendFile(path.join(__dirname, './public/mypage.html'));
});

// 서버에서 계속 듣고있음
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});