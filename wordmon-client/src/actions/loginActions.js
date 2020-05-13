import axios from 'axios';
import React from 'react';
import { Redirect } from 'react-router-dom';

export const SET_TEMP_TOKEN = 'SET_TEMP_TOKEN';
export const OPEN_SIGNUP_MODAL = 'OPEN_SIGNUP_MODAL';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
export const STAY_LOGGED_IN = 'STAY_LOGGED_IN';
export const SET_USER_INFO = 'SET_USER_INFO';
export const UPDATE_PROFILE_IMG = 'UPDATE_PROFILE_IMG';
export const FORCE_LOG_OUT = 'FORCE_LOG_OUT'

axios.defaults.withCredentials = true;
// `withCredentials` indicates whether or not cross-site Access-Control requests
// should be made using credentials

export function requestLogin(result) {
  console.log(result);
  return (dispatch) => {
    dispatch(setTempToken(result));
    axios
      .post('http://localhost:4000/user/signin', {
        googleIdToken: result.tokenObj['id_token'],
      })
      .then((response) => {
        console.log('서버요청결과', response);
        // 서버에서 구글에 한번 더 요청을 보내서 좀 느림ㅜ 5초는 걸리는 느낌..
        if (response.status === 202) {
          alert('회원가입이 필요합니다.');
          dispatch(openSignupModal());
        } else if (response.status === 200) {
          // 로그인 성공
          //dispatch(openSignupModal()); //실험용
          dispatch(updateUserInfo()); //살려야
          return <Redirect to="/mypage" />; //살려야 this.props.history.push('/mypage'); 대신
        }
      });
  };
}

export function setTempToken(result) {
  return {
    type: SET_TEMP_TOKEN,
    tempToken: result.tokenObj['id_token'],
  };
}

export function openSignupModal() {
  return {
    type: OPEN_SIGNUP_MODAL,
  };
}

export function handleLoginSuccess(result) {
  return {
    type: LOGIN_SUCCESS,
  };
}

export function handleLogOut() {
  return (dispatch) => {
    // dispatch(setTempToken(result));
    axios
      .post('http://localhost:4000/user/signout')
      .then(() => {
        dispatch(makeLogOut())
      });
  };
}

export function makeLogOut() {
  return {
    type: LOGOUT,
  };
}

export function updateUserInfo() {
  console.log('getting user info...');
  return (dispatch) => {
    // dispatch(stayLoggedIn());
    axios
      .get('http://localhost:4000/user/info')
      .then((res) => {
        if (res.data === 'no') {
          dispatch(forceLogOut())
        } else {
          dispatch(stayLoggedIn());
          dispatch(setUserInfo(res.data));
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
}

export function forceLogOut() {
  return {
    type: FORCE_LOG_OUT,
  }
}

export function stayLoggedIn() {
  console.log('I am logged in');
  return {
    type: STAY_LOGGED_IN,
  };
}

export function setUserInfo(user) {
  return {
    type: SET_USER_INFO,
    payload: user,
  };
}

export function getProfileImg(user) {
  return (dispatch) => {
    dispatch(updateProfileImg(`http://localhost:4000${user}`));
  };
}

export function updateProfileImg(img) {
  return {
    type: UPDATE_PROFILE_IMG,
    profileImg: img,
  };
}
