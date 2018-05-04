

Rooms: {
    roomID: -----,
    playerStatus: -1
}



Users: {
    roomID1: {
        user1: true,
        user2: true
    },
    roomId2: {
        user3: true,
        user4: true
    }
}



Messages: {
    roomID1: {
        m1: {
            user: name,
            text: content,
            time: time
        },
        m2: {
            user: name,
            text: content,
            time: time
        }
    },
    roomID1: {
        m1: {
            user: name,
            text: content,
            time: time
        },
        m2: {
            user: name,
            text: content,
            time: time
        }
    }
}



Videos: {
    roomID1: {
            videoID1: vidID1,
            videoID2: vidID2,
    },
    roomID2: {
        videoID1: vidID1,
        videoID2: vidID2,
    },
}

playVideo()
pauseVideo()
loadVideoById()
nextVideo()
stopVideo()
getCurrentTime()

seekTo()
playVideoAt()

onReady={this._onReady}
onPlay={this.handler}
onPause={this.handler}
onEnd={this.handler}
onStateChange={this.handler}



<iframe
src="https://tokbox.com/embed/embed/ot-embed.js?embedId=cd4f1ddb-58eb-49fc-a3b2-1c077cb1c31c&room=DEFAULT_ROOM&iframe=true"
width="800px"
height="640px"
allow="microphone; camera"
></iframe>


<div id="otEmbedContainer" style="width:800px; height:640px"></div>
                  <script src="https://tokbox.com/embed/embed/ot-embed.js?embedId=cd4f1ddb-58eb-49fc-a3b2-1c077cb1c31c&room=DEFAULT_ROOM"></script>