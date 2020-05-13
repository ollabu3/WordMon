const { users } = require('../../models');
const jwt = require('jsonwebtoken');

// 닉네임, 프로필사진, 최고기록
module.exports = {
  post: (req, res) => {
    // jwt토큰으로 회원아이디를 식별한다.
    let token = req.cookies.userId;

    let { score, profileImg, nickname } = req.body;

    jwt.verify(token, 'love', (err, decoded) => {
      if (err) {
        res.status(401).send('Authentication required'); // 인증이 필요함
      } else {
        if (score !== undefined) {
          users
            .update(
              {
                score: score,
              },
              {
                where: {
                  id: decoded.id,
                },
              },
            )
            .then((data) => {
              //console.log(data);
              users
                .findOne({
                  where: {
                    id: decoded.id,
                  },
                })
                .then((result) => {
                  //console.log(result.dataValues.score);
                  res
                    .status(200)
                    .send(`score updated: ${result.dataValues.score}`);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (nickname !== undefined) {
          users
            .update(
              {
                nickname: nickname,
              },
              {
                where: {
                  id: decoded.id,
                },
              },
            )
            .then((data) => {
              //console.log(data);
              users
                .findOne({
                  where: {
                    id: decoded.id,
                  },
                })
                .then((result) => {
                  //console.log(result.dataValues.score);
                  res
                    .status(200)
                    .send(`nickname updated: ${result.dataValues.nickname}`);
                });
            })
            .catch((err) => {
              console.log(err);
              z;
            });
        } else if (profileImg !== undefined) {
          users
            .update(
              {
                profileImg: profileImg,
              },
              {
                where: {
                  id: decoded.id,
                },
              },
            )
            .then((data) => {
              //console.log(data);
              users
                .findOne({
                  where: {
                    id: decoded.id,
                  },
                })
                .then((result) => {
                  //console.log(result.dataValues.score);
                  res
                    .status(200)
                    .send(
                      `profileImg updated: ${result.dataValues.profileImg}`,
                    );
                });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    });
  },
};
