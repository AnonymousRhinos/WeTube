import React, { Component } from 'react';
import { Screen } from '../index.js';
import { Queue } from '../index.js';
import { VideoChat } from '../index.js';
import { Chat } from '../index.js';
import { VideoShare } from '../index.js';
import YouTube from 'react-youtube';
import myFirebase from '../../Firebase/firebaseInit';
import OpenTok from "opentok";
import { VideoSearch } from '../index.js';
import tokbox from '../../tokboxConfig'
const apiKey = tokbox.apiKey
const secret = tokbox.secret

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoId: this.props.match.params.id.split('&')[1],
      roomId: this.props.match.params.id,
      name: "",
      sessionId: '',
      token: '',
      playlist: [],
      newVideo: '',
      currentIndex: 0,
    };
    this.player = {};
    this.isJoining = true;
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.videoId !== this.props.videoId || prevProps.roomId !== this.props.roomId) {
      this.stopListening();
      this.listenToFirebase();
    }
    if(prevState.newVideo !== this.state.newVideo) {
      let player = this.player;
      player.loadVideoById(this.state.newVideo)
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
          sessionId: this.state.sessionId,
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
          if (this.isJoining && this.player.seekTo) {
            this.player.seekTo(currentTime);
            if (status === 1) this.player.playVideo();
            else if (status === 2) this.player.pauseVideo();
            this.isJoining = false;
          } else if (this.player.getPlayerState &&(status !== this.player.getPlayerState() || status === 0)) {
            if (status === 1) {
              this.player.seekTo(currentTime);
              this.player.playVideo();
            } else if (status === 2) this.player.pauseVideo();
            else if (status === 0) {
              if (currentIndex + 1 < this.state.playlist.length) {
                currentIndex++;
                this.player.loadVideoById(this.state.playlist[currentIndex], 2);
              }
              else {
                currentIndex++;
                this.player.stopVideo();
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
      sessionId: this.state.sessionId,
    });
  };

  _onReady = event => {
    console.log('before the onReady', this.player)
    this.player = event.target;
    console.log('after the onReady', this.player)
    event.target.pauseVideo();
  };

  componentWillUnmount = () => {
    this.stopListening();
  }

  componentWillMount = () => {
    const guestName = prompt('Enter name:');
          this.setState({
            name: guestName,
          })
  }

  componentDidMount = () => {
    this.listenToFirebase();
    const opentok = new OpenTok(apiKey, secret);
    const roomRef = myFirebase.database().ref('rooms/' + this.props.match.params.id);
    roomRef.once('value')
      .then(snapshot => {
        let value = snapshot.val()
          let token = opentok.generateToken(value.sessionId)
          this.setState({
            sessionId: value.sessionId,
            token: token
          })
      })
  }

  updatePlaylist = newVideo => {
    const { playlist } = this.state;
    this.setState(prevState => ({ playlist: [...prevState.playlist, newVideo] }))
  }

  changeVideo = (newVideo) => {
    this.setState({newVideo: newVideo})

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
      {
        this.state.sessionId ?
        <VideoChat
          roomId={this.state.roomId}
          guestName={this.state.name}
          sessionId={this.state.sessionId}
          token={this.state.token}
        />
        :
        <div />
      }
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

          <Chat
            videoId={this.state.videoId}
            roomId={this.state.roomId}
            token={this.state.token}
            guestName={this.state.name}
          />
        </div>
        <Queue videoId={this.state.videoId}
               roomId={this.state.roomId}
               playlist={this.state.playlist}
               changeVideo={this.changeVideo}
               />
      </div>
    );
  }
}

export default Video;
