import React, { Component } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './Components/navbar';
import Video from './Components/video/video';
import Home from './Components/home/home';
import Footer from './Components/footer'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <Switch>
          <Route path="/room/:id" component={Video} />
          <Route path="/home/:videoId" component={Home} />
          <Route path="/home" component={Home} />
          <Route path="/" component={Home} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default withRouter(App);
