import React, { Component } from 'react';
import Login from './online/login.js'
import { Link } from 'react-router-dom';
import OnlineUserList from './online/online-userlist';

class MyNavbar extends Component {

  addToClipboard = (e) => {
    e.preventDefault()
    const url = window.location.href
    navigator.clipboard.writeText(url);
  }

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
          <div className="dropdown">
            <button className="dropbtn" id="online-btn">Online
              <i className="fa fa-caret-down"></i>
            </button>
            <div className="dropdown-content">
              <OnlineUserList roomId={window.location.pathname.slice(6)} userName={this.props.userName} />
            </div>
          </div>
          <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
            <img src="/images/YouTube.jpg" alt="YouTube" id="youtube-img" />
          </a>
          <div>
            <a href="#" onClick={this.addToClipboard}>
              <img src="/images/copy-url.png" alt="copy-url" id="copy-url-img" />
              <span className="url-btn">Copy URL</span>
            </a>
          </div>
          <Login setUser={this.props.setUser} />
        </section>
      </header>
    );
  }
}

export default MyNavbar;
