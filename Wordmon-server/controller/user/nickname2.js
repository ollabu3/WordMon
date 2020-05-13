const { users } = require('../../models');
const urlencode = require('urlencode'); // 인코딩 모듈

// 닉네임 중복검사
module.exports = {
  get: (req, res) => {
    let nickname = urlencode.decode(req.params.nickname);
    // console.log(nickname);
    users
      .findOne({
        where: { nickname: nickname },
      })
      .then((data) => {
        if (!data) {
          res.status(200).send(true);
        } else {
          res.status(200).send(false);
        }
      });
  },
};
