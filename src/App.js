import React, { Component } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import { Navbar, Video, Home, Footer, Notification } from './Components/index';
import myFirebase from './Firebase/firebaseInit';

function getParent(snapshot) {
  var ref = snapshot.ref();
  return ref.parent().name();
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        name: myFirebase.auth().currentUser,
        invitations: []
    };
  }

  componentWillUnmount () {
    this.stopListeningFirebase();
  }

  setUser = (name) => {
    this.setState({
      name: name
    }, () => {
      this.listenToFirebase();
    })
  }

  listenToFirebase = () => {
    let startListeningInvites = () => {
      if (myFirebase.auth().currentUser) {
        let { uid, displayName } = myFirebase.auth().currentUser
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
    if (myFirebase.auth().currentUser && this.invitationsRef) {
      this.invitationsRef.off()
    }
  }

  render() {
    return (
      <div className="App">
      <div className="invite-list">
      {
        this.state.invitations.map(invite => {
          return <Notification key={invite.id} invite={invite} />
        })
      }
      </div>
        <Navbar setUser={this.setUser} userName={this.state.name} />
        <Switch>
          <Route path="/room/:id" render={() => <Video userName={this.state.name} />} />
          <Route path="/home/:videoId" render={() => <Home userName={this.state.name} />} />
          <Route path="/home" render={() => <Home userName={this.state.name} />} />
          <Route path="/" render={() => <Home userName={this.state.name} />} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default withRouter(App);
