import React from 'react';
import OnlineUser from './online-user'

const OnlineUserList = (props) => {

  const userList = [{ name: 'nick123' }, { name: 'nick456' }, { name: 'jamie' }, { name: 'dlu77' }, { name: 'johnFromAmtrack' }, { name: 'therealestandillestkillerstiedupinaknot' }]

  return (
    <div id="online-userlist">
      <OnlineUser users={userList} />
    </div>
  )
}

export default OnlineUserList;
