import React, { Component } from 'react';
import myFirebase from '../../Firebase/firebaseInit';

class ChatHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      color: this.props.color
    }
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.color !== this.props.color) {
      this.setState({
        color: this.props.color
      })
    }
  }

  handleChange = evt => {
    this.setState({
      message: evt.target.value,
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const messagesRef = myFirebase
      .database()
      .ref('messages/' + this.props.roomId);
    let messageTime = this.getCurrentTime();
    const message = {
      user: this.props.name,
      message: event.target.text.value,
      color: this.props.color,
      time: messageTime
    };
    messagesRef.push(message);
    event.target.text.value = ""
  };

  messagesRef = myFirebase
    .database()
    .ref('messages/' + this.props.roomId);

  getCurrentTime = () => {
    let time = new Date().toUTCString().slice(-12, -4).split(':');
    let meridian;
    if (time[0] - 5 >= 12) meridian = 'PM'
    else meridian = 'AM'
    time[0] = (+time[0] - 5 - 1) % 12 + 1;
    time = time.join(':') + meridian;
    return time
  }

  render(props) {
    return (
      <div>
        <div id="chat-header">
          <h5>{this.props.name}:</h5>
          <form id="add-message" onSubmit={this.handleSubmit}>
            <input id="text" type="text" placeholder="Message" onChange={this.handleChange} />
            <button className="btn" type="submit" id="post" disabled={this.state.message.length < 1}>
              Post
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default ChatHeader;
