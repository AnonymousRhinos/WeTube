import React, { Component } from 'react';
import { withRouter } from 'react-router';
// import TrendingComponent from './home-trending';
import { TrendingComponent } from '../index.js';
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
    let videoId;
    if(videoUrl.indexOf('youtu.be/') > -1){
      videoId = videoUrl.split('.be/')[1];
    } else {
      let begIndex = videoUrl.indexOf('v=') + 2;
      let endIndex = videoUrl.indexOf('&');
      if (endIndex > -1) {
        videoId = videoInfo || videoUrl.slice(begIndex, endIndex);
      } else videoId = videoInfo || videoUrl.slice(begIndex);
    }
    let roomId = Date.now() + '&' + videoId;

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
        sessionId: sessionId,
        currentVideo: videoId,
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
          <div id="text open-sign">
            <h2 id="open-text">Welcome To We<span id="offset">T</span>ube</h2>
          </div>
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
            <button className="btn" disabled={this.state.videoUrl.toLowerCase().indexOf('youtube.com') === -1 && this.state.videoUrl.toLowerCase().indexOf('youtu.be') === -1}>Launch Theater</button>
          </form>
        </div>
        <TrendingComponent makeRoom={this.handleSubmit} />
      </div>
    );
  }
}

export default withRouter(Home);
