import React, { Component } from 'react';
import Iframe from 'react-iframe'
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react';
import tokbox from '../../tokboxConfig'
const apiKey = tokbox.apiKey
const secret = tokbox.secret

class VideoChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoUrl: '',
        };
    }

    render() {
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
