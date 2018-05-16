import React, { Component } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import { Navbar, Video, Home, Footer, InvitationList } from './Components/index';
import myFirebase from './Firebase/firebaseInit';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: myFirebase.auth().currentUser,
      currentUser: myFirebase.auth().currentUser,
    };
  }


  setUser = (name) => {
    this.setState({
      name: name,
      currentUser: myFirebase.auth().currentUser
    })
  }

  render() {
    return (
      <div className="App">
          <InvitationList currentUser={myFirebase.auth().currentUser} />
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
