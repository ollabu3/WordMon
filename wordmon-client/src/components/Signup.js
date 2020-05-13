import React from 'react';
import { connect } from 'react-redux';

import {
  requestCheckNickName,
  requestSignup,
  closeSignupModal,
} from '../actions/signupActions';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: '',
    };
  }

  render() {
    let nicknameCheckResult = null;
    if (!this.state.nickname.length) {
      nicknameCheckResult = (
        <div>
          <br></br>
        </div>
      );
    } else if (!this.props.stillNeedSignup) {
      nicknameCheckResult = (
        <div> {this.state.nickname} : 사용가능한 닉네임입니다.</div>
      );
    } else if (this.props.stillNeedSignup) {
      nicknameCheckResult = (
        <div>{this.state.nickname} : 이미 등록된 닉네임입니다.</div>
      );
    }

    return (
      <div id="modal">
        <div className="modal-content">
          <div>워드몬에 오신 것을 환영합니다.</div>

          <form
            id="signupform"
            onSubmit={this.props.requestCheckNickName(this.state.nickname)}
          >
            <label htmlFor="nicknameInput">
              사용하고자 하는 닉네임을 입력하세요.
            </label>
            <input
              id="nicknameInput"
              type="text"
              placeholder="닉네임"
              value={this.state.nickname}
              onChange={function(e) {
                this.setState({ nickname: e.target.value });
              }.bind(this)}
            ></input>

            {/*<button type="submit" >중복검사</button>*/}
            {nicknameCheckResult}
          </form>

          <button
            onClick={
              this.props.stillNeedSignup
                ? () => {
                    alert('닉네임중복검사나해라');
                  }
                : () => {
                    this.props.requestSignup(
                      this.props.tempToken,
                      this.state.nickname,
                    );
                  }
            }
          >
            가입완료
          </button>
          <button onClick={this.props.closeSignupModal}>창닫기</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    stillNeedSignup: state.signup.stillNeedSignup,
    tempToken: state.login.tempToken,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    requestCheckNickName: (nickname) =>
      dispatch(requestCheckNickName(nickname)),
    requestSignup: (t, n) => dispatch(requestSignup(t, n)),
    closeSignupModal: () => dispatch(closeSignupModal()),
  };
};

Signup = connect(mapStateToProps, mapDispatchToProps)(Signup);

export default Signup;
