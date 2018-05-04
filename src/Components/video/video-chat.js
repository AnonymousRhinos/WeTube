import React, { Component } from 'react';
import Iframe from 'react-iframe'

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
                <Iframe url="https://tokbox.com/embed/embed/ot-embed.js?embedId=cd4f1ddb-58eb-49fc-a3b2-1c077cb1c31c&room=DEFAULT_ROOM&iframe=true"
                    width="225px"
                    height="225px"
                    allow="microphone; camera"
                    id="myId"
                    className="myClassname"
                    display="initial"
                    position="relative"
                    allowFullScreen />
            </div>
        );
    }
}

export default VideoChat;
