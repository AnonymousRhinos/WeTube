import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import myFirebase from '../../Firebase/firebaseInit';

export class Notification extends Component {

    enterRoom = (evt) => {
        evt.preventDefault();
        let { id, room } = this.props.invite
        let { uid } = myFirebase.auth().currentUser
        myFirebase.database().ref('active/' + uid + '/invitations/' + id).remove()
        this.props.history.push(`/`);
        setTimeout(() => {
            this.props.history.push(`/room/${room}`);
        }, 0)
    }

    rejectInvite = () => {
        let id = this.props.invite.id
        let { uid } = myFirebase.auth().currentUser
        myFirebase.database().ref('active/' + uid + '/invitations/' + id).remove()
    }

    render() {
        let room = this.props.invite.room
        return (
            <div id="notification">
                <p className="inviteText">You have a theater invitation from {this.props.invite.from}.</p>
                <p className="inviteText">Would you like to join theater {room}?</p>
                <button className="inviteButton" id="join" onClick={this.enterRoom}>Join Now</button>
                <button className="inviteButton" id="reject" onClick={this.rejectInvite}>No Thanks</button>
            </div>
        );
    }
}

export default withRouter(Notification);
