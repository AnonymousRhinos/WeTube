/* global describe beforeEach it */

import { expect } from 'chai';
import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import OnlineUserList from '../../online/online-userlist';

const adapter = new Adapter();
enzyme.configure({ adapter });

describe('User List', () => {
  let onlineUserList;


  beforeEach(() => {
    onlineUserList = shallow(<OnlineUserList />);
  });
  it('true is true', () => {
    expect(true).to.equal(true);
  });

  // it('has one div tag', () => {
  //   expect(onlineUserList.find('div')).to.have.length(1);
  // });

  // it('had one OnlineUser tag', () => {
  //   expect(
  //     onlineUserList
  //       .find('OnlineUser')
  //   ).to.have.length(1);
  // });

});

