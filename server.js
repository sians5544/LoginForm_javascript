const express = require('express');

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

app.use(express.static('public'));
app.use(express.json());

// 마이페이지에 데이터 뿌려주기
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const user = users.find(user => user.id === +id);

  res.send(user);
});

// 이메일 중복확인
app.get('/users/email/:email', (req, res) => {
  const { email } = req.params;
  const user = users.find(user => user.email === email);
  res.send(user);
});

// 로그인
app.post('/users/signin', (req, res) => {
  const payload = req.body;
  const user = users.find(user => user.email === payload.email && payload.password === user.password);
  res.send(user);
});

// 회원가입
app.post('/users/signup', (req, res) => {
  users = [req.body, ...users];
  res.send(users);
});

// 마이페이지 수정
app.patch('/users/:id', (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  users = users.map(user => (user.id === +id ? { ...user, ...payload } : user));
  res.send(users);
});

// 회원탈퇴
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  users = users.filter(user => user.id !== +id);
  res.send(users);
});

// 서버에서 계속 듣고있음
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
