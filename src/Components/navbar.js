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
          <div className="dropdown">
            <button className="dropbtn">Dropdown
      <i className="fa fa-caret-down"></i>
            </button>
            <div className="dropdown-content">
              <a href="#">Link 1</a>
              <a href="#">Link 2</a>
              <a href="#">Link 3</a>
            </div>
          </div>
          <a href="https://www.youtube.com/" target="_blank">
            <img src="/images/YouTube.jpg" alt="YouTube" id="youtube-img" />
          </a>
          <div>
            <a href="#" onClick={this.addToClipboard}>
              <img src="/images/copy-url.png" alt="copy-url" id="copy-url-img" />
              <span className="url-btn">Copy URL</span>
            </a>
          </div>
        </section>
      </header>
    );
  }
}

export default MyNavbar;
