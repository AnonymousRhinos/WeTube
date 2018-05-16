/* global describe beforeEach it */

import { expect } from 'chai';
import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ChatHeader from '../../video/chat-header';


const adapter = new Adapter();
enzyme.configure({ adapter });

describe('Chat Header', () => {
  let chatHeader;


  beforeEach(() => {
    chatHeader = shallow(<ChatHeader />);
  });
  it('true is true', () => {
    expect(true).to.equal(true);
  });

//   it('has one input tag', () => {
//     expect(chatHeader.find('input')).to.have.length(1);
//   });

  it('button tag says "Post"', () => {
    expect(
      chatHeader
        .find('button')
        .at(0)
        .text()
    ).to.be.equal('Post');
  });

});

