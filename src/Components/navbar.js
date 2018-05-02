import React, { Component } from 'react';
import {
  Nav,
  Navbar,
  NavItem,
  MenuItem /*, NavDropdown*/,
} from 'react-bootstrap';
import { Link } from 'react-router';

class MyNavbar extends Component {
  render() {
    return (
      <div className="Navbar">
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/home">WeTube</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem eventKey={1} href="/home">
              Home
            </NavItem>
            <NavItem eventKey={2} href="#">
              Nowhere
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    );
  }
}

export default MyNavbar;
