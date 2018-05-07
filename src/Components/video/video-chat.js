import React, { Component } from 'react';
import Iframe from 'react-iframe'
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react';
import OpenTok from "opentok";
import tokbox from '../../tokboxConfig'
const apiKey = tokbox.apiKey
const secret = tokbox.secret

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
    };
  }


  render() {
    console.log("NEW USER JOINS. SESSION ID: ", this.props.sessionId)
    console.log("NEW USER JOINS. Token: ", this.props.token)
    console.log("NEW USER JOINS. Name: ", this.props.guestName)
    return (
      <div>

        <div className="row">
          <div className="col s8">
            <OTSession
              apiKey={apiKey}
              sessionId={this.props.sessionId}
              token={this.props.token}
              onError={(err) => console.log(err)}
            >
              <OTPublisher
                properties={{
                  width: 150,
                  height: 150,
                  publishAudio: true,
                  publishVideo: true,
                  name: this.props.guestName
                }}
              />
              <OTStreams>
                <OTSubscriber
                  properties={{
                    width: 200,
                    height: 200,
                    subscribeToAudio: true,
                    subscribeToVideo: true
                  }}
                />
              </OTStreams>
            </OTSession>
          </div>
        </div>
      </div>
    );
  }
}

export default VideoChat;
