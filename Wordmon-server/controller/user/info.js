const { users } = require('../../models');
const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// dotenv.config();

module.exports = {
  get: (req, res) => {
    if (!req.cookies.userId) {
      res.send('no');
    } else {
      // 토큰 확인
      let token = req.cookies.userId;

      // let token = req.localStorage.getItem('userId');

      //console.log(token);
      var decode = jwt.verify(token, 'love');
      // console.log(decode);

      // 토큰이 유효하지 않은 경우 처리를 해야 한다.

      users
        .findOne({
          where: {
            id: decode.id,
          },
        })
        .then((data) => {
          // console.log(data);
          if (!data) {
            res.status(401).send('invalid user'); // 등록되지 않은 회원
          } else {
            res.status(200).json(data.dataValues);
          }
        })
        .catch((err) => {
          res.sendStatus(500);
        });
    }
  },
};
