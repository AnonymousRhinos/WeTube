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

const getTime = () => {
    let time = new Date().toUTCString().slice(-12, -4).split(':');
    time[0] = (+time[0] - 5) % 12;
    let meridian;
    if (time[0] >= 12) meridian = 'PM'
    else meridian = 'PM'
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
      name: '',
      color: '',
      sessionId: '',
      token: '',
      playlist: [],
      newVideo: '',
      currentIndex: 0,
      initialVid: true,
      theaterMode: false,
      windowWidth: window.innerWidth,
    };
    this.player = {};
    this.targetTime = 0;
    this.roomRef = myFirebase.database().ref('rooms/' + this.state.roomId);
    this.usersRef = myFirebase.database().ref('users/' + this.state.roomId);
    this.videosRef = myFirebase.database().ref('videos/' + this.state.roomId);
    this.joinRef = myFirebase.database().ref('messages/' + this.state.roomId);
  }

  componentDidUpdate = (prevProps, prevState) => {
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
          let targetTime = 0;
            this.roomRef.once('value', snapshot2 => {
              console.log('yo sup... the rooms time is from ', snapshot2.val().currentTime);
              //here we set local target time from the database
              targetTime = snapshot2.val().currentTime;
            })
          .then( () => {
            
            //now we loops through each user
            for (let key in snapshot.val()) {
              let timeStuff = snapshot.val()[key].enterTime.split(':');
              let timeStuffDateObj;
              timeStuffDateObj = new Date();
              let pmCheck = () => {
                if(timeStuff[2].slice(-2) === "PM"){
                  timeStuff[0] = (Number(timeStuff[0]) + (12)).toString();
                }
                else{
                  timeStuff[0] = timeStuff[0];
                }
              }
              pmCheck();
              timeStuff[2] = timeStuff[2].slice(0,2);
              timeStuffDateObj.setHours(timeStuff[0], timeStuff[1], timeStuff[2]);
              
              //check to see if the user is "new" (e.g. joined the room less than 10 seconds ago)
              if(this.player.getCurrentTime && (Math.abs((new Date().getTime() - timeStuffDateObj.getTime())) < 10000) ){
                //too new, dont notice
                console.log('my player: ', this.player.getCurrentTime());
                console.log('the room is: ', targetTime);
                if (this.player.getCurrentTime && (this.player.getCurrentTime() + 5 < targetTime)) {
                  this.player.seekTo(targetTime)
                  }
                console.log('yall dont see me');
                continue
              }
              //if the user is old, proceed to see if the user is 3 seconds off the room's time
              else if (Math.abs(snapshot.val()[key].playerTime - targetTime) > 3) {
                console.log('IM AN OLD LOOSE CANNON-----------------------------');
                console.log('1: ', snapshot.val()[key].playerTime)
                console.log('2: ', targetTime)
                //if the user is 3 seconds off, it will update the room's time to this new time
                targetTime = snapshot.val()[key].playerTime;
                this.roomRef.update({
                  currentTime: targetTime
                })
              }
            }
            // if (this.player.getCurrentTime && (this.player.getCurrentTime() + 5 < targetTime)) {
            //   this.player.seekTo(targetTime)
            // }
          })






          })
        if (this.stopTicking !== true) {
          listenForSlowPeople();
        }
      }, 1500)
    }

    let startListeningVideos = () => {
      this.videosRef.on('child_added', snapshot => {
        let video = snapshot.val();
        this.updatePlaylist(video.videoId)
      });
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
    this.videosRef.off();
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
    this.setState(prevState => ({ playlist: [...prevState.playlist, newVideo] }))
  }

  changeVideo = (newVideo) => {
    this.roomRef.update({
      currentVideo: newVideo,
      currentTime: 0,
      playerStatus: 1,
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
    if ( this.state.windowWidth !==  window.innerWidth - 100 ) {
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
                        <span className="tooltiptext">Theater Mode</span>
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
                />
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

export default Video;
