import React, { Component } from 'react';
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react';
import tokbox from '../../tokboxConfig'
const apiKey = tokbox.apiKey

/*
https://tokbox.com/developer/sdks/js/reference/Publisher.html#publishAudio
setStyle(style, value) → {Publisher}

will need to use publishAudio
publishAudio(value) - Starts publishing audio (if it is currently not being published) when the value is true;
stops publishing audio (if it is currently being published) when the value is false.
 to toggle audio based on play and pause

buttonDisplayMode (String) — How to display the microphone controls. Possible values are: "auto"
(controls are displayed when the stream is first displayed and when the user mouses over the display),
"off" (controls are not displayed), and "on" (controls are always displayed).

nameDisplayMode (String) — Whether to display the stream name. Possible values are:
"auto" (the name is displayed when the stream is first displayed and when the user mouses over the display),
"off" (the name is not displayed), and "on" (the name is always displayed).
*/

class VideoChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoUrl: '',
      joinChat: false,
      myAudioOn: false,
      myVideoOn: true,
      allAudioOn: true,
      isFixed: false
    };
  }

  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const scrollPosition = window.scrollY;
    console.log('scrollposition', scrollPosition)
    if(scrollPosition > 82){
      this.setState({isFixed: true})
    } else {
      this.setState({isFixed: false})
    }
  }

  joinVideo = () => {
    this.setState({
      joinChat: !this.state.joinChat
    })
  }

  toggleMyAudio = () => {
    this.setState({
      myAudioOn: !this.state.myAudioOn
    })
  }

  toggleMyVideo = () => {
    this.setState({
      myVideoOn: !this.state.myVideoOn
    })
  }

  toggleAllAudio = () => {
    this.setState({
      allAudioOn: !this.state.allAudioOn
    })
  }

  render() {
    let videoClass = this.state.isFixed ? "videochat-box-fixed": null;
    return (
      <div className="video-chat">
        {
          this.state.joinChat ?
            <div className="row">
              <div>
                <button
                  className="btn"
                  onClick={this.joinVideo}
                >Exit Video Chat</button>
              </div>
              <div className={videoClass}>
                <OTSession
                  apiKey={apiKey}
                  sessionId={this.props.sessionId}
                  token={this.props.token}
                  onError={(err) => console.log(err)}
                >
                  <div className="mute-btn-container">
                    <button
                      className={this.state.myVideoOn ? "unMute-btn" : "mute-btn"}
                      onClick={this.toggleMyVideo}
                    >
                      <img className="chat-icon" src={this.state.myVideoOn ? "/images/video-on.png" : "/images/video-off.png"}
                        alt="video" />
                    </button>
                    <button
                      className={this.state.myAudioOn ? "unMute-btn" : "mute-btn"}
                      onClick={this.toggleMyAudio}
                      alt="mute"
                    >
                      <img className="chat-icon" src={this.state.myAudioOn ? "/images/mic-on.png" : "/images/mic-off.png"}
                        alt="mic"
                      />
                    </button>
                    <button
                      className="unMute-btn"
                      onClick={this.toggleAllAudio}
                    >
                      <img className="chat-icon" src={this.state.allAudioOn ? "/images/audio-on.png" : "/images/no-audio.png"}
                        alt="audio"
                      />
                    </button>
                  </div>
                  <OTPublisher
                    properties={{
                      width: 200,
                      height: 200,
                      publishAudio: this.state.myAudioOn,
                      publishVideo: this.state.myVideoOn,
                      name: this.props.guestName,
                      showControls: false
                    }}
                  />
                  <OTStreams>
                    <OTSubscriber
                      properties={{
                        width: 200,
                        height: 200,
                        subscribeToAudio: this.state.allAudioOn,
                        subscribeToVideo: true,
                      }}
                    />
                  </OTStreams>
                </OTSession>
              </div>
            </div>
            :
            <div>
              <button
                className="btn"
                id="join-vid-chat-btn"
                onClick={this.joinVideo}
              >Join Video Chat</button>
            </div>
        }
      </div>
    );
  }
}

export default VideoChat;
