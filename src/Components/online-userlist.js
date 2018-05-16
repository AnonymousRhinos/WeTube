import React from 'react';
import OnlineUser from './online-user'

const OnlineUserList = (props) => {


  return (
    <div className="dropdown">
      <button className="dropbtn" id="online-btn">Online
              <i className="fa fa-caret-down"></i>
      </button>
      <div className="dropdown-content">
        <div id="online-userlist">
          <OnlineUser roomId={props.roomId} userName={props.userName} />
        </div>
      </div>
    </div>
  )
}

export default OnlineUserList;
