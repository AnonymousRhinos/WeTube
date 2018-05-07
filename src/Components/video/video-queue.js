import React, { Component } from 'react';
import myFirebase from '../../Firebase/firebaseInit';

class Queue extends Component {

  render(props){
    return (
      <div className="trending-component">
        <h2>Playlist</h2>
          {this.props.playlist.length
          ?
        <div className="trend-scroll">
        {
          this.props.playlist.map(queuedVid => {
            return (
        <div key={queuedVid} className="mini-vid">
          <img src={`https://img.youtube.com/vi/${queuedVid}/hqdefault.jpg`} className='trendingThumbnail' />
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
