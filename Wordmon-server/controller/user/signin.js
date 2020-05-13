const { users } = require('../../models');
const jwt = require('jsonwebtoken');
const axios = require('axios');
// const { OAuth2Client } = require('google-auth-library');

// const dotenv = require('dotenv');
// dotenv.config();

module.exports = {
  post: (req, res) => {
    // 구글 토큰은 req.body에 붙여서 보내준다.
    let googleIdToken = req.body.googleIdToken;
    let clientEmail;
    // 구글 토큰이 유효한지 확인 한다.
    axios
      .get(`https://oauth2.googleapis.com/tokeninfo?id_token=${googleIdToken}`)
      .then((response) => {
        console.log('구글에 요청을 보내고 응답을 받음');
        if (response.status === 200) {
          // 구글토큰으로 이메일을 교환하고 교환한 이메일로 사용자 DB를 확인한다.
          clientEmail = response.data.email;
          users
            .findOne({
              where: {
                googleEmail: clientEmail,
              },
            })
            .then((data) => {
              if (!data) {
                res.status(202).send('you need to signup'); // 워드몬에 가입되지 않은 회원
              } else {
                var token = jwt.sign({ id: data.dataValues.id }, 'love', {
                  expiresIn: '3d',
                  subject: 'checkLogin',
                  issuer: 'team rocket',
                });

                res.cookie('userId', token);
                // console.log(res.cookie.userId);
                // localStorage.setItem('userId', token);

                // var getValue = localStorage.getItem('userId');
                // console.log(getValue);

                res.status(200).json({
                  score: data.dataValues.score,
                  nickname: data.dataValues.nickname,
                  profileImg: data.dataValues.profileImg,
                });
              }
            })
            .catch((err) => {
              res.send(404).send(err);
            });
        }
      });

    // users
    //   .findOne({
    //     where: {
    //       googleEmail: req.body.googleEmail,
    //     },
    //   })
    //   .then((data) => {
    //     if (!data) {
    //       res.status(202).send('you need to signup'); // 워드몬에 가입되지 않은 회원
    //     } else {
    //       // req.body.googleIdToken (구글 로그인 API에 유효성 확인)

    //       var token = jwt.sign({ id: data.dataValues.id }, 'love', {
    //         expiresIn: '5m',
    //         subject: 'checkLogin',
    //         issuer: 'team rocket',
    //       });

    //       res.cookie('userId', token);
    //       // console.log(res.cookie.userId);
    //       // localStorage.setItem('userId', token);

    //       // var getValue = localStorage.getItem('userId');
    //       // console.log(getValue);

    //       res.status(200).json({
    //         score: data.dataValues.score,
    //         nickname: data.dataValues.nickname,
    //         profileImg: data.dataValues.profileImg,
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     res.send(404).send(err);
    //   });
  },
};

/*
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
}
verify().catch(console.error);
*/
