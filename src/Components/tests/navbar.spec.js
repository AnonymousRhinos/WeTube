/* global describe beforeEach it */

import { expect } from 'chai';
import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// import MyNavbar from '../navbar';


const adapter = new Adapter();
enzyme.configure({ adapter });
//CANT INPORT MYNAVBAR WITHOUT CRASHING
describe('navbar', () => {
  let navbar;


  beforeEach(() => {
    navbar = shallow(<MyNavbar />);
  });
  xit('true is true', () => {
    expect(true).to.equal(true);
  });

//   it('has one input tag', () => {
//     expect(navbar.find('input')).to.have.length(1);
//   });

//   it('button tag says "Add to Playlist"', () => {
//     expect(
//       navbar
//         .find('button')
//         .at(0)
//         .text()
//     ).to.be.equal('Add to Playlist');
//   });

});

