import React from 'react';
import '../App.css';
import './Mypage.css';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, withStyles } from '@material-ui/core'; //import Button from '@material-ui/core/Button'; 이렇게 쓰는거랑 동일
import CreateIcon from '@material-ui/icons/Create';

import { handleLogOut, updateUserInfo } from '../actions/loginActions';
import { addCustomer } from '../actions/mypageActions';

axios.defaults.withCredentials = true;

const RainbowButton = withStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', 
    '&:hover': {
      background: '#ECDB54',
    },
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 30px',
  },
})(Button);

class Mypage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isNicknameEditing: false, //확인
      file: null,
      fileName: '파일을 선택하세요',
      bin: '', //확인
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleClickGameStart = this.handleClickGameStart.bind(this);
  }

  handleClickGameStart() {
    axios.get('http://localhost:4000/roomopen').then((res) => {
      if (res.data) {
        this.props.socket.emit('join', this.props.userinfo);
        return <Redirect to="/room" />;
        // this.setState({
        //   moveToRoom: true,
        // });
        //this.props.socket.emit('join', this.props.userinfo);
      } else {
        alert('방이 가득찼습니다.');
      }
    });
  }

  handleFileChange(e) {
    this.setState({
      file: e.target.files[0],
      fileName: e.target.value,
    });
  }

  handleFormSubmit(e) {
    e.preventDefault();
    this.props.addCustomer(this.state.file).then(() => {this.props.updateUserInfo()});
  }

  componentDidMount() {
    this.props.updateUserInfo();
  }

  render() {
    let imageUrl = `http://localhost:4000${this.props.userinfo.profileImg}`;
    if (this.props.isLogin) {
      return (
        <center>
          <h1>마이페이지</h1>
          <div className="user_card">
            <img id="profile_image" src={imageUrl} />
            <form onSubmit={this.handleFormSubmit}>
              <span id="choose_file">{this.state.fileName}</span>
              <span id="upload-border">
                <span>
                  <input
                    type="file"
                    class="custom-file-input"
                    name="file"
                    file={this.props.file}
                    value={this.props.fileName}
                    onChange={this.handleFileChange}
                  />
                </span>
                <span>
                  <button type="submit" class="upload-button">
                    저장
                  </button>
                </span>
              </span>
            </form>
            <div id="nicknameContainer">
            <div id="nickname" className="bold">
              닉네임: {this.props.userinfo.nickname}
            </div>
            <div id="changeNickname">
            {/* <CreateIcon onClick={()=>{console.log('click')}}/> */}
            </div>
            
            </div>
            <div className="highestScore bold">
              최고점수: {this.props.userinfo.score}
            </div>
            <br></br>
            <Link to="/play">
              <RainbowButton
                className="myPageButton"
              >
                개인플레이
              </RainbowButton>
              <br></br>
              <Link to="/room">
              <RainbowButton
              id="teamPlayButton" 
              className="myPageButton"
              onClick={this.handleClickGameStart}>
                팀플레이
              </RainbowButton>
              </Link>

            </Link>
            <br></br>
            <Link to="/login">
              <Button
                id="logoutButton"
                className="myPageButton"
                variant="outlined"
                onClick={this.props.onLogOut}
              >
                로그아웃
              </Button>
            </Link>
          </div>
        </center>
      );
    } else {
      return (
        <div>
          <h1>NOT FOUND</h1>
        </div>
      );
    }
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
    addCustomer: (file) => dispatch(addCustomer(file)),
    onLogOut: () => dispatch(handleLogOut()),
  };
};

Mypage = connect(mapStateToProps, mapDispatchToProps)(Mypage);

export default Mypage;
