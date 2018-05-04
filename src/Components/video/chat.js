import React, { Component } from 'react';
import myFirebase from '../../Firebase/firebaseInit';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      messages: [],
      users: [],
    };
  }


  handleSubmit = event => {
    event.preventDefault();
    const { name } = this.state;
    let time = new Date().toUTCString().slice(-12,-4).split(':');
    time[0] = (+time[0] + 7) % 12;
    time = time.join(':');
    const messagesRef = myFirebase
      .database()
      .ref('messages/' + this.props.roomId);
    const message = {
      user: name,
      message: event.target.text.value,
      time
    };
    messagesRef.push(message);
    event.target.text.value = ""
  };

  componentDidMount = () => {
    const name = prompt('Enter name:');
    this.setState({ name: name });
    //add user to database and listen for additional users
    const usersRef = myFirebase.database().ref('users/' + this.props.roomId)
    // usersRef.push(user);
    let startListeningUsers = () => {
      usersRef.on('child_added', snapshot => {
        let user = snapshot.val();
        const message = {
          message: `${name} has entered the theatre`
        }
        this.setState({
          users: [...this.state.users, user],
          messages: [...this.state.messages, message]
        });
      });
    };
    startListeningUsers();
    myFirebase.database().ref('users/' + this.props.roomId + '/' + name).set({name});
    //listen for messages and change state
    const messagesRef = myFirebase
      .database()
      .ref('messages/' + this.props.roomId);
    let startListeningMessages = () => {
      messagesRef.on('child_added', snapshot => {
        let msg = snapshot.val();
        this.setState({ messages: [...this.state.messages, msg] });
      });
    };
    startListeningMessages();
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
        <h1>Participants</h1>
        {this.state.users
          .map((user, index) => (
            <h1 key={index}>
              {user.name}
            </h1>
          ))}
        {this.state.messages
          .slice(0)
          .reverse()
          .map((message, index) => (
            <h6 key={index} className={(index % 2 === 0 ? 'color1 message' : 'color2 message')}>
              {message.user} ({message.time}): {message.message}
            </h6>
          ))}
      </div>
    );
  }
}
