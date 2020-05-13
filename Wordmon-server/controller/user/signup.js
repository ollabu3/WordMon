const { users } = require('../../models');
const axios = require('axios');

module.exports = {
  post: (req, res) => {
    let { googleIdToken, nickname } = req.body;
    let clientEmail;

    axios
      .get(`https://oauth2.googleapis.com/tokeninfo?id_token=${googleIdToken}`)
      .then((response) => {
        console.log('구글에 요청을 보내고 응답을 받음');
        if (response.status === 200) {
          // 구글토큰으로 이메일을 교환하고 교환한 이메일로 사용자 DB를 확인한다.
          clientEmail = response.data.email;
          users
            .findOrCreate({
              defaults: {
                nickname: nickname,
                score: 0,
              },
              where: { googleEmail: clientEmail },
            })
            .then((result) => {
              if (result[0]._options.isNewRecord) {
                res.send(result[0].dataValues);
              } else {
                res.status(409).send('Already exists user');
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
  },
};
