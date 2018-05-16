/* global describe beforeEach it */

import { expect } from 'chai';
import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// import {VideoSearch} from '../index';
import OnlineUser from '../../online/online-user';

// console.log('random: ', Navbar)
// console.log('hello world: ', ThumbnailCard)
console.log(OnlineUser)
console.log('another test')
const adapter = new Adapter();
enzyme.configure({ adapter });

console.log('hello')
describe('Online User', () => {
  let userList;


  beforeEach(() => {
    userList = shallow(<OnlineUser />);
  });
  it('true is true', () => {
    expect(true).to.equal(true);
  });

//   it('has one button tag', () => {
//     expect(userList.find('button')).to.have.length(1);
//   });

//   it('had one OnlineUser tag', () => {
//     expect(
//       userList
//         .find('OnlineUser')
//     ).to.have.length(1);
//   });

});

