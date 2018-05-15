import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

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
        
    }

    render() {
        return (
            <div id="notification">
                <p className= "inviteText">You have a theater invitation from {this.props.from}.</p>
                <p className= "inviteText">Would you like to join theater {this.props.room}?</p>
                <button id="join" onClick={this.enterRoom}>Yes</button>
                <button id="reject" onClick={this.rejectInvite}>No Thanks</button>
            </div>
        );
    }
}

export default withRouter(Notification);