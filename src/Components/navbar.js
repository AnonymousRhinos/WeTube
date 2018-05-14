import React, { Component } from 'react';
import Login from './login'
import { Link } from 'react-router-dom';

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
          <img className="logo-navbar" src="/logo.jpg" alt="logo"/>
          </Link>
          <Link to={'/home'} className="btn-link" id="nav-home">
            WeTube
          </Link>
        </section>
      <section className="navbar-section">
          <Login setUser={this.props.setUser} />
          <button onClick={this.addToClipboard} className="url-btn">Copy URL</button>
        </section>
      </header>
    );
  }
}

export default MyNavbar;
