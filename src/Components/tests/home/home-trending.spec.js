/* global describe beforeEach it */

import { expect } from 'chai';
import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// import categories from '../../youtube-cats'

// // import { Chat } from '../video/chat';
// // import VideoSearch from '../video/video-search';
// // import { ThumbnailCard } from '../index'
// import ThumbnailCard from '../video/thumbnail-card'

import TrendingComponent from '../../home/home-trending';

const adapter = new Adapter();
enzyme.configure({ adapter });

describe('Trending Component', () => {
  let trendingComp;


  beforeEach(() => {
    trendingComp = shallow(<TrendingComponent />);
  });
  it('true is true', () => {
    expect(true).to.equal(true);
  });

//   it('has one input tag', () => {
//     expect(trendingComp.find('input')).to.have.length(1);
//   });

//   it('button tag says "Add to Playlist"', () => {
//     expect(
//       videoSearch
//         .find('button')
//         .at(0)
//         .text()
//     ).to.be.equal('Add to Playlist');
//   });

});

