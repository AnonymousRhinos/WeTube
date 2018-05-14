import React from 'react';

const OnlineUser = (props) => {


  return (

    <div>
      {
        props.users.map(user => {
          return (
            <div id="online-user">
              <img src="/images/online-user.png" className="user-pic" alt="user" />
              <span className="online-name">{user}</span>
              <a onClick={"inviteUser"} className="invite-user">+</a>
            </div>
          )
        })
      }
    </div>
  )
}

export default OnlineUser;
