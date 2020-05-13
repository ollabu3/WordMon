# Wordmon-server

끝말잇기 게임 서버 <br>
Node.js express 서버 <br>
DB - mySQL <br>
ORM - sequelize <br>

만든사람들
윤민아, 이민경, 이윤주

---

### API 문서

/user <br>

- GET - 유저 정보 <br>
  **request** <br>
  axios.get('http://localhost:4000/user') <br>
  **respons**e <br>
  cookie에 userId 토큰으로 로그인된 유저인지 식별 후 <br>
  res.json({ <br>
  nickname:, <br>
  profileImg:, <br>
  score <br>
  }) <br>

- POST - 유저 등록 <br>
  **request** <br>
  axios.post('http://localhost:4000/user', {
  googleToken:,
  nickname:,
  }) <br>
  **response** <br>
  res.json({ <br>
  nickname:, <br>
  profileImg:, <br>
  score <br>
  }) <br>

/user/siginin<br>

- POST - 로그인 (토큰을 쿠키에 저장)<br>
  **request** <br>
  axios.post('http://localhost:4000/user/siginin') <br>
  **response** <br>
  res.json({ <br>
  nickname:, <br>
  profileImg:, <br>
  score <br>
  }) <br>

/user/siginout<br>

- POST - 로그아웃 <br>
  **request** <br>
  axios.post('http://localhost:4000/user/siginout') <br>
  **response** <br>
  쿠키에서 로그인 토큰 삭제

/user/:nickname <br>

- GET - 닉네임 중복검사<br>
  **request** <br>
  axios.get('http://localhost:4000/user/:nickname') <br>
  **response** <br>
  res.send(true/false)

/user/nickname <br>

- PATCH - 닉네임 수정<br>
  **request** <br>
  axios.patch('http://localhost:4000/user/nickname', {nickname:'변경할닉네임'})<br>
  **response** <br>
  res.send(nickname updated: '변경된 닉네임');<br>

/user/profile-img <br>

- PATCH - 프로필 이미지 수정<br>
  **request** <br>
  axios.patch('http://localhost:4000/user/profile-img', {file: 변경할 프로필 이미지})<br>
  **response** <br>
  res.send(nickname updated: '변경된 프로필 이미지 경로');<br>

/user/score <br>

- PATCH - 최고 점수 수정 <br>
  **request** <br>
  axios.patch('http://localhost:4000/user/score', {score:'변경할 최고점수'})<br>
  **response** <br>
  res.send(nickname updated: '변경된 최고점수');<br>

---

/word <br>

- POST - 단어 사전 체크 <br>
  **request** <br>
  axios.patch('http://localhost:4000/word', {word:'검사할 단어'})<br>
  **response** <br>
  res.send(true);<br>
  
--- socket통신
/room
