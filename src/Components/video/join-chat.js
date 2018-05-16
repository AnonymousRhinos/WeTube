import React, { Component } from 'react';

class JoinChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guestName: '',
        };
    }

    handleChange = evt => {
        this.setState({
            guestName: evt.target.value,
        });
    };

    handleSubmit = evt => {
        evt.preventDefault();
        this.props.joinRoom(this.state.guestName)
    }

    render() {
        return (
            <div className="Home">
                <header className="App-header">
                    <div id="text open-sign">
                        <h2 id="open-text">Welcome To We<span id="offset">T</span>ube</h2>
                    </div>
                </header>
                <div id="join-chat">
                    <h4 id="join-header">Enter Your Name</h4>
                    <form className="join-container" onSubmit={this.handleSubmit}>
                        <input
                            size="80"
                            name="guestName"
                            autoFocus="autofocus"
                            className="join-input"
                            placeholder="Name"
                            onChange={this.handleChange}
                            value={this.state.guestName}
                            required
                        />
                        <button className="btn join-btn" disabled={this.state.guestName.length === 0}>Join Theater</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default JoinChat;
