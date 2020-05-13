import {
  TICK_CLOCK,
  SET_TIMER_ID,
  PUSH_NEW_WORD,
  RESET_TIMER,
  UPDATE_WORD_CHAIN,
} from '../actions/playActions.js';

const initialState = {
  timer: 20000,
  timerID: null,
  isPlaying: true,
  wordChain: [],
  currentWord: '',
  currentScore: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TICK_CLOCK:
      return Object.assign({}, state, { timer: state.timer - 1000 });
    case SET_TIMER_ID:
      return Object.assign({}, state, { timerID: action.timer_id });
    case PUSH_NEW_WORD:
      return { ...state, wordChain: [...state.wordChain, action.word] };
    case RESET_TIMER:
      return Object.assign({}, state, { timer: 20000 });
    case UPDATE_WORD_CHAIN:
      return Object.assign({}, state, {
        currentScore: state.wordChain.length * 7,
      });
    default:
      return state;
  }
};

export default reducer;
