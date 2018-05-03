import React, { Component } from 'react';
import myFirebase from '../../Firebase/firebaseInit';


export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    }
  }

  handleSubmit = event =>{
    event.preventDefault();
    
    const messagesRef = myFirebase.database().ref('messages/' + this.props.roomId);
    const message = {
      user: event.target.user.value,
      message: event.target.text.value
    }
    messagesRef.push(message)
  }

  componentDidMount =() =>{
    const messagesRef = myFirebase.database().ref('messages/' + this.props.roomId);
    let startListening = () => {
      messagesRef.on('child_added', (snapshot) => {
        let msg = snapshot.val();
        this.setState({messages: [...this.state.messages, msg]})
      });
    }
    startListening();
  }

  render () {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
        <input id='user' type='text' placeholder='Name'/><br/>
        <input id='text' type='text' placeholder='Message'/><br/>
        <button type='submit' id='post'>Post</button><br/>
        </form>
        {this.state.messages.slice(0).reverse().map((message, index) => (<h1 key={index}>{message.user}: {message.message}</h1>))}
      </div>
    )
  }
}
