/* global describe beforeEach it */

import { expect } from 'chai';
import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Footer from '../footer';


const adapter = new Adapter();
enzyme.configure({ adapter });

describe('Footer', () => {
  let footer;


  beforeEach(() => {
    footer = shallow(<Footer />);
  });
  it('true is true', () => {
    expect(true).to.equal(true);
  });

//   it('has one input tag', () => {
//     expect(footer.find('input')).to.have.length(1);
//   });

//   it('button tag says "Add to Playlist"', () => {
//     expect(
//       footer
//         .find('button')
//         .at(0)
//         .text()
//     ).to.be.equal('Add to Playlist');
//   });

});

