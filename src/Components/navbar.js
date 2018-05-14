import React, { Component } from 'react';
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
      </header>
    );
  }
}

export default MyNavbar;
