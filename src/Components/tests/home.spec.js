/* global describe beforeEach it */

import { expect } from 'chai';
import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Home } from '../home/home';
import { Chat } from '../video/chat';

const adapter = new Adapter();
enzyme.configure({ adapter });

describe('Home', () => {
  let home;
  let sampleUrl = {
    videoUrl: 'http://youtube.com/v=abcdefghcv3&1234',
  };

  beforeEach(() => {
    home = shallow(<Home />);
  });
  it('true is true', () => {
    expect(true).to.equal(true);
  });

  it('has two h2 tags', () => {
    expect(home.find('h2')).to.have.length(2);
  });
  it('first h2 tag says Create a Theater:', () => {
    expect(
      home
        .find('h2')
        .at(0)
        .text()
    ).to.be.equal('Create a Theater:');
  });
  it('has correct videoUrl on state', () => {
    expect(sampleUrl.videoUrl).to.equal(
      'http://youtube.com/v=abcdefghcv3&1234'
    );
    //some test for onSubmit to cut url down to appropriate size
  });
});
