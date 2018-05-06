import React, { Component } from 'react';
import myFirebase from '../../Firebase/firebaseInit';

class Queue extends Component {
  constructor(props){
    super(props)
    this.state = {
      playlist: []
    }
  }

  componentDidMount(){
    let { playlist } = this.state;
    myFirebase
      .database()
      .ref('videos/' + this.props.roomId + '/' + this.props.videoId)
      .set({ queuedUrl: this.props.videoId });
    const videosRef = myFirebase.database().ref('videos/' + this.props.roomId);
    let startListeningQueue = () => {
      videosRef.on('child_added', snapshot => {
        let video = snapshot.val();
        this.setState({ playlist: playlist.push(video.queuedUrl) });
      });
    };
    startListeningQueue();
  }

  render(){
    return (
      <div className="video-queue">
        <h2>Playlist</h2>
          {this.state.playlist.length
          ?
        <div className="trend-scroll">
        {
          this.state.playlist.map(queuedVid => {
            return (
        <div>
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
