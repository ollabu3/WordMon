const { users } = require('../../models');
const jwt = require('jsonwebtoken');

module.exports = {
  post: (req, res) => {
    // jwt토큰으로 회원아이디를 식별한다.
    let token = req.cookies.userId;

    jwt.verify(token, 'love', (err, decoded) => {
      if (err) {
        res.status(401).send('Authentication required'); // 인증이 필요함
      } else {
        if (req.body.nickname) {
          users
            .update(
              {
                nickname: req.body.nickname,
              },
              {
                where: {
                  id: decoded.id,
                },
              },
            )
            .then((data) => {
              //console.log(data)
              res.status(200).send(result.dataValues.nickname);
            })
            .catch((err) => {
              res.status(202).send('duplicated nickname');
            });
        }
      }
    });
  },
};
