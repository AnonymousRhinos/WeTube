import React, { Component } from 'react';
import { Queue } from '../index.js';
import { VideoChat } from '../index.js';
import { Chat } from '../index.js';
import { VideoShare } from '../index.js';
import { VideoSearch } from '../index.js';
import { JoinChat } from '../index.js';
import YouTube from 'react-youtube';
import myFirebase from '../../Firebase/firebaseInit';
import colors from '../../colors.js';
import OpenTok from "opentok";
import tokbox from '../../tokboxConfig'
const apiKey = tokbox.apiKey
const secret = tokbox.secret

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoId: this.props.match.params.id.split('&')[1],
      roomId: this.props.match.params.id,
      name: '',
      color: '',
      sessionId: '',
      token: '',
      playlist: [],
      newVideo: '',
      currentIndex: 0,
      initialVid: true
    };
    this.player = {};
    this.isJoining = true;
    this.highTime = 0;
    this.roomRef = myFirebase.database().ref('rooms/' + this.state.roomId);
    this.usersRef = myFirebase.database().ref('users/' + this.state.roomId);
    this.videosRef = myFirebase.database().ref('videos/' + this.state.roomId);
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.roomId !== this.props.roomId) {
      this.stopListening();
      this.listenToFirebase();
    }
  }

  componentWillUnmount = () => {
    this.stopListening();
    this.stopTicking = true;
  }

  getCurrentTime = () => {
    let time = new Date().toUTCString().slice(-12, -4).split(':');
    time[0] = (+time[0] + 7) % 12;
    time = time.join(':');
    return time
  }

  establishColor = (colorsList) => {
    let names = colorsList.names;
    let randomProperty = function (colorNames) {
      let keys = Object.keys(colorNames)
      return colorNames[keys[Math.floor(keys.length * Math.random())]];
    };
    return randomProperty(names)
  }

  joinRoom = (name) => {
    const opentok = new OpenTok(apiKey, secret);
    let token;
    this.roomRef.once('value')
      .then(snapshot => {
        let value = snapshot.val()
        token = opentok.generateToken(value.sessionId)
        this.setState({ sessionId: value.sessionId, token: token })
        let enterTime = this.getCurrentTime();
        const color = this.establishColor(colors);
        let newName = '';
        if (name) {
          newName = name.replace(/[\.\#\$\[\]\&]+/g, ``)
          console.log("token", token)
          myFirebase.database().ref('users/' + this.state.roomId + '/' + newName).set({ newName, enterTime, token });
          const joinRef = myFirebase.database().ref('messages/' + this.state.roomId);
          const message = {
            user: newName,
            message: `${newName} has entered the theatre`,
            time: enterTime
          };
          joinRef.push(message);
        }
        this.setState({ name: newName, color: color }, () => {
          this.listenToFirebase();
        });
      })
  }

  listenToFirebase = () => {
    let {
      currentIndex,
      playlist,
      update,
      roomId,
      videoId,
      name
    } = this.state;

    let startListeningUsers = () => {
      this
        .usersRef
        .on('child_added', snapshot => {
          let user = snapshot.val();
          let currentTime = this
            .player
            .getCurrentTime();
          let playerStatus = this
            .player
            .getPlayerState();
          this
            .roomRef
            .set({ roomId: roomId, playerStatus, currentTime, sessionId: this.state.sessionId });
        })
    }


    let startListeningRoom = () => {
      this.roomRef.on('value', snapshot => {
        let value = snapshot.val();
        if (value.currentVideo !== this.state.videoId) {
          const newIndex = this.state.playlist.indexOf(value.currentVideo)
          this.setState({ videoId: value.currentVideo, currentIndex: newIndex })
        }

        else {
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
                  this.setState({ currentIndex: this.state.currentIndex + 1 });
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
        if (this.player.getCurrentTime) {
          clientUserRef.update({
            handshake: new Date().getTime(),
            playerTime: this.player.getCurrentTime()

          })
        }
        if (this.stopTicking !== true) {
          startPresence()
        }
      }, 1000)
    }

    let listenForSlowPeople = () => {
      setTimeout(() => {




        this.usersRef.once('value', snapshot => {
          let highTime = 0;
          for (let key in snapshot.val()) {
            if (snapshot.val()[key].playerTime > highTime) {
              highTime = snapshot.val()[key].playerTime;
            }
          }
          if (this.player.getCurrentTime && (this.player.getCurrentTime() + 5 < highTime)) {
            this.player.seekTo(highTime)
          }

        })
        if (this.stopTicking !== true) {
          listenForSlowPeople();
        }
      }, 1500)

    }

    startListeningRoom();
    startPresence();
    listenForSlowPeople()

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
      .set({ videoId });
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
      <div>
        {
          this.state.name ?
            <div className="vid-view">
              {this.state.sessionId
                ? <VideoChat
                  roomId={this.state.roomId}
                  guestName={this.state.name}
                  sessionId={this.state.sessionId}
                  token={this.state.token}
                />
                : <div />
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
                    onEnd={this.handler} />
                  <VideoSearch roomId={this.state.roomId} />
                </div>

                <Chat
                  videoId={this.state.videoId}
                  roomId={this.state.roomId}
                  token={this.state.token}
                  guestName={this.state.name}
                  color={this.state.color}
                />
              </div>
              <Queue
                videoId={this.state.videoId}
                roomId={this.state.roomId}
                playlist={this.state.playlist}
                changeVideo={this.changeVideo}
              />
            </div>
            :
            <div>
              <JoinChat
                joinRoom={this.joinRoom}
              />
            </div>
        }
      </div>
    );
  }
}

export default Video;
