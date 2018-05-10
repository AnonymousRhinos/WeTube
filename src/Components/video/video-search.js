import React, { Component } from 'react';
import myFirebase from '../../Firebase/firebaseInit';

class VideoSearch extends Component {
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
    let videoId;
    if(videoUrl.indexOf('youtu.be/') > -1){
      videoId = videoUrl.split('.be/')[1];
    } else {
      let begIndex = videoUrl.indexOf('v=') + 2;
      let endIndex = videoUrl.indexOf('&');
      let videoId;
      if (endIndex > -1) {
        videoId = videoUrl.slice(begIndex, endIndex);
      } else videoId = videoUrl.slice(begIndex);
    }
    myFirebase
      .database()
      .ref('videos/' + this.props.roomId + '/' + videoId)
      .set({
        videoId,
      });
    this.setState({videoUrl: ''})
  };
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            size="50"
            name="videoUrl"
            className="form-control"
            placeholder="Video URL"
            onChange={this.handleChange}
            value={this.state.videoUrl}
          />
          <button className="btn" disabled={this.state.videoUrl.toLowerCase().indexOf('youtube.com') === -1 && this.state.videoUrl.toLowerCase().indexOf('youtu.be') === -1}>Add to Queue</button>
        </form>
      </div>
    );
  }
}

export default VideoSearch;
