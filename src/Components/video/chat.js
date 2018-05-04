import React, { Component } from 'react';
import myFirebase from '../../Firebase/firebaseInit';
import colors from '../../colors.js';

export default class Chat extends Component {
  constructor(props) {
    super(props);


    this.state = {
      name: '',
      messages: [],
      color: ''
        };

  }


  handleSubmit = event => {
    event.preventDefault();
    const { name, color } = this.state;
    const messagesRef = myFirebase
      .database()
      .ref('messages/' + this.props.roomId);
    const message = {
      user: name,
      message: event.target.text.value,
      color: color
    };
    messagesRef.push(message);
    console.log(this.state, ' this is a color')

  };

  componentDidMount = () => {
    const name = prompt('Enter name:');
    const color = this.establishColor(colors);
    this.setState({ 
      name: name,
      color: color 
    });
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


  establishColor = (colors) => {
    let names = colors.names;
    let randomProperty = function (names) {
      let keys = Object.keys(names)
      return names[keys[ keys.length * Math.random() << 0]];
  };
    return randomProperty(names)
  }

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
            <h6 key={index} className={(index % 2 === 0 ? 'color1 message' : 'color2 message')} style={{'backgroundColor': this.state.color}}>
              {message.user}: {message.message}
            </h6>
          ))}
      </div>
    );
  }
}
