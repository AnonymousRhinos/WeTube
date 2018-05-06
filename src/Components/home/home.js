import React, { Component } from 'react';
import { withRouter } from 'react-router';
// import TrendingComponent from './home-trending';
import { TrendingComponent } from '../index.js';
import { testArr } from '../index.js'
import myFirebase from '../../Firebase/firebaseInit';
import OpenTok from "opentok";
import tokbox from '../../tokboxConfig'
const apiKey = tokbox.apiKey
const secret = tokbox.secret


export class Home extends Component {
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

  handleSubmit = (evt, videoInfo) => {
    evt.preventDefault();
    let { videoUrl } = this.state;
    let begIndex = videoUrl.indexOf('v=') + 2;
    let endIndex = videoUrl.indexOf('&');
    let videoId;
    if (endIndex > -1) {
      videoId = videoInfo || videoUrl.slice(begIndex, endIndex);
    } else videoId = videoInfo || videoUrl.slice(begIndex);
    let roomId = Date.now() + '&' + videoId;

    const videosRef = myFirebase.database().ref('videos');
      let video = {
        [roomId]: {
          videoId: videoId
        }
      }
      videosRef.push(video)

    let sessionId
    let self = this;
    const opentok = new OpenTok(apiKey, secret);
    opentok.createSession({ mediaMode: "routed" }, function (err, session) {
      if (err) {
        console.log(err);
        return;
      }
      sessionId = session.sessionId;

      myFirebase.database().ref('rooms/' + roomId).set({
        roomId: roomId,
        playerStatus: -1,
        currentTime: 0,
        sessionId: sessionId
      })

      self.props.history.push({
       pathname:  `/room/${roomId}`,
       state: {sessionId: sessionId}
      });

    })
  };

  render() {
    return (
      <div className="Home">
        <header className="App-header">
          <h1 className="App-title">Welcome to WeTube</h1>
          <img className="logo-header" src="/logo.jpg" />
        </header>
        <div className="theater-form">
          <h2 id="input-header">Create a Theater:</h2>
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
        </div>
        <TrendingComponent makeRoom={this.handleSubmit} />
      </div>
    );
  }
}

export default withRouter(Home);
