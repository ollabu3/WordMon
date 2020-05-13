import React from 'react';
import './UserCard.css';

class UserCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
    };
    this.clickEvent = this.clickEvent.bind(this);
    this.clickEvent2 = this.clickEvent2.bind(this);
  }
  clickEvent() {
    this.props.socket.emit('ready', {
      ready: true,
    });
  }
  clickEvent2() {
    this.props.socket.emit('ready', {
      ready: false,
    });
  }
  render() {
    const imgStyle = {
      width: '80px',
      height: '80px',
      marginTop: '10px',
      borderRadius: '100%',
      marginBottom: '5px'
    };
    let button;
    this.props.user.ready
      ? (button = <button className="startButton" onClick={this.clickEvent2}>Let's Start!</button>)
      : (button = <button className="readyButton" onClick={this.clickEvent}>Ready?</button>);
    return (
      <div
        className={
          this.props.userinfo.nickname === this.props.user.nickname
            ? "myStyle"
            : "otherStyle"
        }
      >
        <img
          style={imgStyle}
          src={`http://localhost:4000${this.props.user.profileImg}`}
        />
        <div>{this.props.user.nickname}</div>
        <div>최고 점수 : {this.props.user.score}</div>
        {this.props.isPlaying ? null : button}
      </div>
    );
  }
}

export default UserCard;