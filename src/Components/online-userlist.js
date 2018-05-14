import React from 'react';
import OnlineUser from './online-user'

const OnlineUserList = (props) => {

  const userList = ['nick123', 'nick456', 'jamie', 'dlu77', 'johnFromAmtrack', 'therealestandillestkillerstiedupinaknot']

  return (
    <div id="online-userlist">
      <OnlineUser users={userList} />
    </div>
  )
}

export default OnlineUserList;
