import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import './ChatBox.css';

const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      borderRadius: 6,
      backgroundColor: '#ECDB54' 
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };
  
  const CustomScrollbars = props => (
    <Scrollbars
      renderThumbHorizontal={renderThumb}
      renderThumbVertical={renderThumb}
      {...props}
    />
  );

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: '',
    };
  }
  // 컴포넌트가 마운트 됐을 때
  componentDidMount() {
    // 서버로부터 메세지가 오는 것을 실시간으로 받음
    /* 메세지는 쓴 사람하고 내용이 있는 객체
        let newMsg = {
            nickname: "닉네임",
            massage: "안녕하세요"
        }*/
    // this.state.logs는 받은 메세지들,,
  }
  render() {
    let messages = this.props.logs.map((msg) => (
    //   <div>
        <div className="chatBubble">
          {msg.nickname} : {msg.msg}
        </div>
    //   </div>
    ));
    return (
      <div id="chat" className="chatBox">
          <CustomScrollbars >
        <div >{messages}</div>
        </CustomScrollbars>
      </div>

    );
  }
}
export default ChatBox;
