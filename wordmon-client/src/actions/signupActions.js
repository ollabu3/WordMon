import axios from 'axios';
import urlencode from 'urlencode';
import { updateUserInfo } from './loginActions';

export const REQUEST_CHECK_NICKNAME = 'REQUEST_CHECK_NICKNAME';
export const CLOSE_SIGNUP_MODAL = 'CLOSE_SIGNUP_MODAL';
export const SIGNUP_NICKNAME = 'SIGN_UP_NICKNAME';
export const DONT_SIGNUP_NICKNAME = 'DONT_SIGNUP_NICKNAME';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';

// 닉네임 중복검사 서버요청
export function requestCheckNickName(nickname) {
  return (dispatch) => {
    //e.preventDefault(); //없애도 되는건지..
    let encodedNickname = urlencode(nickname);
    axios
      .get(`http://localhost:4000/user/${encodedNickname}`)
      .then((isUnique) => {
        console.log(isUnique);
        if (isUnique.data) {
          dispatch(signUpNickname(nickname));
        } else {
          dispatch(dontSignUpNickname(nickname));
        }
      });
  };
}

// 회원가입 서버요청
export function requestSignup(token, nickname) {
  console.log('signup requested!');
  return (dispatch) => {
    //이하 작동확인 안됨. 토큰 있어서 새로 회원가입 안됨.
    axios
      .post('http://localhost:4000/user/signup', {
        googleIdToken: token,
        nickname: nickname,
      })
      .then(() => {
        // 회원가입성공하면 그냥 로그인해주자
        alert('회원가입이 완료되었습니다.');
        axios
          .post('http://localhost:4000/user/signin', {
            googleIdToken: token,
          })
          .then(() => {
            dispatch(updateUserInfo());
          });
      });
  };
}

export function signUpNickname(nickname) {
  console.log('sign up nickname');
  return {
    type: SIGNUP_NICKNAME,
    nickname: nickname,
  };
}

export function dontSignUpNickname(nickname) {
  console.log('nickname already exists!');
  return {
    type: DONT_SIGNUP_NICKNAME,
    nickname: nickname,
  };
}

export function closeSignupModal() {
  return {
    type: CLOSE_SIGNUP_MODAL,
  };
}
