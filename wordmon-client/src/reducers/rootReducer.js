import { combineReducers } from 'redux';

import loginReducer from './loginReducer';
import playReducer from './playReducer';
import mypageReducer from './mypageReducer';
import signupReducer from './signupReducer';

const rootReducer = combineReducers({
  login: loginReducer,
  signup: signupReducer,
  mypage: mypageReducer,
  play: playReducer,
});

export default rootReducer;
