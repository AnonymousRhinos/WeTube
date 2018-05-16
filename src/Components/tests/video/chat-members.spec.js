/* global describe beforeEach it */

import { expect } from 'chai';
import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ChatMembers from '../../video/chat-members';


const adapter = new Adapter();
enzyme.configure({ adapter });

describe('Chat Members', () => {
  let chatMembers;

//SAME ISSUES AS HOME
  beforeEach(() => {
    chatMembers = shallow(<ChatMembers />);
  });
  xit('true is true', () => {
    expect(true).to.equal(true);
  });

//   it('has one input tag', () => {
//     expect(chatMembers.find('input')).to.have.length(1);
//   });

//   it('button tag says "Add to Playlist"', () => {
//     expect(
//       chatMembers
//         .find('button')
//         .at(0)
//         .text()
//     ).to.be.equal('Add to Playlist');
//   });

});

