import {
  CLOSE_SIGNUP_MODAL,
  SIGNUP_NICKNAME,
  DONT_SIGNUP_NICKNAME,
  SIGNUP_SUCCESS,
} from '../actions/signupActions.js';

const initialState = {
  stillNeedSignup: false,
  nickNameInput: '',
  nickname: '',
  isNickNameUnique: undefined,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CLOSE_SIGNUP_MODAL:
      return Object.assign({}, state, { isNeedSignup: false });
    case SIGNUP_NICKNAME:
      return Object.assign({}, state, {
        stillNeedSignup: false,
        isNickNameUnique: true,
        nickname: action.nickname,
        nickNameInput: '',
      });
    case DONT_SIGNUP_NICKNAME:
      console.log('I said dont sign up!');
      return Object.assign({}, state, {
        stillNeedSignup: true,
        isNickNameUnique: false,
        nickname: action.nickname,
        nickNameInput: '',
      });
    case SIGNUP_SUCCESS:
      return Object.assign({}, state, { justadded: 0 });
    default:
      return state;
  }
};

export default reducer;
