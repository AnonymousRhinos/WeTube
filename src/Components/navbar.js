import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class MyNavbar extends Component {
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
          <Link to="#" className="btn-link">
            A Link
          </Link>
          <Link to="#" className="btn-link">
            Another Link
          </Link>
        </section>
      </header>
    );
  }
}

export default MyNavbar;
