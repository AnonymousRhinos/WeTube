import React, { Component } from 'react';
import { Queue } from '../index.js';
import { VideoChat } from '../index.js';
import { Chat } from '../index.js';
import { VideoShare } from '../index.js';
import YouTube from 'react-youtube';
import myFirebase from '../../Firebase/firebaseInit';
import OpenTok from "opentok";
import {VideoSearch} from '../index.js';
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
      initialVid: true
    };
    this.player = {};
    this.isJoining = true;
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.roomId !== this.props.roomId) {
      this.stopListening();
      this.listenToFirebase();
    }
  }

  listenToFirebase = () => {
    let { roomId, videoId, name } = this.state;
    this.usersRef = myFirebase.database().ref('users/' + roomId);
    this.roomRef = myFirebase.database().ref('rooms/' + roomId);

    let startListeningRoom = () => {
      this.roomRef.on('value', snapshot => {
        let value = snapshot.val();
        if(value.currentVideo !== this.state.videoId) {
          const newIndex = this.state.playlist.indexOf(value.currentVideo)
          this.setState({videoId: value.currentVideo, currentIndex: newIndex})
        }

        else{
          if (value.playerStatus > -1) {
            let status = value.playerStatus;
            let currentTime = value.currentTime;

            if (this.isJoining && this.player.seekTo) {
              this.player.seekTo(currentTime);
              if (status === 1) this.player.playVideo();
              else if (status === 2) this.player.pauseVideo();
              this.isJoining = false;
            } 
            
            else if (this.player.getPlayerState && (status !== this.player.getPlayerState() || status === 0)) {
              if (status === 1) {
                this.player.seekTo(currentTime);
                this.player.playVideo();
              } else if (status === 2) this.player.pauseVideo();

              else if (status === 0) {
                if (this.state.currentIndex + 1 < this.state.playlist.length) {
                  console.log(4)
                  this.setState({currentIndex: this.state.currentIndex + 1});
                  this.roomRef.update({ 
                    currentVideo: this.state.playlist[this.state.currentIndex],
                    currentTime: 0,
                    playerStatus: 1
                  })

                  // this.player.loadVideoById(this.state.playlist[this.state.currentIndex], 2);
                }
                else {
                  this.setState({currentIndex: this.state.currentIndex + 1});
                  this.player.stopVideo();
                }
              }
            }

          }
        }
      });
    }

    let startPresence = () => {

      setTimeout(() => {
        let clientUserRef = myFirebase
          .database()
          .ref(`users/${roomId}/${name}`);
        clientUserRef.update({
          handshake: new Date().getTime()
        })
        if (this.stopTicking !== true) {
          startPresence();
        }
      }, 1000)
    }

    startListeningRoom();
    startPresence();

    this.videosRef = myFirebase
      .database()
      .ref('videos/' + roomId);
    let startListeningVideos = () => {
      this.videosRef.on('child_added', snapshot => {
        let video = snapshot.val();
        this.updatePlaylist(video.videoId)
      });
    };
    startListeningVideos();
    myFirebase
      .database()
      .ref('videos/' + roomId + '/' + videoId)
      .set({videoId});
  }

  stopListening = () => {
    this.roomRef.off();
    this.videosRef.off();
  }

  handler = event => {
    this.roomRef.update({
      roomId: this.state.roomId,
      playerStatus: event.data,
      currentTime: event.target.getCurrentTime(),
    });
  };

  _onReady = event => {
    this.player = event.target;
    event.target.stopVideo();
  };

  componentWillUnmount = () => {
    this.stopListening();
    this.stopTicking = true;
  }

  componentWillMount = () => {
    const guestName = prompt('Enter name:');
    this.setState({name: guestName})
  }

  componentDidMount = () => {
    this.listenToFirebase();
    const opentok = new OpenTok(apiKey, secret);
    this.roomRef.once('value')
      .then(snapshot => {
        let value = snapshot.val()
        let token = opentok.generateToken(value.sessionId)
        this.setState({sessionId: value.sessionId, token: token})
      })
  }

  updatePlaylist = newVideo => {
    this.setState(prevState => ({ playlist: [...prevState.playlist, newVideo] }))
  }

  changeVideo = (newVideo) => {
      this.roomRef.update({
        currentVideo: newVideo,
        currentTime: 0,
        playerStatus: 2,
      })
  }

  render() {
    const opts = {
      height: '390',
      width: '640',
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        enablejsapi: 1,
        modestbranding: 1,
        //origin: ourdomain.com,
        rel: 0
      }
    };

    return (
      <div className="vid-view">
        {this.state.sessionId
          ? <VideoChat
              roomId={this.state.roomId}
              guestName={this.state.name}
              sessionId={this.state.sessionId}
              token={this.state.token}/>
          : <div/>
}
        <VideoShare roomId={this.state.roomId}/>
        <div id="video">
          <div id="screen">
            <YouTube
              id="vidScreen"
              videoId={this.state.videoId}
              opts={opts}
              onReady={this._onReady}
              onPlay={this.handler}
              onPause={this.handler}
              onEnd={this.handler} />
            <VideoSearch roomId={this.state.roomId} />
          </div>

          <Chat
            videoId={this.state.videoId}
            roomId={this.state.roomId}
            token={this.state.token}
            guestName={this.state.name}/>
        </div>
        <Queue
          videoId={this.state.videoId}
          roomId={this.state.roomId}
          playlist={this.state.playlist}
          changeVideo={this.changeVideo}/>
      </div>
    );
  }
}

export default Video;
