import React, { Component } from 'react';
import myFirebase from '../../Firebase/firebaseInit';
import { withRouter } from 'react-router';
import ChatHeader from './chat-header';
import ChatMembers from './chat-members';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.guestName,
      messages: [],
      color: this.props.color,
      users: [],
    };

    this.roomRef = myFirebase.database().ref('rooms/' + this.props.roomId);
    this.userRef = myFirebase.database().ref('users/' + this.props.roomId + "/" + this.state.name);
    this.usersRef = myFirebase.database().ref('users/' + this.props.roomId);
    this.messagesRef = myFirebase.database().ref('messages/' + this.props.roomId);
    this.stopTicking = false;
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.color !== this.props.color) {
      this.setState({
        color: this.props.color
      })
    }
  }

  getCurrentTime = () => {
    let time = new Date().toUTCString().slice(-12, -4).split(':');
    let meridian;
    if (time[0] - 5 >= 12) meridian = 'PM'
    else meridian = 'AM'
    time[0] = (+time[0] - 5 - 1) % 12 + 1;
    time = time.join(':') + meridian;
    return time
  }

  listenToFirebase = () => {
    let startListeningMessages = () => {
      this.messagesRef.on('child_added', snapshot => {
        let newerMessages;
        let msg = snapshot.val();

        let newMessages = [...this.state.messages, msg];

        let userJoinedTime;
        this.userRef.once('value', snapshot2 => {
          userJoinedTime = snapshot2.child("enterTime").node_.val()
        }).then(() => {
          newerMessages = newMessages.filter(message => {
            if (userJoinedTime >= message.time) {
              return false
            }
            else {
              return true
            }
          })
          this.setState({ messages: newerMessages });
        })
        // }
      });
    };

    let listenUserRemove = () => {
      this.userRef.onDisconnect().remove();

      this.usersRef.on('child_removed', snapshot => {
        let exitTime = this.getCurrentTime();
        let user = snapshot.key;
        let userIndex = this.state.users.indexOf(user)
        let newUsers = this.state.users.slice(0)
        newUsers.splice(userIndex, 1)
        const exitRoom = {
          user: 'Admin',
          message: `${user} has left the theater`,
          time: exitTime
        };
        if (user !== this.state.name) {
          this.setState({
            users: newUsers
          }, () => {
            this.setState({
              messages: [...this.state.messages, exitRoom]
            });
          })
        }

      });
    };

    let startListeningUsers = () => {
      this.usersRef.on('child_added', snapshot => {
        let user = snapshot.val();
        this.setState({ users: [...this.state.users, user] });
      });
    };

    startListeningUsers();
    listenUserRemove();
    startListeningMessages();
  }

  componentDidMount() {
    this.listenToFirebase()
  }

  stopListening() {
    this.userRef.off();
    this.usersRef.off();
    this.messagesRef.off();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.roomId !== this.props.roomId) {
      this.stopListening();
      this.listenToFirebase();
    }
    return this.container.scrollTop = this.container.scrollHeight
  }

  componentWillUnmount() {

    this.stopListening();
    this.stopTicking = true;
  }
  render() {


    return (
      <div id="chat">
        <ChatMembers users={this.state.users} />
        <div id="message-list" ref={ref => this.container = ref}>
          {this.state.messages.map((message, index) => {
            const messClass = (message.user !== this.state.name)
              ? 'color1'
              : 'color2';
            const messageColor = message.user === this.state.name
              ? { 'backgroundColor': '#000000' }
              : { 'backgroundColor': message.color };
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
        <ChatHeader roomId={this.props.roomId} name={this.state.name} color={this.state.color} />
      </div>
    );
  }
}

export default withRouter(Chat);
