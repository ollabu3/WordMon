const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const urlencode = require('urlencode'); // 인코딩 모듈
const morgan = require('morgan');
const cors = require('cors');
const axios = require('axios');

const { users } = require('./models');
const jwt = require('jsonwebtoken');

const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: './upload' });

const app = express();
const port = 4000;

const userRouter = require('./routes/user'); // routes생성하기
const wordRouter = require('./routes/word'); // routes생성하기

app.use(cookieParser());
// cookieData를 json으로 parse

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//app.use(cors());

app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  }),
);

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.status(200).send('start');
});

// app.set('port', port);
// app.listen(app.get('port'), () => {
//   console.log(`app is listening in PORT ${app.get('port')}`);
// });

app.use('/image', express.static('./upload'));

app.post('/user/profile', upload.single('image'), (req, res) => {
  let token = req.cookies.userId;
  let image = '/image/' + req.file.filename;
  jwt.verify(token, 'love', (err, decoded) => {
    users
      .update(
        {
          profileImg: image,
        },
        {
          where: {
            id: decoded.id,
          },
        },
      )
      .then(() => {
        users
          .findOne({
            where: {
              id: decoded.id,
            },
          })
          .then((data) => {
            console.log(data);
            res.send('okkkk');
          });
      });
  });
});

app.use('/user', userRouter);
app.use('/word', wordRouter);

// 클라이언트가 마이페이지에서 게임 스타트를 누르면 방에 자리가 있는지 확인을 한다.
app.get('/roomopen', (req, res) => {
  if (usersArr.length <= 4 && !isPlaying) {
    res.send(true);
  } else {
    res.send(false);
  }
});

// 임시로 만들었음
app.post('/score', (req, res) => {
  users
    .update(
      {
        score: req.body.score,
      },
      {
        where: {
          nickname: req.body.nickname,
        },
      },
    )
    .then(() => {
      res.send('스코어 수정함');
    });
});

// * 소켓통신 --------------------------------------------------------------------------------------------------------------

const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

let usersArr = [];
let whoIsAdmin = 0;

let isPlaying = false;
const randomStartWords = [
  '무지개',
  '나무',
  '오락실',
  '개나리',
  '실내화',
  '리어카',
];
let a = Math.floor(Math.random() * randomStartWords.length); //최댓값도 포함, 최솟값도 포함
let gameWord = randomStartWords[a];
let wordChain = [];
let turnCount = 0;

// usersArr에서 인덱스 찾는 함수
let findUser = (id) => usersArr.findIndex((user) => user.id === id);

