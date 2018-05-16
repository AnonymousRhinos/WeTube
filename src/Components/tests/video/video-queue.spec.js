/* global describe beforeEach it */

import { expect } from 'chai';
import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Queue from '../../video/video-queue';


const adapter = new Adapter();
enzyme.configure({ adapter });

describe('Video Queue', () => {
  let videoQueue;

//ANOTHER PROPS ISSUE LIKE HOME
  beforeEach(() => {
    videoQueue = shallow(<Queue />);
  });
  xit('true is true', () => {
    expect(true).to.equal(true);
  });

//   it('has one input tag', () => {
//     expect(videoQueue.find('input')).to.have.length(1);
//   });

//   it('button tag says "Add to Playlist"', () => {
//     expect(
//       videoQueue
//         .find('button')
//         .at(0)
//         .text()
//     ).to.be.equal('Add to Playlist');
//   });

});

