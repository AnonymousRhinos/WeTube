import React, { Component } from 'react';
import Screen from './video-screen';

class Video extends Component {

  constructor(props) {
    super(props)
    this.state = {
        videoId: this.props.match.params.id.split('&')[1],
        roomId: this.props.match.params.id
    }
}

  render() {
    console.log("STATE IN VIDEO", this.state)
    return (
      <div>
        <Screen videoId={this.state.videoId}/>
      </div>
    );
  }
}

export default Video;
