import React, { Component } from 'react';
import myFirebase from '../../Firebase/firebaseInit';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      messages: [],
    };
  }


  handleSubmit = event => {
    event.preventDefault();
    const { name } = this.state;
    const messagesRef = myFirebase
      .database()
      .ref('messages/' + this.props.roomId);
    const message = {
      user: name,
      message: event.target.text.value,
    };
    messagesRef.push(message);
    event.target.text.value = ""
  };

  componentDidMount = () => {
    const name = prompt('Enter name:');
    this.setState({ name: name });
    const messagesRef = myFirebase
      .database()
      .ref('messages/' + this.props.roomId);
    let startListening = () => {
      messagesRef.on('child_added', snapshot => {
        let msg = snapshot.val();
        this.setState({ messages: [...this.state.messages, msg] });
      });
    };
    startListening();
  };

  render() {
    return (
      <div id="chat">
        <span id="username" >{this.state.name}</span>
        <form id="add-message" onSubmit={this.handleSubmit}>
          <input id="text" type="text" placeholder="Message" />
          <br />
          <button className="btn" type="submit" id="post">
            Post
          </button>
          <br />
        </form>
        {this.state.messages
          .slice(0)
          .reverse()
          .map((message, index) => (
            <h6 key={index} className={(index % 2 === 0 ? 'color1 message' : 'color2 message')}>
              {message.user}: {message.message}
            </h6>
          ))}
      </div>
    );
  }
}
