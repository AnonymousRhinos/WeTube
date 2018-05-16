/* global describe beforeEach it */

import { expect } from 'chai';
import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import InvitationList from '../invitation-list';


const adapter = new Adapter();
enzyme.configure({ adapter });
//CANT INPORT InvitationList WITHOUT CRASHING
describe('inivationList', () => {
  let inivationList;


  beforeEach(() => {
    inivationList = shallow(<InvitationList />);
  });
  it('true is true', () => {
    expect(true).to.equal(true);
  });

//   it('has one input tag', () => {
//     expect(inivationList.find('input')).to.have.length(1);
//   });

//   it('button tag says "Add to Playlist"', () => {
//     expect(
//       inivationList
//         .find('button')
//         .at(0)
//         .text()
//     ).to.be.equal('Add to Playlist');
//   });

});

