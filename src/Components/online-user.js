import React, { Component } from 'react';
import firebase from '../Firebase/firebaseInit';

class OnlineUser extends Component  {

  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      name: this.props.userName
    };
    this.activeRef = firebase.database().ref('active')
}

componentDidUpdate = (prevProps) => {
  if (prevProps.userName !== this.props.userName) {
    this.setState({
      name: this.props.userName
    })
  }
}

componentDidMount () {
  this.startlistening();
}

componentWillUnmount () {
  this.stopListening();
}

startlistening = () => {
  this.activeRef.on('child_added', snapshot => {
    let user = snapshot.val()
    let newUser = {
      displayName: user.displayName,
      uid: user.uid,
      email: user.email
    }
    this.setState({
      userList: [...this.state.userList, newUser]
    })
  })

  this.activeRef.on('child_removed', snapshot => {
    let removed = snapshot.val()
    let users = this.state.userList.filter(user => {
      return user.uid !== removed.uid
    })
    this.setState({
      userList: users
    })
  })

}

stopListening = () => {
  this.activeRef.off()
}

sendInvite = (user) => {
  firebase.database().ref('active/' + user + '/invitations').push({
    from: this.state.name || "Anonymous User", 
    room: this.props.roomId
  })
}

render () {
  return (
    <div>
      {
        this.state.userList ?
        this.state.userList.map(user => {
          const { displayName, uid, photoURL } = user
          return (
            <div className="user-btn" key={uid}>
              <button id="online-user" onClick={() => this.sendInvite(uid)} >
                <img src="/images/online-user.png" className="user-pic" alt="user" />
                <span className="online-name">{displayName}</span>
              </button>
            </div>
          )
        })
        :
        <div />
      }
    </div>
  )

}
}

export default OnlineUser;
