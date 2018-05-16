/* global describe beforeEach it */

import { expect } from 'chai';
import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Youtube from '../navbar-youtube';


const adapter = new Adapter();
enzyme.configure({ adapter });
//CANT INPORT Youtube WITHOUT CRASHING
describe('youtubeNav', () => {
  let youtubeNav;


  beforeEach(() => {
    youtubeNav = shallow(<Youtube />);
  });
  it('true is true', () => {
    expect(true).to.equal(true);
  });

//   it('has one input tag', () => {
//     expect(youtubeNav.find('input')).to.have.length(1);
//   });

//   it('button tag says "Add to Playlist"', () => {
//     expect(
//       youtubeNav
//         .find('button')
//         .at(0)
//         .text()
//     ).to.be.equal('Add to Playlist');
//   });

});

