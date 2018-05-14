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
      playerTime: 0,
      playlistAddedTime: [],
      currentIndex: 0,
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
        let status = value.playerStatus;
        let currentTime = value.currentTime;
        if (value.currentVideo !== this.state.videoId) {
          const newIndex = this.state.playlist.indexOf(value.currentVideo)
          this.setState({ videoId: value.currentVideo, currentIndex: newIndex }, () => {
            if (this.player.seekTo) this.player.seekTo(0)
          })
          //can't get the player to stop at beginning of first video when deleting last video
          if(status === 2 && this.player.stopVideo) {
            //getting here but ignoring the stopvideo command
            this.player.stopVideo();
          }
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
    
    let listenForNewTimes = () => {
      setTimeout( () => {
        let targetTime = 0;
        let packLeader = false; 
        let myTime = 0;
        if(this.player.getCurrentTime){
          myTime = this.player.getCurrentTime()
        }

        this.roomRef.once('value', snapshot => {
          targetTime = snapshot.val().currentTime;
          // console.log('Room time is: ', targetTime)

        })
        .then( () => {
          
          if(this.player.getCurrentTime && (Math.abs(this.player.getCurrentTime() - targetTime) > 0.75)){

            //inside this promise we need to determine who the front runner is and assign packleader
            this.usersRef.once('value', snapshot2 => {

              //this loop will pull all users times and if that is the client, it will push the new time
              let leaderTime = 0;
              for (let key in snapshot2.val()) {
                  if(snapshot2.val()[key].playerTime > leaderTime){
                    leaderTime = snapshot2.val()[key].playerTime;
                  }
              }
              //after it's all said and done, if the client is leader,
              // console.log('my time is: ', myTime);
              // console.log('leder timeL ', leaderTime)
                //this if statement is currently useless!!!
              // if(leaderTime === myTime){
              //   console.log('hiya im leading')
              // }

              // console.log('the second promise is done: ')
              // console.log('TS Date: ', timeStuffDateObj.getTime()); 

            })

            //check for difference in between local and room time
            //want to update room time if the trend setter.... but what's the best mechanic?
              //person in front
              //perosn greater than 5 seconds from the previous pack leaders - (front man) if not new room time.
                //need mechanism to prevent bounce back to front.
              this.roomRef.update({
                currentTime: this.player.getCurrentTime()
              })
          }



        })


        if (this.stopTicking !== true) {
          listenForNewTimes();
        }
      }, 1000)

    }

    // let listenForSlowPeople = () => {
    //   console.log('hiay')
    //   setTimeout(() => {
    //     this.usersRef.once('value', snapshot => {
    //       let targetTime = 0;
    //         this.roomRef.once('value', snapshot2 => {
    //           console.log('Room time from db is ', snapshot2.val().currentTime);
    //           //here we set local target time from the room time of the database
    //           targetTime = snapshot2.val().currentTime;
    //         })
    //       .then( () => {
            
    //         // //now we loops through each user
    //         // for (let key in snapshot.val()) {
    //         //   let timeStuff = snapshot.val()[key].enterTime.split(':');
    //         //   let timeStuffDateObj;
    //         //   timeStuffDateObj = new Date();
    //         //   let pmCheck = () => {
    //         //     if(timeStuff[2].slice(-2) === "PM"){
    //         //       timeStuff[0] = (Number(timeStuff[0]) + (12)).toString();
    //         //     }
    //         //     else{
    //         //       timeStuff[0] = timeStuff[0];
    //         //     }
    //         //   }
    //         //   pmCheck();
    //         //   timeStuff[2] = timeStuff[2].slice(0,2);
    //         //   timeStuffDateObj.setHours(timeStuff[0], timeStuff[1], timeStuff[2]);
              
    //           //check to see if the user is "new" (e.g. joined the room less than 10 seconds ago)
    //           console.log(timeStuffDateObj.getTime(), 'Join Time ')
    //           console.log(new Date().getTime(), 'Now Time ')

    //           if(this.player.getCurrentTime && (Math.abs((new Date().getTime() - timeStuffDateObj.getTime())) < 10000) ){
    //             if (this.player.getCurrentTime && (Math.abs(this.player.getCurrentTime() - targetTime) > 3)) {
    //               //user is young. seek to the room time
    //               this.player.seekTo(targetTime)
    //               }
    //             console.log('yall dont see me');
    //             continue
    //           }
    //           //if the user is old, proceed to see if the user is 3 seconds off the room's time
    //           else if (Math.abs(snapshot.val()[key].playerTime - targetTime) > 3) {
    //             console.log('I AM CHANGING ROOM TIME HERE------------- will now be: ', snapshot.val()[key].playerTime);
    //             //if the user is 3 seconds off, it will update the room's time to this new time
    //             targetTime = snapshot.val()[key].playerTime;
    //             this.roomRef.update({
    //               currentTime: targetTime
    //             })
    //           }
    //         }
    //         // if (this.player.getCurrentTime && (this.player.getCurrentTime() + 5 < targetTime)) {
    //         //   this.player.seekTo(targetTime)
    //         // }
    //       })






    //       })
    //     if (this.stopTicking !== true) {
    //       listenForSlowPeople();
    //     }
    //   }, 500)
    // }

    let startListeningVideos = () => {
      this.videosRef.on('child_added', snapshot => {
        let addedVideo = snapshot.val();
        this.updatePlaylist(addedVideo.videoId, addedVideo.timeAdded)
      });
      this.videosRef.on('child_removed', snapshot => {
        let removedVideo = snapshot.val().videoId;
        this.removeFromPlaylist(removedVideo);
      })
    };
    listenForNewTimes();
    startListeningVideos();
    startListeningRoom();
    startPresence();
    // listenForSlowPeople()
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

  updatePlaylist = (newVideo, timeAdded) => {
    this.setState(prevState => ({
      playlist: [...prevState.playlist, newVideo],
      playlistAddedTime: [...prevState.playlistAddedTime, timeAdded]
    }), () => {
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

  removeFromDatabase = videoId => {
    myFirebase.database().ref('videos/' + this.state.roomId + '/' + videoId).remove();
    // let { currentIndex } = this.state
    // console.log('before remove: playlist', this.state.playlist)
    // this.setState({ playlist: this.state.playlist.filter(id => id !== videoId) }, () => {
    //   console.log('removing current video, currentindex', currentIndex, 'playlist', this.state.playlist)
    //   if (videoId === this.state.videoId) {
    //     if (currentIndex < this.state.playlist.length)
    //       this.roomRef.update({
    //         currentVideo: this.state.playlist[currentIndex],
    //         currentTime: 0,
    //         playerStatus: 1
    //       })
    //     else {
    //       console.log('hitting the end, so stop')
    //       this.player.stopVideo();
    //     }
    //   }

    // })

  }

  removeFromPlaylist = removedVideo => {
    let removedIndex;
    let { currentIndex, videoId } = this.state;
    const filteredPlaylist = this.state.playlist.filter((id, index) => {
      if (id === removedVideo) removedIndex = index;
      return id !== removedVideo;
    })
    const filteredPlaylistAddedTime = this.state.playlistAddedTime.filter((item, index) => index !== removedIndex)
    console.log('before remove: playlist', this.state.playlist)
    this.setState({
      playlist: filteredPlaylist,
      playlistAddedTime: filteredPlaylistAddedTime
    }, () => {
      if(this.state.playlist.length === 0){
        //do something when the last video has been removed
      }
      if (removedVideo === this.state.videoId) {
        console.log('currentindex', currentIndex, 'playlist', this.state.playlist[0])
        if (this.state.currentIndex < this.state.playlist.length)
          this.roomRef.update({
            currentVideo: this.state.playlist[this.state.currentIndex],
            currentTime: 0,
            playerStatus: 1
          })
        else {
          this.roomRef.update({
            currentVideo: this.state.playlist[0],
            currentTime: 0,
            playerStatus: 2
          })
          // console.log('hitting the end, so stop')
          // this.player.cueVideoById(this.state.playlist[0]);
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

  addVideoToDatabase = (evt, videoId) => {
    evt.preventDefault();
    myFirebase.database().ref('videos/' + this.state.roomId + '/' + videoId).set({
      videoId,
      timeAdded: new Date().getTime()
    });
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
                      // videoId={this.state.videoId}
                      playlist={this.state.playlist}
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
                  playlistAddedTime={this.state.playlistAddedTime}
                  changeVideo={this.changeVideo}
                  removeFromDatabase={this.removeFromDatabase}
                />
                <div className="trend-in-theater">
                  <TrendingComponent handleClick={this.addVideoToDatabase} />
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
