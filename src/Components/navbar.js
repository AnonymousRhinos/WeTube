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
            <img className="logo-navbar" src="/logo.jpg" alt="logo" />
          </Link>
          <Link to={'/home'} className="btn-link" id="nav-home">
            WeTube
          </Link>
        </section>
        <section className="navbar-section">
          <a href="https://www.youtube.com/" target="_blank">
            <img src="/images/YouTube.jpg" alt="YouTube" id="youtube-img" />
          </a>
          {/* <Link to="https://www.youtube.com/" target="_blank" className="btn-link">
            YouTube
          </Link> */}
          <div>
            <a href="#" onClick={this.addToClipboard}>
              <img src="/images/copy-url.png" alt="copy-url" id="copy-url-img" />
            </a>
            <Login setUser={this.props.setUser} />
            <button
              onClick={this.addToClipboard} className="url-btn">Copy URL</button>
          </div>
        </section>
      </header>
    );
  }
}

export default MyNavbar;
