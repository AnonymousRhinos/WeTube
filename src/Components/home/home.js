import React, { Component } from 'react';
import { withRouter } from 'react-router';
import TrendingComponent from './home-trending';
import logo from '../../logo.svg';
import myFirebase from '../../Firebase/firebaseInit';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoUrl: '',
    };
  }

  handleChange = evt => {
    this.setState({
      videoUrl: evt.target.value,
    });
  };

  handleSubmit = evt => {
    evt.preventDefault();
    let { videoUrl } = this.state;
    let begIndex = videoUrl.indexOf('v=') + 2;
    let endIndex = videoUrl.indexOf('&');
    let videoId;
    if (endIndex > -1) {
      videoId = videoUrl.slice(begIndex, endIndex);
    } else videoId = videoUrl.slice(begIndex);
    let roomId = Date.now() + '&' + videoId;

    const roomsRef = myFirebase.database().ref('rooms');
    let room = {
      roomId: roomId,
      playerStatus: -1
    }
    roomsRef.push(room)
    const videosRef = myFirebase.database().ref('videos');
    let video = {
      [roomId]: {
        videoId: videoId
      }
    }
    videosRef.push(video)
    this.props.history.push(`/room/${roomId}`);

  };

  render() {
    return (
      <div className="Home">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to WeTube</h1>
        </header>
        <h2>Create a Theater:</h2>
        <form onSubmit={this.handleSubmit}>
          <input
            size="80"
            name="videoUrl"
            className="form-control"
            placeholder="Video Url"
            onChange={this.handleChange}
            required
          />
          <button className="btn">Launch Theater</button>
        </form>
        <h2>Trending Videos</h2>
        <TrendingComponent />
      </div>
    );
  }
}

export default withRouter(Home);
