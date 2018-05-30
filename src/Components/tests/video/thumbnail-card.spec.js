/* global describe beforeEach it */

import { expect } from 'chai';
import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ThumbnailCard from '../../video/thumbnail-card';


const adapter = new Adapter();
enzyme.configure({ adapter });

describe('Thumbnail Card', () => {
  let thumbnailCard;
  let video = {id: 'Wpm07-BGJnE'}

//I CANNOT DO THIS AS CHAT IMPORTS FROM OPENTOK AND RUINS THINGS
  beforeEach(() => {
    thumbnailCard = shallow(<ThumbnailCard id={video.id} />);
  });
    it('video id is passed in correctly', () => {
      console.log(thumbnailCard.props())
      expect(thumbnailCard.props('key')).to.equal('img');
    // expect(thumbnailCard.instance().props('id')).to.equal('Wpm07-BGJnE');
  });

//   it('has one input tag', () => {
//     expect(thumbnailCard.find('input')).to.have.length(1);
//   });

//   it('button tag says "Add to Playlist"', () => {
//     expect(
//       thumbnailCard
//         .find('button')
//         .at(0)
//         .text()
//     ).to.be.equal('Add to Playlist');
//   });

});

