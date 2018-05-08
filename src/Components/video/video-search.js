import React, { Component } from 'react';
import myFirebase from '../../Firebase/firebaseInit';

class VideoSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoUrl: 'Video URL',
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
    const roomRef = myFirebase.database().ref('videos/' + this.props.roomId)
    console.log('roomref', roomRef)
    let index = Object.keys(roomRef).length;
    myFirebase
      .database()
      .ref('videos/' + this.props.roomId + '/' + videoId)
      .set({
        videoId,
        // index
      });
  };
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            size="50"
            name="videoUrl"
            className="form-control"
            placeholder={this.state.videoUrl}
            onChange={this.handleChange}
          />
          <button className="btn">Add to Queue</button>
        </form>
      </div>
    );
  }
}

export default VideoSearch;
