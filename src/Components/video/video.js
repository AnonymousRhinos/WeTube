import React, { Component } from 'react';
import { Queue, VideoChat, Chat, VideoShare, VideoSearch, JoinChat, TrendingComponent } from '../index.js';
import { withRouter } from 'react-router-dom';
import YouTube from 'react-youtube';
import myFirebase from '../../Firebase/firebaseInit';
import colors from '../../colors.js';
import OpenTok from 'opentok';
import tokbox from '../../tokboxConfig'
const apiKey = tokbox.apiKey
const secret = tokbox.secret

const getTime = () => {
  let time = new Date().toUTCString().slice(-12, -4).split(':');
  let meridian;
  if (time[0] - 5 >= 12) meridian = 'PM'
  else meridian = 'AM'
  time[0] = (+time[0] - 5 - 1) % 12 + 1;
  time = time.join(':') + meridian;
  return time
}

const establishColor = (colorsList) => {
  let names = colorsList.names;
  let randomProperty = function (colorNames) {
    let keys = Object.keys(colorNames)
    return colorNames[keys[Math.floor(keys.length * Math.random())]];
  };
  return randomProperty(names)
}

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoId: this.props.match.params.id.split('&')[1],
      roomId: this.props.match.params.id,
      name: this.props.userName,
      color: '',
      sessionId: '',
      token: '',
      playlist: [],
      currentIndex: 0,
      theaterMode: false,
      windowWidth: window.innerWidth,
    };
    this.player = {};
    this.highTime = 0;
    this.roomRef = myFirebase.database().ref('rooms/' + this.state.roomId);
    this.usersRef = myFirebase.database().ref('users/' + this.state.roomId);
    this.videosRef = myFirebase.database().ref('videos/' + this.state.roomId);
    this.joinRef = myFirebase.database().ref('messages/' + this.state.roomId);
  }

  componentDidMount = () => {
    if (this.state.name) {
      this.joinRoom(this.state.name)
    }
  }
  
  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.userName !== this.props.userName) {
      this.joinRoom(this.props.userName)
    }
    if (prevProps.roomId !== this.props.roomId) {
      this.stopListening();
      this.listenToFirebase();
    }
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount = () => {
    this.stopListening();
    this.stopTicking = true;
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  joinRoom = (name) => {
    const opentok = new OpenTok(apiKey, secret);
    let token;
    this.roomRef.once('value')
      .then(snapshot => {
        let value = snapshot.val()
        token = opentok.generateToken(value.sessionId)
        this.setState({ sessionId: value.sessionId, token: token })
        let enterTime = getTime();
        const color = establishColor(colors);
        let newName = '';
        if (name) {
          newName = name.replace(/[\.\#\$\[\]\&]+/g, ``)
          myFirebase.database().ref('users/' + this.state.roomId + '/' + newName).set({ newName, enterTime, token });
          const message = {
            user: 'Admin',
            message: `${newName} has entered the theatre`,
            time: enterTime
          };
          this.joinRef.push(message);
        }
        this.setState({ name: newName, color: color }, () => {
          this.listenToFirebase();
        });
      })
  }

  listenToFirebase = () => {
    let { roomId, videoId, name } = this.state;

    let startListeningRoom = () => {
      this.roomRef.on('value', snapshot => {
        let value = snapshot.val();
        if (value.currentVideo !== this.state.videoId) {
          const newIndex = this.state.playlist.indexOf(value.currentVideo)
          this.setState({ videoId: value.currentVideo, currentIndex: newIndex }, () => {
            if (this.player.seekTo) this.player.seekTo(0)
          })
        }

        else {
          if (value.playerStatus > -1) {
            let status = value.playerStatus;
            let currentTime = value.currentTime;

            if (this.player.getPlayerState && (status !== this.player.getPlayerState() || status === 0)) {
              if (status === 1) {
                this.player.seekTo(currentTime);
                this.player.playVideo();
              } else if (status === 2) this.player.pauseVideo();

              else if (status === 0) {
                if (this.state.currentIndex + 1 < this.state.playlist.length) {
                  this.setState({ currentIndex: this.state.currentIndex + 1 });
                  this.roomRef.update({
                    currentVideo: this.state.playlist[this.state.currentIndex],
                    currentTime: 0,
                    playerStatus: 1
                  })
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
        this.clientUserRef = myFirebase.database().ref(`users/${roomId}/${name}`);
        if (this.player.getCurrentTime) {
          this.clientUserRef.update({
            handshake: new Date().getTime(),
            playerTime: this.player.getCurrentTime() || 0,
            videoId: this.state.videoId
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
          if (this.player.getCurrentTime && (this.player.getCurrentTime() + 5 < highTime) && (this.state.videoId === snapshot.val()[this.state.name].videoId)) {
            this.player.seekTo(highTime)
          }
        })
        if (this.stopTicking !== true) {
          listenForSlowPeople();
        }
      }, 1500)
    }

    let startListeningVideos = () => {
      this.videosRef.on('child_added', snapshot => {
        let addedVideo = snapshot.val();
        this.updatePlaylist(addedVideo.videoId)
      });
      this.videosRef.on('child_removed', snapshot => {
        let removedVideo = snapshot.val().videoId;
        this.setState({ playlist: this.state.playlist.filter(id => id !== removedVideo) })
      })
    };
    startListeningVideos();
    startListeningRoom();
    startPresence();
    listenForSlowPeople()

    myFirebase.database().ref('videos/' + roomId + '/' + videoId).set({ videoId });
  }

  stopListening = () => {
    this.roomRef.off();
    this.videosRef.off();
    this.usersRef.off();
    this.joinRef.off();
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
    this.setState(prevState => ({ playlist: [...prevState.playlist, newVideo] }), () => {
      console.log('adding to playlist', this.state.playlist)
    })
  }

  changeVideo = (newVideo) => {
    this.roomRef.update({
      currentVideo: newVideo,
      currentTime: 0,
      playerStatus: 1,
    })
  }

  removeFromQueue = videoId => {
    let { currentIndex } = this.state
    myFirebase.database().ref('videos/' + this.state.roomId + '/' + videoId).remove();
    console.log('before remove: playlist', this.state.playlist)
    this.setState({ playlist: this.state.playlist.filter(id => id !== videoId) }, () => {
      console.log('removing current video, currentindex', currentIndex, 'playlist', this.state.playlist)
      if (videoId === this.state.videoId) {
        if (currentIndex < this.state.playlist.length)
          this.roomRef.update({
            currentVideo: this.state.playlist[currentIndex],
            currentTime: 0,
            playerStatus: 1
          })
        else {
          console.log('hitting the end, so stop')
          this.player.stopVideo();
        }
      }

    })

  }

  toggleTheater = (evt) => {
    evt.preventDefault();
    this.setState({
      theaterMode: !this.state.theaterMode,
    }, () => {
      let width = this.state.theaterMode ? (this.state.windowWidth).toString() : '640';
      let height = this.state.theaterMode ? (this.state.windowWidth / 640 * 390).toString() : '390';
      this.player.setSize(width, height)
    })
  }

  updateDimensions() {
    if (this.state.windowWidth !== window.innerWidth - 100) {
      this.setState({
        windowWidth: window.innerWidth - 100
      }, () => {
        if (this.state.theaterMode) {
          let width = (this.state.windowWidth).toString();
          let height = (this.state.windowWidth / 640 * 390).toString();
          this.player.setSize(width, height)
        }
      });
    }
  }

  addToQueue = (evt, videoId) => {
    evt.preventDefault();
    myFirebase.database().ref('videos/' + this.state.roomId + '/' + videoId).set({ videoId });
  }

  render() {
    const opts = {
      height: '390',
      width: '640',
      playerVars: {
        autoplay: 1,
        enablejsapi: 1,
        modestbranding: 1,
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
              <div className="vid-col">
                <div id="video">
                  <div className="screen-chat-container">
                    <VideoShare roomId={this.state.roomId} />
                    <div id="screen">
                      <YouTube
                        id="vidScreen"
                        videoId={this.state.videoId}
                        opts={opts}
                        onReady={this._onReady}
                        onPlay={this.handler}
                        onPause={this.handler}
                        onEnd={this.handler} />
                      <div className="theater-container">
                        <button
                          className="btn theater"
                          onClick={this.toggleTheater}
                        >▭
                        <span className="tooltiptext">{this.state.theaterMode ? 'Default View' : 'Theater Mode'}</span>
                        </button>
                        <VideoSearch roomId={this.state.roomId} />
                      </div>
                    </div>
                    <Chat
                      videoId={this.state.videoId}
                      roomId={this.state.roomId}
                      token={this.state.token}
                      guestName={this.state.name}
                      color={this.state.color}
                    />
                  </div>
                </div>
                <Queue
                  videoId={this.state.videoId}
                  roomId={this.state.roomId}
                  playlist={this.state.playlist}
                  changeVideo={this.changeVideo}
                  removeFromQueue={this.removeFromQueue}
                />
                <div className="trend-in-theater">
                  <TrendingComponent handleClick={this.addToQueue} />
                </div>
              </div>
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

export default withRouter(Video);
