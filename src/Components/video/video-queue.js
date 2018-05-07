import React, { Component } from 'react';
import myFirebase from '../../Firebase/firebaseInit';

class Queue extends Component {
  // constructor(props){
  //   super(props)
  //   this.state = {
  //     playlist: []
  //   }
  // }

  render(props){
    return (
      <div className="video-queue">
        <h2>Playlist</h2>
          {this.props.playlist.length
          ?
        <div className="trend-scroll">
        {
          this.props.playlist.map(queuedVid => {
            return (
        <div key={queuedVid}>
          <h2>Playlist Thumbnails</h2>
        </div>
            )
          })
        }
        </div>
      :
      <div>
      <p>No Videos in Playlist</p>
      </div>
    }
    </div>
    )
  }

}

export default Queue;
