import React, { Component } from 'react';
import Screen from './video-screen';
import VideoSearch from './video-search';
import Chat from './Chat';

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoId: this.props.match.params.id.split('&')[1],
      roomId: this.props.match.params.id,
    };
  }

  render() {
    console.log('STATE IN VIDEO', this.state);
    return (
      <div>
        <Screen videoId={this.state.videoId} roomId={this.state.roomId} />
        <VideoSearch />
        <Chat />
      </div>
    );
  }
}

export default Video;
