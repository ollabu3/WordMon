import {} from '../actions/mypageActions.js';

const initialState = {
  isNicknameEditing: false,
  file: null,
  fileName: '',
  bin: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default reducer;
