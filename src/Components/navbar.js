import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class MyNavbar extends Component {
  render() {
    return (
      <header className="navbar">
        <section className="navbar-section">
          <Link to={'/home'} className="btn btn-link">WeTube</Link>
        </section>
        <section className="navbar-center">
          <img className="logo" src="./../../public/images/logo.jpg" />
        </section>
        <section className="navbar-section">
          <Link to="#" className="btn btn-link">A Link</Link>
          <Link to="#" className="btn btn-link">Another Link</Link>
        </section>
      </header>
    );
  }
}

export default MyNavbar;
