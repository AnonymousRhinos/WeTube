import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import myFirebase from '../Firebase/firebaseInit';

class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    enterRoom = (evt) => {
        evt.preventDefault();
        this.props.history.push(`/room/${this.props.room}`)
    }

    rejectInvite = () => {
        let id = this.props.invite.id
        let { uid } = myFirebase.auth().currentUser
        this.invitationsRef = myFirebase.database().ref('active/' + uid + '/invitations/' + id).remove()
    }

    render() {
        return (
            <div id="notification">
                <p className= "inviteText">You have a theater invitation from {this.props.invite.from}.</p>
                <p className= "inviteText">Would you like to join theater {this.props.invite.room}?</p>
                <button id="join" onClick={this.enterRoom}>Yes</button>
                <button id="reject" onClick={this.rejectInvite}>No Thanks</button>
            </div>
        );
    }
}

export default withRouter(Notification);