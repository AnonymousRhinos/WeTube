import React, { Component } from 'react';
import Notification from './online/invite-notification';
import myFirebase from '../Firebase/firebaseInit';


class InvitationList extends Component {

  constructor(props) {
    super(props);
    this.state = {
    //   currentUser: this.props.currentUser,
      invitations: []
    };
  }

  componentDidUpdate (prevProps) {
    if (prevProps.currentUser !== this.props.currentUser) {
            this.stopListeningFirebase();
            this.listenToFirebase();
    }
  }

  componentWillUnmount() {
    this.stopListeningFirebase();
  }

componentDidMount () {
    this.listenToFirebase();
}

  listenToFirebase = () => {
    let startListeningInvites = () => {
      if (this.props.currentUser) {
        let { uid, displayName } = this.props.currentUser
        this.invitationsRef = myFirebase.database().ref('active/' + uid + '/invitations')

        this.invitationsRef.on('child_added', snapshot => {
          let parent = snapshot.key
          let invitation = snapshot.val();
          invitation.id = parent;
          this.setState({
            invitations: [...this.state.invitations, invitation]
          })
        })

        this.invitationsRef.on('child_removed', snapshot => {
          let removed = snapshot.key
          let invitations = this.state.invitations.filter(invite => {
            return invite.id !== removed
          })
          this.setState({
            invitations: invitations
          })
        })
      }
    }
    startListeningInvites()
  }

  stopListeningFirebase = () => {
    if (this.props.currentUser && this.invitationsRef) {
      this.invitationsRef.off()
    }
  }

  render() {
    return (
        <div className="invite-list">
          {
            this.state.invitations.map(invite => {
              return <Notification key={invite.id} invite={invite} />
            })
          }
        </div>
    );
  }
}

export default InvitationList;
