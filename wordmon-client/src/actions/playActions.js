import axios from 'axios';

import { updateUserInfo } from './loginActions';

export const TICK_CLOCK = 'TICK_CLOCK';
export const SET_TIMER_ID = 'SET_TIMER_ID';
export const REQUEST_WORD_CHECK = 'REQUEST_WORD_CHECK';
export const PUSH_NEW_WORD = 'PUSH_NEW_WORD';
export const RESET_TIMER = 'RESET_TIMER';
export const UPDATE_WORD_CHAIN = 'UPDATE_WORD_CHAIN';

export function tickClock() {
  return {
    type: TICK_CLOCK,
  };
}

export function requestWordCheck(newWord) {
  return (dispatch) => {
    axios
      .post('http://localhost:4000/word', { word: newWord })
      .then((response) => {
        if (response.data) {
          dispatch(pushNewWord(newWord));
          dispatch(resetTimer());
          dispatch(updateWordChain());
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
}

export function pushNewWord(word) {
  return {
    type: PUSH_NEW_WORD,
    word: word,
  };
}

export function setTimerID(id) {
  return {
    type: SET_TIMER_ID,
    timer_id: id,
  };
}

export function resetTimer() {
  return {
    type: RESET_TIMER,
  };
}

export function updateWordChain() {
  return {
    type: UPDATE_WORD_CHAIN,
  };
}

// score가 갱신되면
export function updateHighestScore(score) {
  return (dispatch) => {
    // console.log(this.props);
    console.log(score);
    // const newHighscore = JSON.stringify({
    //   score: this.props.currentScore,
    // });
    // 서버에 갱신된 점수로 수정을 요청
    axios
      .post('http://localhost:4000/user/modify', {
        score: JSON.stringify(score),
      })
      .then((res) => {
        console.log('highest score updated!');
        console.log(res);
        dispatch(updateUserInfo());
        //this.props.updateUserInfo();
      })
      .catch((err) => console.log(err));
  };
}
