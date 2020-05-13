import React from 'react';
import { Link, Route, withRouter, Redirect } from 'react-router-dom';
import axios from 'axios';
import GoogleLogin from 'react-google-login';
import { connect } from 'react-redux';
import Rainbowfy from 'react-rainbowfy';

import './Login.css';
import '../App.css';
import Signup from './Signup';
import { requestLogin, updateUserInfo } from '../actions/loginActions';
import { handleLoginSuccess } from '../actions/loginActions';

axios.defaults.withCredentials = true;
// `withCredentials` indicates whether or not cross-site Access-Control requests
// should be made using credentials

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (e) => {
    this.setState({
      nickNameInput: e.target.value,
    });
  };

  render() {
    if (this.props.isLogin) {
      return (
        <div>
          <Redirect to="/mypage" />;
        </div>
      );
    } else {
      return (
        <div className="loginPage">
          <center>
            <Rainbowfy>
              <h1 id="main">일어나 워드몬 해야지</h1>
            </Rainbowfy>

            <GoogleLogin
              clientId="543940618752-ngublacb476a1q4or68knsajp0so6e37.apps.googleusercontent.com" //OAuth2에서 받은, wordmon-client를 위한 client ID
              // render={renderProps => (
              //   <button onClick={renderProps.onClick} disabled={renderProps.disabled} style={style}>구글로 로그인</button>
              // )}
              onSuccess={(result) => {
                console.log(result);
                this.props.requestLogin(result);
              }}
              onFailure={(err) => console.log(err)}
            />

            {this.props.isNeedSignup ? <Signup /> : null}
          </center>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    isNeedSignup: state.login.isNeedSignup,
    nickNameInput: state.signup.nickNameInput,
    nickname: state.signup.nickname,
    isNickNameUnique: state.signup.isNickNameUnique,
    tempToken: state.login.tempToken,
    isLogin: state.login.isLogin,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleLoginSuccess: () => {
      dispatch(handleLoginSuccess());
    },
    requestLogin: (result) => dispatch(requestLogin(result)),
    updateUserInfo: () => dispatch(updateUserInfo()),
  };
};

Login = connect(mapStateToProps, mapDispatchToProps)(Login);

export default withRouter(Login);
