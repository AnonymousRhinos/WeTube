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
    console.log('props are: ', this.props)
    console.log('props are: ', props)
    if(props.match.params.videoId){
      //grab the video ID
      console.log('doing something right');
      this.state = {
        videoUrl: "https://www.youtube.com/watch?v=" + props.match.params.videoId,
        userName: this.props.userName
      }
    }
    else{
      console.log('wrong')
      this.state = {
        videoUrl: '',
        userName: this.props.userName
      };
    }
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
      videoId = videoUrl.split('.be/')[1]
    } else {
      let begIndex = videoUrl.indexOf('v=') + 2;
      let endIndex = videoUrl.indexOf('&');
      if (endIndex > -1) {
        videoId = videoInfo || videoUrl.slice(begIndex, endIndex);
      } else videoId = videoInfo || videoUrl.slice(begIndex);
    }
    let roomId = Date.now() + '&' + videoId;
    myFirebase.database().ref('videos/' + roomId + '/' + videoId).set({
      videoId,
      timeAdded: new Date().getTime()
    });

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
       state: {
         sessionId: sessionId
        }
      });

    })
  };

  render() {
    const isInvalidUrl = this.state.videoUrl.toLowerCase().indexOf('youtube.com') === -1 && this.state.videoUrl.toLowerCase().indexOf('youtu.be') === -1
    return (
      <div className="Home">
        <header className="App-header">
          <div id="text open-sign">
            <h2 id="open-text">Welcome To We<span id="offset">T</span>ube</h2>
          </div>
        </header>
        <div>
        <div className="theater-form">
          <h2 id="input-header">Create a Theater:</h2>
          <form onSubmit={this.handleSubmit}>
            <input
              defaultValue={this.state.videoUrl}
              size="80"
              name="videoUrl"
              autoFocus="autofocus"
              className="form-control"
              placeholder="Video Url"
              onChange={this.handleChange}
              required
            />
            <button className="btn" disabled={isInvalidUrl}>Launch Theater</button>
          </form>
        </div>
        <TrendingComponent handleClick={this.handleSubmit} />
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
