import {
  SET_TEMP_TOKEN,
  OPEN_SIGNUP_MODAL,
  LOGIN_SUCCESS,
  SET_USER_INFO,
  STAY_LOGGED_IN,
  LOGOUT,
  UPDATE_PROFILE_IMG,
  FORCE_LOG_OUT,
} from '../actions/loginActions.js';

import { CLOSE_SIGNUP_MODAL } from '../actions/signupActions.js';

const initialState = {
  isNeedSignup: false,
  tempToken: '',
  isLogin: false,
  userinfo: {
    profileImg: null,
    nickname: '',
    score: 0,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TEMP_TOKEN:
      return Object.assign({}, state, { tempToken: action.tempToken });
    case OPEN_SIGNUP_MODAL:
      return Object.assign({}, state, { isNeedSignup: true });
    case CLOSE_SIGNUP_MODAL:
      return Object.assign({}, state, { isNeedSignup: false });
    case LOGIN_SUCCESS:
      return Object.assign({}, state, { isLogin: true });
    case 'STAY_LOGGED_IN':
      return Object.assign({}, state, { isLogin: true });
    case FORCE_LOG_OUT:
      return Object.assign({}, state, { isLogin: false });
    case LOGOUT:
      return Object.assign({}, state, { isLogin: false });
    case SET_USER_INFO:
      const newState = {
        isLogin: true,
        userinfo: {
          nickname: action.payload.nickname,
          profileImg: action.payload.profileImg,
          score: action.payload.score,
        },
      };
      return Object.assign({}, state, newState);
    default:
      return state;
  }
};

export default reducer;
