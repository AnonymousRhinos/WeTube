import React, { Component } from 'react';
import YouTube from 'react-youtube';
import myFirebase from '../../Firebase/firebaseInit';

class Screen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: [],
      currentIndex: 0
    };
    this.player = {};
  }

  componentDidMount = () => {
    let {playlist, currentIndex} = this.state;
    //listen for changes in current time, player state in room
    const roomRef = myFirebase.database().ref('rooms/' + this.props.roomId);
    let startListening = () => {
      roomRef.on('value', snapshot => {
        let value = snapshot.val();
        console.log("VALUE", value)
        if (value.playerStatus > -1) {
          let player = this.player;
          let status = value.playerStatus;
          let currentTime = value.currentTime;
          if (status !== player.getPlayerState() || status === 0) {
            if (status === 1) {
              player.seekTo(currentTime);
              player.playVideo();
            } else if (status === 2) player.pauseVideo();
            else if (status === 0) {
              currentIndex++;
              player.loadVideoById(playlist[currentIndex], 2);
            }
          }
        }
      });
    };
    startListening();
    //add initial video and listen for additions to queue
    myFirebase.database().ref('videos/' + this.props.roomId + '/' + this.props.videoId).set({queuedUrl: this.props.videoId});
    const videosRef = myFirebase.database().ref('videos/' + this.props.roomId)
    let startListeningQueue = () => {
      videosRef.on('child_added', snapshot => {
        let video = snapshot.val();
        this.setState({ playlist: playlist.push(video.queuedUrl) });
      });
    };
    startListeningQueue();
  };

  handler = event => {
    myFirebase
      .database()
      .ref('rooms/' + this.props.roomId)
      .set({
        roomId: this.props.roomId,
        playerStatus: event.data,
        currentTime: event.target.getCurrentTime(),
      });
  };

  _onReady = event => {
    this.player = event.target;
    event.target.pauseVideo();
  };

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
      <YouTube
        id="vidScreen"
        videoId={this.props.videoId}
        opts={opts}
        onReady={this._onReady}
        onPlay={this.handler}
        onPause={this.handler}
        onEnd={this.handler}
      />
    );
  }
}

export default Screen;

// // 2. This code loads the IFrame Player API code asynchronously.
// var tag = document.createElement('script');

// tag.src = 'https://www.youtube.com/iframe_api';
// var firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// // 3. This function creates an <iframe> (and YouTube player)
// //    after the API code downloads.
// var player;
// function onYouTubeIframeAPIReady() {
//   player = new YT.Player('player', {
//     height: '390',
//     width: '640',
//     videoId: 'M7lc1UVf-VE',
//     events: {
//       onReady: onPlayerReady,
//       onStateChange: onPlayerStateChange,
//     },
//   });
// }

// // 4. The API will call this function when the video player is ready.
// function onPlayerReady(event) {
//   event.target.playVideo();
// }

// // 5. The API calls this function when the player's state changes.
// //    The function indicates that when playing a video (state=1),
// //    the player should play for six seconds and then stop.
// var done = false;
// function onPlayerStateChange(event) {
//   if (event.data == YT.PlayerState.PLAYING && !done) {
//     setTimeout(stopVideo, 6000);
//     done = true;
//   }
// }
// function stopVideo() {
//   player.stopVideo();
// }
