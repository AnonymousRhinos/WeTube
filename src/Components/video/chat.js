import React, { Component } from 'react';
import myFirebase from '../../Firebase/firebaseInit';
import { withRouter } from 'react-router';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.guestName,
      messages: [],
      color: this.props.color,
      users: [],
      message: ''
    };
  }

  handleChange = evt => {
    this.setState({
      message: evt.target.value,
    });
  };

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
    //listen for messages and change state
    const messagesRef = myFirebase
      .database()
      .ref('messages/' + this.props.roomId);
    let startListeningMessages = () => {
      messagesRef.on('child_added', snapshot => {
        let msg = snapshot.val();
          if (this.state.users.indexOf(this.state.name)) {

            let newMessages = [...this.state.messages, msg];
            
            const userRef = myFirebase.database().ref('users/' + this.props.roomId + "/" + this.state.name);
            let userJoinedTime;
            userRef.once('value', snapshot2 => {
              userJoinedTime = snapshot2.child("enterTime").node_.val()
            }).then( ()=> {
              let newerMessages = newMessages.filter( message => {

                if(userJoinedTime >= message.time ) {
                  if(message.user === 'Admin'){
                    return false;
                  }
                  else return true;
                }
                else {
                  return true
                }

              })
              this.setState({ messages: newerMessages });
            })
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
        const exitRoom = {
          user: 'Admin',
          message: `${user} has left the theatre`,
          time: exitTime
        };
        if (user !== this.state.name) {
          this.setState({
            users: newUsers
          }, () => {
            this.setState({ 
              messages: [...this.state.messages, exitRoom] });
          })
        }
      });
    };

    const timedoutUserRemove = () => {

      setTimeout(() => {
        usersRemRef.once('value', snapshot => {
          const time = new Date().getTime()
          for (let key in snapshot.val()) {
            if ((time - snapshot.val()[key].handshake) > 3000) {
              let deletedRef = myFirebase.database().ref('users/' + this.props.roomId + '/' + key)
              deletedRef.remove();
            }
          }
        })
        if (this.stopTicking !== true) {
          timedoutUserRemove();
        }
      }, 1000)
    }
    listenUserRemove();
    timedoutUserRemove();

  };

  componentWillUnmount() {
    let { name } = this.state
    const userRef = myFirebase.database().ref('users/' + this.props.roomId + "/" + name);
    // userRef.remove();
    this.stopTicking = true;
  }

  getCurrentTime = () => {
    let time = new Date().toUTCString().slice(-12, -4).split(':');
    let meridian;
    if (time[0] >= 12) meridian = 'AM'
    else meridian = 'PM'
    time[0] = (+time[0] + 7) % 12;
    time = time.join(':') + meridian;
    return time
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
            <input id="text" type="text" placeholder="Message" onChange={this.handleChange} />
            <button className="btn" type="submit" id="post" disabled={this.state.message.length < 1}>
              Post
          </button>
          </form>
        </div>
        <div>
          {this.state.messages.slice(0).reverse().map((message, index) => {
            const messClass = (message.user !== this.state.name) ? 'color1' : 'color2';
            const messageColor = message.user === this.state.name ? { 'backgroundColor': '#000000' } : { 'backgroundColor': message.color };
            let time = message.time.split(':');
            let mer = time[2].slice(-2);
            let newTime = time.slice(0, 2).join(':') + ' ' + mer;
            return (
              <div
                key={index}
                className={`message ${messClass}`}
                style={messageColor}
              >
                <span className="message-time">
                  ~{newTime}
                </span>
                <p>
                  {message.user} : {message.message}
                </p>

              </div>
            )
          })
          }
        </div>
      </div>
    );
  }
}

export default withRouter(Chat);
