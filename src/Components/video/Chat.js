import React, { Component } from 'react';
import myFirebase, {messaging} from '../../Firebase/firebaseInit';


const handleSubmit = event =>{
  event.preventDefault();
  const messagesRef = myFirebase.database().ref('messages');
  const message = {
    user: event.target.username.value,
    message: event.target.text.value
  }
  messagesRef.push(message)
}

export function Chat () {



    return (
      <div>
        <form onSubmit={handleSubmit}>
        <input id='username' type='text' placeholder='Name'/><br/>
        <input id='text' type='text' placeholder='Message'/><br/>
        <button type='submit' id='post'>Post</button><br/>
        </form>
        <div id='results'></div>

      </div>
    )

}

