import React, { Component } from 'react';
import Iframe from 'react-iframe'
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react';

class VideoChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoUrl: '',
        };
    }

    render() {
        const apiKey = 46113622;
        const secret= '7bec09fd089ae49e5d90cc420cf9740e9e0de29b'
        return (
            <div>
                <Iframe url="https://tokbox.com/embed/embed/ot-embed.js?embedId=cd4f1ddb-58eb-49fc-a3b2-1c077cb1c31c&room=DEFAULT_ROOM&iframe=true"
                    width="225px"
                    height="225px"
                    allow="microphone; camera"
                    id="myId"
                    className="myClassname"
                    display="initial"
                    position="relative"
                    allowFullScreen />
                


                    <div className="row">
                        <div className="col s8">
                          <OTSession
                            apiKey={this.props.apiKey}
                            sessionId={this.props.sessionId}
                            token={this.props.token}
                            onError={(err) => console.log(err)}
                          >
                            <OTPublisher
                              properties={{
                                width: 150,
                                height: 150,
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
