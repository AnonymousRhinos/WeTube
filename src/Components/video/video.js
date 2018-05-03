import React, { Component } from 'react';
import Screen from './video-screen';
import VideoSearch from './video-search';
import Chat from './chat';

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoId: this.props.match.params.id.split('&')[1],
      roomId: this.props.match.params.id,
    };
  }

  render() {
    return (
      <div>
        <Screen videoId={this.state.videoId} />
        <VideoSearch />
        <Chat videoId={this.state.videoId} roomId={this.state.roomId}/>
      </div>
    );
  }
}

export default Video;
