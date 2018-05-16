import React, { Component } from 'react';
import Login from './login'
import { Link } from 'react-router-dom';
import OnlineUserList from './online-userlist';
import CopyUrl from './copy-url';
import YouTube from './navbar-youtube';

class MyNavbar extends Component {

  render() {
    return (
      <header className="navbar">
        <section className="navbar-section">
          <Link to={'/home'}>
            <img className="logo-navbar" src="/logo.jpg" alt="logo" />
          </Link>
          <Link to={'/home'} className="btn-link" id="nav-home">
            WeTube
          </Link>
        </section>
        <section className="navbar-section">
          <YouTube />
          <OnlineUserList roomId={window.location.pathname.slice(6)} userName={this.props.userName} />
          <CopyUrl />
          <Login setUser={this.props.setUser} />
        </section>
      </header>
    );
  }
}

export default MyNavbar;
