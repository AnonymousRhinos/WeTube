import React, { Component } from 'react';

const OnlineUser = (props) => {

  const sendInvite = (user) => {
    console.log(`send invite to ${user}`)
  }

  return (
    <div>
      {
        props.users.map(user => {
          const name = user.name;
          return (
            <div className="user-btn" key={name}>
              <button id="online-user" onClick={() => sendInvite(name)} >
                <img src="/images/online-user.png" className="user-pic" alt="user" />
                <span className="online-name">{name}</span>
              </button>
            </div>
          )
        })
      }
    </div>
  )
}

export default OnlineUser;
