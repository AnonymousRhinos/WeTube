import React, { Component } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './Components/navbar';
import Video from './Components/video/video';
import Home from './Components/home/home';
import Footer from './Components/footer'
import myFirebase from './Firebase/firebaseInit';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        name: '',
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
        myFirebase.database().ref('active/' + uid + '/invitations').on('child_added', snapshot => {
          let invitations = snapshot.val();
          this.setState({
            invitations: invitations
          })
        })
      }
    }
    startListeningInvites()
  }

  stopListeningFirebase = () => {
    if (myFirebase.auth().currentUser) {
      let { uid, displayName } = myFirebase.auth().currentUser
      myFirebase.database().ref('active/' + uid + '/invitations').off()
    }
  }

  render() {
    console.log("FIREBASE USER HERE???", myFirebase.auth().currentUser)
    console.log("and the state is: ", this.state)
    return (
      <div className="App">
        <Navbar setUser={this.setUser} />
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
