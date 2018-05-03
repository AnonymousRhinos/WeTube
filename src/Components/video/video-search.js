import React, { Component } from 'react';

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
    let begIndex = videoUrl.indexOf('v=') + 2;
    let endIndex = videoUrl.indexOf('&');
    let videoId;
    if (endIndex > -1) {
      videoId = videoUrl.slice(begIndex, endIndex);
    } else videoId = videoUrl.slice(begIndex);
    console.log('VIDEOURL', videoId);
    console.log('HISTORY', this.props.history);
    this.props.history.push(`/room/${Date.now() + '&' + videoId}`);
  };
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            size="80"
            name="videoUrl"
            className="form-control"
            placeholder="Video Url"
            onChange={this.handleChange}
          />
          <button>Add to Queue</button>
        </form>
      </div>
    );
  }
}

export default VideoSearch;
