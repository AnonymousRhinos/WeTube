import React, { Component } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Navbar from './Components/navbar';
import Video from './Components/video/video';
import Home from './Components/home/home';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to WeTube</h1>
        </header>
        <Switch>
          <Route path="/room/:id" component={Video} />
          <Route path="/home" component={Home} />
          <Route path="/" component={Home} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
