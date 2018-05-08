import React, { Component } from 'react';
import { Screen } from '../index.js';
import { Queue } from '../index.js';
import { VideoSearch } from '../index.js';
import { VideoChat } from '../index.js';
import { Chat } from '../index.js';
import { VideoShare } from '../index.js';
import YouTube from 'react-youtube';
import myFirebase from '../../Firebase/firebaseInit';

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoId: this.props.match.params.id.split('&')[1],
      roomId: this.props.match.params.id,
      playlist: [],
      currentIndex: 0,
    };
    this.player = {};
    this.isJoining = true;
  }

  componentDidMount = () => {
    this.listenToFirebase();
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.videoId !== this.props.videoId || prevProps.roomId !== this.props.roomId) {
      this.stopListening();
      this.listenToFirebase();
    }
  }

  listenToFirebase = () => {
    let { currentIndex, playlist, update, roomId, videoId } = this.state;
    this.usersRef = myFirebase.database().ref('users/' + roomId);
    this.roomRef = myFirebase.database().ref('rooms/' + roomId);

    let startListeningUsers = () => {
      this.usersRef.on('child_added', snapshot => {
        let user = snapshot.val();
        let currentTime = this.player.getCurrentTime();
        let playerStatus = this.player.getPlayerState();
        // console.log('running, currentTime:', currentTime)
        this.roomRef.set({
          roomId: roomId,
          playerStatus,
          currentTime,
        });
      })
    }

    let startListeningRoom = () => {
      this.roomRef.on('value', snapshot => {
        let value = snapshot.val();
        if (value.playerStatus > -1) {
          let player = this.player;
          let status = value.playerStatus;
          let currentTime = value.currentTime;
          if (this.isJoining) {
            // console.log('status', status, 'current time', currentTime)
            player.seekTo(currentTime);
            if (status === 1) player.playVideo();
            else if (status === 2) player.pauseVideo();
            this.isJoining = false;
          } else if (status !== player.getPlayerState() || status === 0) {
            if (status === 1) {
              player.seekTo(currentTime);
              player.playVideo();
            } else if (status === 2) player.pauseVideo();
            else if (status === 0) {
              if (currentIndex + 1 < this.state.playlist.length) {
                currentIndex++;
                player.loadVideoById(this.state.playlist[currentIndex], 2);
              }
              else {
                currentIndex++;
                player.stopVideo();
              }
            }
          }
        }
      });
    };
    startListeningRoom();

    this.videosRef = myFirebase.database().ref('videos/' + roomId);
    let startListeningVideos = () => {
      this.videosRef.on('child_added', snapshot => {
        let video = snapshot.val();
        console.log('running', video.videoId)
        this.updatePlaylist(video.videoId)
      });
    };
    startListeningVideos();
    myFirebase
      .database()
      .ref('videos/' + roomId + '/' + videoId)
      .set({ videoId });
  }

  stopListening = () => {
    this.roomRef.off();
    this.videosRef.off();
    this.usersRef.off();
  }

  handler = event => {
    this.roomRef.set({
      roomId: this.state.roomId,
      playerStatus: event.data,
      currentTime: event.target.getCurrentTime(),
    });
  };

  _onReady = event => {
    this.player = event.target;
    console.log(this.player)
    event.target.pauseVideo();
  };

  componentWillUnmount = () => {
    this.stopListening();
  }

  updatePlaylist = newVideo => {
    const { playlist } = this.state;
    this.setState(prevState => ({ playlist: [...prevState.playlist, newVideo] }))
  }

  render() {
    const opts = {
      height: '390',
      width: '640',
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
        enablejsapi: 1,
        modestbranding: 1,
        //origin: ourdomain.com,
        rel: 0,
      },
    };

    return (
      <div className="vid-view">
        <VideoShare roomId={this.state.roomId} />
        <div id="video">
          <div id="screen">
            <YouTube
              id="vidScreen"
              videoId={this.state.videoId}
              opts={opts}
              onReady={this._onReady}
              onPlay={this.handler}
              onPause={this.handler}
              onEnd={this.handler}
            />
            <VideoSearch roomId={this.state.roomId} />
          </div>
          <Chat player={this.player} videoId={this.state.videoId} roomId={this.state.roomId} />
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
