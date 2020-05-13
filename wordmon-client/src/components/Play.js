import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { Button } from '@material-ui/core';
import Rainbowfy from 'react-rainbowfy';
import '../App.css';
import './Play.css';

import {
  tickClock,
  setTimerID,
  requestWordCheck,
  resetTimer,
  updateHighestScore,
} from '../actions/playActions';

axios.defaults.withCredentials = true;

class Play extends React.Component {
  constructor(props) {
    super(props);
    this.handleNewWordKeyUp = this.handleNewWordKeyUp.bind(this);
  }

  handleNewWordKeyUp(e) {
    if (this.props.timer > 0 && e.keyCode === 13) {
      if (e.target.value.length < 2) {
        e.target.value = '';
        return;
      }
      let updateWord = e.target.value;
      const updatedWordChain = this.props.wordChain;
      // 게임 시작하고 첫 단어도 사용자가 지정해서 시작하는 중 (첫글자 체크를 안함)
      if (updatedWordChain.length === 0) {
        this.props.requestWordCheck(updateWord);
      } else {
        // 첫글자 체크를 하고 워드체인에 추가함
        const latestWord = updatedWordChain[updatedWordChain.length - 1];
        if (
          // 첫글자랑 끝글자가 맞는지 확인
          !updatedWordChain.includes(updateWord) &&
          updateWord[0] === latestWord[latestWord.length - 1]
        ) {
          this.props.requestWordCheck(updateWord);
        }
      }
      e.target.value = '';
    }
  }

  componentDidMount() {
    const tickClock = this.props.tickClock;
    const timerID = setInterval(function() {
      tickClock();
    }, 1000);
    this.props.setTimerID(timerID);
  }

  render() {
    if (this.props.timer === 0) {
      clearInterval(this.props.timerID);
      if (this.props.currentScore > this.props.oldhighestScore) {
        this.props.updateHighestScore(this.props.currentScore);
      }
    }
    return (
      <center>
        <div>
          <div id="modal" className={this.props.timer === 0 ? '' : 'hidden'}>
            <div className="modal-content">
              <p className="bold">Game Over</p>
              <Rainbowfy>
                <div
                  className={
                    this.props.currentScore > this.props.oldhighestScore
                      ? 'newHighestScore rainbow'
                      : 'hidden'
                  }
                >
                  축하합니다! 최고 기록을 경신했습니다!
                </div>
              </Rainbowfy>
              <Link to="/mypage">
                <Button className="backToMypage" variant="outlined">
                  뒤로가기
                </Button>
              </Link>
            </div>
          </div>
          <h1>개인플레이</h1> {/*className="playHeader"*/}
          <div className="playInfo">
            <div className="scoreBoard">
              <div id="currentScore">
                <span>현재 점수:</span>
                <span
                  className={
                    this.props.currentScore > this.props.oldhighestScore
                      ? 'red'
                      : ''
                  }
                >
                  {this.props.currentScore}
                </span>
              </div>

              <div id="highestScore">
                <span>최고 점수:</span>
                <span>{this.props.oldhighestScore}</span>
              </div>
            </div>

            <div id="progress">
              <span id="timeLeft" className="innerBox">
                남은 시간: {this.props.timer / 1000} 초
              </span>
              <form />
              <span id="saySomething">
                <label className="innerBox" htmlFor="newChain">
                  말씀을 좀 해보세요:
                </label>
                <input
                  id="newChain"
                  type="text"
                  onKeyUp={this.handleNewWordKeyUp}
                ></input>
              </span>
            </div>
          </div>
          <div className="wordChain">
            {this.props.wordChain.map((word) => (
              <span className={this.props.wordChain.indexOf(word) === this.props.wordChain.length - 1 ? "lastWord" : "chain"}>{word}</span>
            ))}
          </div>
        </div>
      </center>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    oldhighestScore: state.login.userinfo.score,
    timer: state.play.timer,
    timerID: state.play.timerID,
    wordChain: state.play.wordChain,
    currentWord: state.play.currentWord,
    currentScore: state.play.currentScore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    tickClock: () => dispatch(tickClock()),
    resetTimer: () => dispatch(resetTimer()),
    setTimerID: (id) => dispatch(setTimerID(id)),
    requestWordCheck: (newWord) => dispatch(requestWordCheck(newWord)),
    updateHighestScore: (score) => dispatch(updateHighestScore(score)),
  };
};

Play = connect(mapStateToProps, mapDispatchToProps)(Play);

export default withRouter(Play);
