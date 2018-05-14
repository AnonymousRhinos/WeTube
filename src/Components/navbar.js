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
            <img className="logo-navbar" src="/logo.jpg" alt="logo" />
          </Link>
          <Link to={'/home'} className="btn-link" id="nav-home">
            WeTube
          </Link>
        </section>
        <section className="navbar-section">
          <Link to="#" className="btn-link">
            A Link
          </Link>
          <div>
            <a href="#" onClick={this.addToClipboard}>
              <img src="/images/copy-url.png" alt="copy-url" id="copy-url-img" />
            </a>
            <button
              onClick={this.addToClipboard} className="url-btn">Copy URL</button>
          </div>
        </section>
      </header>
    );
  }
}

export default MyNavbar;
