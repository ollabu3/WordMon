// 사전 API 사용해서 단어 검사하기
// 사전에 등록된 기본형 단어만 허용
// 요청 - 확인할 단어
// 응답 - 사전에 등재된 단어인 경우 ture / 사전에 등재되지 않은 단어인 경우 false
// 이걸 둘 다 응답코드 200대로 주는 것이 맞나?
// 이거는 GET? GET이면 body가 없으니까
// POST로 받는 게 맞는 것 같음

const axios = require('axios');
const urlencode = require('urlencode'); // 한글 인코딩 모듈
// const makejson = require('xml-js'); // 사용이 잘 안되서 xml2js로 갈아탐
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
let dictionaryAPIKey = '74D757363482A19CE2C86BB713EDF0DF';

module.exports = {
  post: (req, res) => {
    let query = req.body.word;
    let word = urlencode(query); //word는 query를 인코딩한 것
    let response = false;
    axios
      .get(
        `https://krdict.korean.go.kr/api/search?certkey_no=1270&key=${dictionaryAPIKey}&type_search=search&method=WORD_INFO&part=word&q=${word}&sort=dict`,
      )
      .then((xml) => {
        // console.log(xml)
        parser.parseString(xml.data, (err, result) => {
          // console.log(result)
          if (result.channel.total[0] === '0') {
            console.log('단어가 없습니다.');
          } else {
            result.channel.item.some((element) => {
              //console.log(element.word)
              console.log(element.word);
              if (element.word[0] === query) {
                response = true;
                return element.word[0] === query;
              }
            });
          }
          res.status(200).send(response);
        });
      });
  },
};

// function checkDic(query) {
//   // let query = req.body.word;
//   let word = urlencode(query); //word는 query를 인코딩한 것
//   let response = false;
//   // axios.get('https://krdict.korean.go.kr/api/search?certkey_no=1270&key=74D757363482A19CE2C86BB713EDF0DF&type_search=search&method=WORD_INFO&part=word&q=%EC%A6%90%EA%B2%81%EB%8B%A4&sort=dict')
//   // .then(result=> console.log(result))
//   axios
//     .get(
//       `https://krdict.korean.go.kr/api/search?certkey_no=1270&key=${dictionaryAPIKey}&type_search=search&method=WORD_INFO&part=word&q=${word}&sort=dict`,
//     )
//     .then((xml) => {
//       // console.log(xml)
//       parser.parseString(xml.data, (err, result) => {
//         // console.log(result)
//         if (result.channel.total[0] === '0') {
//           console.log('단어가 없습니다.');
//         } else {
//           result.channel.item.some((element) => {
//             //console.log(element.word)
//             console.log(element.word);
//             if (element.word[0] === query) {
//               response = true;
//               return element.word[0] === query;
//             }
//           });
//         }
//         console.log(response);
//       });
//     });
// }
//checkDic('푸른');
