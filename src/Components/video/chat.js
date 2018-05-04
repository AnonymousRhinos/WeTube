import React, { Component } from 'react';
import myFirebase from '../../Firebase/firebaseInit';
import { withRouter } from 'react-router';
import colors from '../../colors.js';

export class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      messages: [],
      color: '',
      users: [],
    };
  }


  handleSubmit = event => {
    event.preventDefault();
    const { name, color } = this.state;
    let time = new Date().toUTCString().slice(-12, -4).split(':');
    time[0] = (+time[0] + 7) % 12;
    time = time.join(':');
    const messagesRef = myFirebase.database().ref('messages/' + this.props.roomId);
    const message = {
      user: name,
      message: event.target.text.value,
      color: color,
      time
    };
    messagesRef.push(message);
    event.target.text.value = ""
  };

  componentDidMount = () => {
    let time = new Date().toUTCString().slice(-12, -4).split(':');
    time[0] = (+time[0] + 7) % 12;
    time = time.join(':');
    const name = prompt('Enter name:');
    const color = this.establishColor(colors);
    this.setState({ name: name, color: color });

    if (name) {
      myFirebase.database().ref('users/' + this.props.roomId + '/' + name).set({ name, time });
      const joinRef = myFirebase.database().ref('messages/' + this.props.roomId);
      const message = {
        user: name,
        message: `${name} has entered the theatre`,
        time
      };
      joinRef.push(message);
    }

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

    //listen for users and change state
    const usersRef = myFirebase.database().ref('users/' + this.props.roomId);
    let startListeningUsers = () => {
      usersRef.on('child_added', snapshot => {
        let user = snapshot.val();
        this.setState({ users: [...this.state.users, user] });
      });
    };
    startListeningUsers();
  };

  componentWillUnmount () {
    let { name, users } = this.state
    console.log("IM UNMOUNTING RIGHT NOW")
    const userRef = myFirebase.database().ref('users/' + this.props.roomId + "/" + name);
    // userRef.delete();
    let userIndex = users.indexOf(name)
    let usersUpdate = users.splice(userIndex, 1)
    console.log(users)
  }


  establishColor = (colors) => {
    let names = colors.names;
    let randomProperty = function (names) {
      let keys = Object.keys(names)
      return names[keys[keys.length * Math.random() << 0]];
    };
    return randomProperty(names)
  }

  render() {

    return (
      <div id="chat">
        <div className="users-list">
          <h4 id="users-header">Participants: </h4>
          <p id="user-list">
          {
            this.state.users.length > 1 ?
             this.state.users.map((user, index) => user.name)
              .join(", ")
              .slice(0, -2)
            :
            this.state.name
          }
          </p>
        </div>
        <div id="chat-header">
          <h5 id="username" >{this.state.name}:</h5>
          <form id="add-message" onSubmit={this.handleSubmit}>
            <input id="text" type="text" placeholder="Message" />
            <button className="btn" type="submit" id="post">
              Post
          </button>
          </form>
        </div>
        <div>
          {this.state.messages.slice(0).reverse().map((message, index) => {
            const messClass = (message.user !== this.state.name) ? 'color1 message' : 'color2 message';
            const messageColor = message.user === this.state.name ? { 'backgroundColor': colors.names.blue } : { 'backgroundColor': message.color };
            return (
              <p
                key={index}
                className={`messages ${messClass}`}
                style={messageColor}
              >
                {message.user} ({message.time}): {message.message}
              </p>
            )
          })
          }
        </div>
      </div>
    );
  }
}

export default withRouter(Chat);