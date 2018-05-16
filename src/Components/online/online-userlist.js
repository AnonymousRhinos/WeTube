import React from 'react';
// import {OnlineUser} from '../.'
import OnlineUser from './online-user'

const OnlineUserList = (props) => {

  return (
    <div id="online-userlist">
      <OnlineUser roomId={props.roomId} userName={props.userName} />
    </div>
  )
}

export default OnlineUserList;
