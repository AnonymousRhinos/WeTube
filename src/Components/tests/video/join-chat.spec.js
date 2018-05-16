/* global describe beforeEach it */

import { expect } from 'chai';
import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import JoinChat from '../../video/join-chat';


const adapter = new Adapter();
enzyme.configure({ adapter });

describe('Thumbnail Card', () => {
  let joinChat;

  beforeEach(() => {
    joinChat = shallow(<JoinChat />);
  });
    it('true is true', () => {
    expect(true).to.equal(true);
  });

//   it('has one input tag', () => {
//     expect(joinChat.find('input')).to.have.length(1);
//   });

//   it('button tag says "Add to Playlist"', () => {
//     expect(
//       joinChat
//         .find('button')
//         .at(0)
//         .text()
//     ).to.be.equal('Add to Playlist');
//   });

});

