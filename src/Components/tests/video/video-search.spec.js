/* global describe beforeEach it */

import { expect } from 'chai';
import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import VideoSearch from '../../video/video-search';


const adapter = new Adapter();
enzyme.configure({ adapter });

describe('Video Search', () => {
  let videoSearch;


  beforeEach(() => {
    videoSearch = shallow(<VideoSearch />);
  });
  it('true is true', () => {
    expect(true).to.equal(true);
  });

  it('has one input tag', () => {
    expect(videoSearch.find('input')).to.have.length(1);
  });

  it('button tag says "Add to Playlist"', () => {
    expect(
      videoSearch
        .find('button')
        .at(0)
        .text()
    ).to.be.equal('Add to Playlist');
  });

});

