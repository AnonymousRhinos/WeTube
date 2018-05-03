

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