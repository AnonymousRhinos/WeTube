import React from 'react';

const sendInvite = (user) => {
  console.log(`send invite to ${user}`)
}
const OnlineUser = (props) => {


  return (

    <div>
      {
        props.users.map(user => {
          const name = user;
          return (
            <div className="user-btn" key={user}>
              <button id="online-user" onClick={sendInvite(name)} >
                <img src="/images/online-user.png" className="user-pic" alt="user" />
                <span className="online-name">{user}</span>
                {/* <a onClick={"inviteUser"} className="invite-user">+</a> */}
              </button>
            </div>
          )
        })
      }
    </div>
  )
}

export default OnlineUser;
