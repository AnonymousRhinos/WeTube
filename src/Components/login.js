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
                if (this.state.isSignedIn) {
                    let { uid, displayName, email, photoURL } = firebase.auth().currentUser
                    this.props.setUser(this.state.name)
                    firebase.database().ref('active/' + uid).set({
                            uid,
                            displayName,
                            email,
                            photoURL,
                            invitations: [{from: "test friend", room: "1526389097257&j4KvrAUjn6c"}]
                          });
                    firebase.database().ref('active/' + uid).onDisconnect().remove()
                    }
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
                <Link id="logout" to="/home" onClick={() => firebase.auth().signOut()}>Sign-out</Link>
            </div>
        );
    }
}

export default withRouter(Login);
