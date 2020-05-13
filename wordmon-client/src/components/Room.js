import React from 'react';
import { withRouter, Link, useHistory, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
// import { Socket, Event } from 'socket.io-client';
import axios from 'axios';
import './Room.css';
import ChatBox from './ChatBox';
import UserCard from './UserCard';

// import { Scrollbars } from 'react-custom-scrollbars';

// const renderThumb = ({ style, ...props }) => {
//     const thumbStyle = {
//       borderRadius: 6,
//       backgroundColor: '#ECDB54' 
//     };
//     return <div style={{ ...style, ...thumbStyle }} {...props} />;
//   };
  
//   const CustomScrollbars = props => (
//     <Scrollbars
//       renderThumbHorizontal={renderThumb}
//       renderThumbVertical={renderThumb}
//       {...props}
//     />
//   );

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: 20000,
      selfData: {},
      users: [],
      logs: [],
      msg: '',
      gameWord: '',
      word: '',
      isPlaying: false,
      isMyturn: false,
      backToMyPage: false,
    };
    this.resetTimer = this.resetTimer.bind(this);
    this.tickClock = this.tickClock.bind(this);
    this.backToMyPage = this.backToMyPage.bind(this);
    this.handleInputValue = this.handleInputValue.bind(this);
    this.handleWordInputValue = this.handleWordInputValue.bind(this);
    this.handleNewWordKeyUp = this.handleNewWordKeyUp.bind(this);
    this.chatMessageSend = this.chatMessageSend.bind(this);
  }
  resetTimer() {
    this.setState({
      timer: 20000,
    });
  }
  tickClock() {
    if (this.state.timer > 0) {
      this.setState({
        timer: this.state.timer - 1000,
      });
    } else {
      clearInterval(this.tick);
      alert('Game Over');
      if (this.state.isMyturn) {
        this.props.socket.emit('timeout');
      }
    }
  }
  backToMyPage() {
    if (this.state.isPlaying) {
      alert('팀플레이 중간에는 나갈 수 없습니다.');
    } else {
      this.props.socket.emit('leaveRoom');
      this.setState({
        backToMyPage: true,
      });
    }
  }
  handleInputValue(e) {
    this.setState({ msg: e.target.value });
  }
  handleWordInputValue(e) {
    this.setState({ word: e.target.value });
  }
  chatMessageSend(e) {
    if (e.key === 'Enter') {
      if (this.state.msg.length > 0) {
        this.props.socket.emit('sendMessage', {
          nickname: this.props.userinfo.nickname,
          msg: this.state.msg,
        });
        this.setState({
          msg: '',
        });
      }
    }
  }
  handleNewWordKeyUp(e) {
    //console.log(e.key);
    if (e.key === 'Enter') {
      console.log('엔터누름');
      let word = this.state.word;
      this.props.socket.emit('wordcheck', {
        word: word,
      });
      this.setState({
        word: '',
      });
    }
  }
  componentDidMount() {
    const tickClock = this.tickClock;
    this.props.socket.on('userData', (data) => {
      this.setState({
        users: data.usersArr,
      });
    });
    this.props.socket.on('selfData', (data) => {
      this.setState({
        selfData: data,
      });
    });
    this.props.socket.on('message', (data) => {
      let newLog = this.state.logs;
      newLog.push(data);
      if (newLog.length > 10) {
        newLog = newLog.slice(-10);
      }
      this.setState({
        logs: newLog,
      });
    });
    this.props.socket.on('gameStart', (data) => {
      this.setState({
        isPlaying: data.gameStart,
        gameWord: data.gameWord,
      });
      this.tick = setInterval(function() {
        tickClock();
      }, 1000);
    });
    this.props.socket.on('gameEnd', (data) => {
      this.setState({
        isPlaying: data.gameEnd,
        timer: 20000,
      });
      clearInterval(this.tick);
    });
    this.props.socket.on('turn', (data) => {
      this.setState({
        isMyturn: data.isMyturn,
        timer: 20000,
      });
    });
    this.props.socket.on('changeGameWord', (data) => {
      this.setState({
        gameWord: data.gameWord,
      });
    });
  }
  render() {
    if (this.state.backToMyPage) {
      return (
        <div>
          <Redirect to="mypage" />
        </div>
      );
    }
    return (
        // <center>
      <div>
          <center>
      <div id="roomHeader">
          <div>
      <Button
      id="roomToMypage" 
      className="backToMypage" 
      variant="outlined" 
      onClick={this.backToMyPage}
      >
        뒤로가기
     </Button>
     
     </div>
          <div id="teamPlayBanner">
          <h1 >팀플레이</h1>
          </div>

      </div>
      </center>

        <div id="userBox">
          <div id="playerTitle">플레이어 ({this.state.users.length}/4)</div>
          {this.state.users.map((user) => (
            <UserCard
              key={this.state.users.indexOf(user)}
              user={user}
              userinfo={this.state.selfData}
              socket={this.props.socket}
              isPlaying={this.state.isPlaying}
            />
          ))}
          {/* <UserBox
            userinfo={this.state.selfData}
            users={this.state.users}
            socket={this.props.socket}
            isPlaying={this.state.isPlaying}
          /> */}
        </div>
        {/* <br></br>
        <br></br> */}
        <div id="playBox" className={this.state.isPlaying ? 'notReady' : 'playing'}/*className={this.state.isPlaying ? '' : 'hidden'}*/>
          <h1>
            {this.state.isPlaying ?
            `${' '}
            현재 제시어 : ${this.state.gameWord} / 남은 시간 :${' '}
            ${this.state.timer / 1000}` :
            "Ready 버튼을 눌러주세요"
            }
          </h1>
            <div>
              <input
                id="wordInput"
                disabled={this.state.isMyturn ? false : true }
                placeholder= {this.state.isMyturn ? "단어를 입력해주세요" : "" }
                value={this.state.word}
                onChange={this.handleWordInputValue}
                onKeyPress={this.handleNewWordKeyUp}
              ></input>
            </div>
          {/* {this.state.isMyturn ? (
            <div>
              <input
                id="wordInput"
                placeholder= "단어적기"
                value={this.state.word}
                onChange={this.handleWordInputValue}
                onKeyPress={this.handleNewWordKeyUp}
              ></input>
            </div>
          ) : null} */}
        </div>
        {/* <br></br> */}
        <ChatBox logs={this.state.logs}></ChatBox>
        <div id="chatInputBox">
          {/* <span> */}
            <input
              id="chatInput"
              placeholder="채팅을 입력하세요"
              value={this.state.msg}
              onChange={this.handleInputValue}
              onKeyPress={this.chatMessageSend}
            ></input>
          {/* </span> */}
        </div>
      </div>
    //   </center>
    );
  }
}

const mapStateToProps = (state) => {
    return {
      isLogin: state.login.isLogin,
      userinfo: state.login.userinfo,
    };
  };

  
  Room = connect(mapStateToProps)(Room);

export default withRouter(Room);