var room = io.of('/room').on('connection', function(socket) {
  console.log('누군가 소켓을 열었다.');

  // 방 입장
  socket.on('join', function(data) {
    var user = {
      id: socket.id,
      nickname: data.nickname,
      profileImg: data.profileImg,
      score: data.score,
      ready: false,
    };

    usersArr.push(user); // 어차피 userArr 수가 넘으면 join을 안해서 체크 없이 바로 push

    room.to(socket.id).emit('selfData', user);
    // console.log('지금 들어와 있는 사람들', usersArr);
    room.emit('userData', {
      usersArr: usersArr,
      whoIsAdmin: whoIsAdmin,
    });

    room.emit('message', {
      nickname: data.nickname,
      msg: '방에 입장합니다.',
    });
  });

  // 채팅메세지를 보낸다
  socket.on('sendMessage', (messageObj) => {
    //messageObj = {nickname: "" , msg: ""}
    room.emit('message', messageObj);
  });

  // 게임 준비
  socket.on('ready', (data) => {
    const user = findUser(socket.id);
    usersArr[user]['ready'] = data.ready;

    room.to(socket.id).emit('selfData', usersArr[user]);
    room.emit('userData', { usersArr: usersArr });

    let isAllReady = usersArr
      .map((element) => {
        return element['ready'];
      })
      .every((element) => {
        return element === true;
      });

    console.log('모든 사람이 준비가 되었나?', isAllReady);
    if (isAllReady) {
      // 모든 사람이 준비가 되어있다
      // 게임 페이지로 넘어가는 메세지를 보낸다.
      // 일단 그냥 다 같이 시작함ㅋㅋㅋㅋㅋ
      isPlaying = true;
      room.emit('gameStart', { gameStart: true, gameWord: gameWord });
      room.emit('message', { nickname: '관리자', msg: '게임이 시작됩니다.' });
      room.to(usersArr[turnCount].id).emit('turn', { isMyturn: true });
      room.emit('message', {
        nickname: '관리자',
        msg: `${usersArr[turnCount].nickname}님의 차례입니다.`,
      });
    } else {
    }
  });

  // 게임 시간 관리
  socket.on('timeout', (data) => {
    room.emit('gameEnd', {
      gameEnd: false,
    });
    usersArr.forEach((user) => {
      return (user['ready'] = false);
    });
    let a = Math.floor(Math.random() * randomStartWords.length); //최댓값도 포함, 최솟값도 포함
    gameWord = randomStartWords[a];
    room.emit('userData', { usersArr: usersArr });
    room.emit('message', {
      nickname: '관리자',
      msg: `게임이 종료되었습니다. 최종 스코어는 ${wordChain.length *
        7}점 입니다.`,
    });
    usersArr.forEach((element) => {
      if (element['score'] < wordChain.length * 7) {
        element['score'] = wordChain.length * 7;
        axios
          .post('http://localhost:4000/score', {
            nickname: element['nickname'],
            score: wordChain.length * 7,
          })
          .then((res) => {
            console.log(res.data);
          });
      }
    });
    room.emit('userData', { usersArr: usersArr });
    wordChain = [];
    isPlaying = false;
  });

  // 단어 체크
  socket.on('wordcheck', (data) => {
    const word = data.word;
    const user = findUser(socket.id);
    room.emit('message', {
      nickname: '관리자',
      msg: `${usersArr[user].nickname}님이 "${word}"을/를 입력했습니다.`,
    });
    if (gameWord[gameWord.length - 1] === word[0]) {
      // 제시어와 들어온 단어의 앞 뒤가 맞는지?
      axios
        .post('http://localhost:4000/word', { word: word })
        .then((result) => {
          console.log('단어 체크 결과', result.data);
          if (result.data) {
            // 단어 통과
            wordChain.push(word);
            room.emit('turn', { isMyturn: false });

            gameWord = word;
            room.emit('changeGameWord', { gameWord: gameWord });
            room.emit('message', {
              nickname: '관리자',
              msg: `${word}는 사전에 등재된 단어입니다. 제시어가 ${gameWord}로 바뀝니다.`,
            });
            turnCount++; // 순서 바꾸고
            if (turnCount >= usersArr.length) {
              turnCount = 0;
            }
            // 다음 턴인 사람한테 턴 true
            room.to(usersArr[turnCount].id).emit('turn', { isMyturn: true });
            room.emit('message', {
              nickname: '관리자',
              msg: `${usersArr[turnCount].nickname}님의 차례입니다.`,
            });
          } else {
            room.to(socket.id).emit('wordCheckResult', {
              result: false,
            });
            room.emit('message', {
              nickname: '관리자',
              msg: '사전에 등재된 단어가 아닙니다.',
            });
          }
        });
    } else {
      room.to(socket.id).emit('wordCheckResult', {
        result: false,
      });
      room.emit('message', {
        nickname: '관리자',
        msg: '끝말잇기 규칙에 맞지 않습니다. 다른 단어를 입력하세요.',
      });
    }
  });

  // 유저가 방을 떠남
  socket.on('leaveRoom', () => {
    const user = findUser(socket.id);
    room.emit('message', {
      nickname: '관리자',
      msg: `${usersArr[user].nickname}님이 방을 나갔습니다.`,
    });
    usersArr.splice(user, 1);
    room.emit('userData', { usersArr: usersArr });
    console.log('누군가 방을 나갔어', usersArr);
  });

  // 유저가 아예 창을 닫음
  socket.on('disconnect', () => {
    const user = findUser(socket.id);
    if (user !== -1) {
      room.emit('message', {
        nickname: '관리자',
        msg: `${usersArr[user].nickname}님이 방을 나갔습니다.`,
      });
      usersArr.splice(user, 1);
      room.emit('userData', { usersArr: usersArr });
    }
    console.log('누군가 창을 닫고 나갔어', usersArr);
  });
});

server.listen(port, () => console.log(`Server has started on ${port}`));
