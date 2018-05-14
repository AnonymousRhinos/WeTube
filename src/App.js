import React, { Component } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './Components/navbar';
import Video from './Components/video/video';
import Home from './Components/home/home';
import Footer from './Components/footer'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        name: ''
    };
  }

  setUser = (name) => {
    this.setState({
      name: name
    })
  }

  render() {
    return (
      <div className="App">
        <Navbar setUser={this.setUser} />
        <Switch>
          <Route path="/room/:id" component={Video} />
          <Route path="/home" render={() => <Home userName={this.state.name} />} />
          <Route path="/" render={() => <Home userName={this.state.name} />} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default withRouter(App);
