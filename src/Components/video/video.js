import React, { Component } from 'react';
import { Screen } from '../index.js';
import { Queue } from '../index.js';
import { VideoSearch } from '../index.js';
import { VideoChat } from '../index.js';
import { Chat } from '../index.js';
import { VideoShare } from '../index.js';

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoId: this.props.match.params.id.split('&')[1],
      roomId: this.props.match.params.id,
      playlist: [],
    };
  }

  updatePlaylist = newVideo => {
    const { playlist } = this.state;
    this.setState(prevState => ({playlist: [...prevState.playlist, newVideo]}))
  }

  render() {
    return (
      <div className="vid-view">
        <VideoChat />
        <VideoShare roomId={this.state.roomId}/>
        <div id="video">
          <div id="screen">
            <Screen videoId={this.state.videoId}
                    roomId={this.state.roomId}
                    playlist={this.state.playlist}
                    update={this.updatePlaylist}
                    />
            <VideoSearch roomId={this.state.roomId} />
          </div>
          <Chat videoId={this.state.videoId} roomId={this.state.roomId} />
        </div>
        <Queue videoId={this.state.videoId}
               roomId={this.state.roomId}
               playlist={this.state.playlist}
               />
      </div>
    );
  }
}

export default Video;
