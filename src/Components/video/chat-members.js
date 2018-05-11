import React, { Component } from 'react';
import myFirebase from '../../Firebase/firebaseInit';

const ChatMembers = (props) => {

  return (
    <div className="users-list">
      <h4 id="users-header">Participants: </h4>
      <p id="user-list">
        {
          props.users.map((user, index) => user.newName)
            .join(", ")
        }
      </p>
    </div>
  )
}

export default ChatMembers;
