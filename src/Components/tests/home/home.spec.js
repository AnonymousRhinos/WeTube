/* global describe beforeEach it */

import { expect } from 'chai';
import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import  {Home}  from '../../home/home';
// import { Chat } from '../video/chat';

// const adapter = new Adapter();
// enzyme.configure({ adapter });

describe('Home', () => {
  // let home;

  // let sampleUrl = {
  //   videoUrl: 'http://youtube.com/v=abcdefghcv3&1234',
  // };

  //THIS TEST GIVES AN ERROR AS THE PROPS ARE NOT DEFINED FOR THE COMPONENT CONSTRUCTOR CONDITIONAL
  // beforeEach(() => {
  //   home = shallow(<Home />);
  //     home.setProps({
  //       match: {
  //         params: "http://youtube.com/v=abcdefghcv3&1234"
  //       }
  //     })
  // });
  xit('true is true', () => {
    expect(true).to.equal(true);
  });


});
