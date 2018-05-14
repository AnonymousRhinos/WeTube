import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import firebase from '../Firebase/firebaseInit';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

class Login extends Component {
    // The component's Local state.
    constructor(props) {
        super(props);
        this.state = {
            isSignedIn: false, // Local signed-in state.
            name: ''
        };
    }

    // Configure FirebaseUI.
    uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // We will display Google and Facebook as auth providers.
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
            // Avoid redirects after sign-in.
            signInSuccess: () => false
        }
    };

    // Listen to the Firebase Auth state and set the local state.
    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
            (user) => this.setState({
                isSignedIn: !!user,
                name: firebase.auth().currentUser ? firebase.auth().currentUser.displayName : ''
            }, () => {
                this.props.setUser(this.state.name)
            })
        );
    }

    // Make sure we un-register Firebase observers when the component unmounts.
    componentWillUnmount() {
        this.unregisterAuthObserver();
    }

    render() {
        if (!this.state.isSignedIn) {
            return (
                <div>
                    <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
                </div>
            );
        }
        return (
            <div>
                <Link to="/home" onClick={() => firebase.auth().signOut()}>Sign-out</Link>
            </div>
        );
    }
}

export default withRouter(Login);
