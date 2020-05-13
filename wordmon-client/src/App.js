import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import socketio from 'socket.io-client';

import './App.css';
import Login from './components/Login';
import Mypage from './components/Mypage';
import Play from './components/Play';
import Room from './components/Room';

import { updateUserInfo } from './actions/loginActions';

var socket = socketio.connect('http://localhost:4000/room', {
  transports: ['websocket'],
})

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // 새로고침하면 state 초기화 되서 로그인 유지시키는 용
    this.props.updateUserInfo();
  }

  render() {
    const { isLogin } = this.props;
    return (
      <div>
        <Switch>
          <Route exact path="/login" render={() => <Login />} />
          <Route exact path="/mypage" render={() => <Mypage socket={socket} />} />
          <Route exact path="/room" render={() => <Room socket={socket}/>} />
          <Route
            exact
            path="/play"
            render={() => {
              if (isLogin) {
                return <Play />;
              } else {
                return <Redirect to="/login" />;
              }
            }}
          />
          <Route
            path="/"
            render={() => {
              if (isLogin) {
                return <Redirect to="/mypage" />;
              } else {
                return <Redirect to="/login" />;
              }
            }}
          />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLogin: state.login.isLogin,
    userinfo: state.login.userinfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserInfo: () => dispatch(updateUserInfo()),
  };
};

App = connect(mapStateToProps, mapDispatchToProps)(App);

export default App;
