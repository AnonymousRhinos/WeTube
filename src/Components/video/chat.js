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
      let newName = name.replace(/[\.\#\$\[\]\&]+/g,``)
      myFirebase.database().ref('users/' + this.props.roomId + '/' + newName).set({ newName, time });
      console.log('name is: ', newName)
      const joinRef = myFirebase.database().ref('messages/' + this.props.roomId);
      const message = {
        user: newName,
        message: `${newName} has entered the theatre`,
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
        let user = snapshot.val().name;
        let userIndex = this.state.users.indexOf(user)
        let newUsers = this.state.users.slice(0)
        newUsers.splice(userIndex, 1)
        const exitRef = myFirebase.database().ref('messages/' + this.props.roomId);
        const exitRoom = {
          user: user,
          message: `${user} has left the theatre`,
          time
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
    listenUserRemove();

  };

  componentWillUnmount() {
    let { name } = this.state
    const userRef = myFirebase.database().ref('users/' + this.props.roomId + "/" + name);
    userRef.remove();
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
    console.log("USERS: ", this.state.users)
    return (
      <div id="chat">
        <div className="users-list">
          <h4 id="users-header">Participants: </h4>
          <p id="user-list">
            {
              this.state.users.map((user, index) => user.name)
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