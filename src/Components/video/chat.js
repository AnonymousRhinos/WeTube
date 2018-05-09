import React, { Component } from 'react';
import myFirebase from '../../Firebase/firebaseInit';
import { withRouter } from 'react-router';
import colors from '../../colors.js';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.guestName,
      messages: [],
      color: '',
      users: [],
    };
  }


  handleSubmit = event => {
    event.preventDefault();
    const { name, color } = this.state;
    let messageTime = this.getCurrentTime();
    const messagesRef = myFirebase.database().ref('messages/' + this.props.roomId);
    const message = {
      user: name,
      message: event.target.text.value,
      color: color,
      time: messageTime
    };
    messagesRef.push(message);
    event.target.text.value = ""
  };

  componentDidMount = () => {
    let enterTime = this.getCurrentTime();
    const name = this.props.guestName;
    const color = this.establishColor(colors);
    const token = this.props.token
    let newName = '';
    if (name) {
      newName = name.replace(/[\.\#\$\[\]\&]+/g,``)
      myFirebase.database().ref('users/' + this.props.roomId + '/' + newName).set({ newName, enterTime, token });
      const joinRef = myFirebase.database().ref('messages/' + this.props.roomId);
      const message = {
        user: newName,
        message: `${newName} has entered the theatre`,
        time: enterTime
      };
      joinRef.push(message);
    }
    this.setState({ name: newName, color: color });

    //listen for messages and change state

    const messagesRef = myFirebase
      .database()
      .ref('messages/' + this.props.roomId);
    let startListeningMessages = () => {
      messagesRef.on('child_added', snapshot => {
        let msg = snapshot.val();
          if (this.state.users.indexOf(this.state.name)) {
            this.setState({ messages: [...this.state.messages, msg] });
          }
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

    //listen for deleted users and change state
    const usersRemRef = myFirebase.database().ref('users/' + this.props.roomId);
    let listenUserRemove = () => {
      usersRemRef.on('child_removed', snapshot => {
        let exitTime = this.getCurrentTime();
        let user = snapshot.key;
        let userIndex = this.state.users.indexOf(user)
        let newUsers = this.state.users.slice(0)
        newUsers.splice(userIndex, 1)
        const exitRef = myFirebase.database().ref('messages/' + this.props.roomId);
        const exitRoom = {
          user: user,
          message: `${user} has left the theatre`,
          time: exitTime
        };
        if (user !== this.state.name) {
          this.setState({
            users: newUsers
          }, () => {
            exitRef.push(exitRoom);
          })
        }
      });
    };
    const timedoutUserRemove = () => {
      usersRemRef.on('value', snapshot => {
        const time = new Date().getTime()
        for(let key in snapshot.val()){

          if((time - snapshot.val()[key].handshake) > 5000){

            let deletedRef = myFirebase.database().ref('users/' + this.props.roomId + '/' + key)
            deletedRef.remove();
          }
        }
      })
    }
    listenUserRemove();
    timedoutUserRemove();

  };

  componentWillUnmount() {
    let { name } = this.state
    const userRef = myFirebase.database().ref('users/' + this.props.roomId + "/" + name);
    userRef.remove();
  }

  getCurrentTime = () => {
    let time = new Date().toUTCString().slice(-12, -4).split(':');
    time[0] = (+time[0] + 7) % 12;
    time = time.join(':');
    return time
  }

  establishColor = (colors) => {
    let names = colors.names;
    let randomProperty = function (names) {
      let keys = Object.keys(names)
      return names[keys[Math.floor(keys.length * Math.random())]];
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
              this.state.users.map((user, index) => user.newName)
                .join(", ")
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
            const messClass = (message.user !== this.state.name) ? 'color1' : 'color2';
            const messageColor = message.user === this.state.name ? { 'backgroundColor': '#000000' } : { 'backgroundColor': message.color };
            return (
              <p
                key={index}
                className={`message ${messClass}`}
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
