// import tokbox from ("../src/tokboxConfig"); const tokbox =
// require('../src/tokboxConfig');

var myFirebaseRef = new Firebase("https://wetube-ef349.firebaseio.com/");

// import tokbox = {     apiKey: '46113622',     secret:
// '7bec09fd089ae49e5d90cc420cf9740e9e0de29b'   }

console.log('where am I?')

// const opentok = new OpenTok(apiKey, secret); opentok.createSession({
// mediaMode: "routed" }, function (err, session) {     if (err) {
// console.log(err);       return;     }     let sessionId     sessionId =
// session.sessionId;     const videoId = 'e8QY0NDWqzk';     let roomId =
// Date.now() + '&' + videoId;     myFirebase.database().ref('rooms/' +
// roomId).set({       roomId: roomId,       playerStatus: -1,
// currentTime: 0,       sessionId: sessionId,       currentVideo: videoId,
// })     self.props.history.push({      pathname:  `/room/${roomId}`,
// state: {sessionId: sessionId}     });   })


document.addEventListener('click', () => {
    console.log('firebase is: ', typeof myFirebaseRef);

    chrome
        .tabs
        .query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            console.log(tabs[0].url);
            console.log(tabs[0].url);
            const videoUrl = tabs[0].url;
            let videoId;
            if (videoUrl.indexOf('youtu.be/') > -1) {
                videoId = videoUrl.split('.be/')[1];
            } else {
                let begIndex = videoUrl.indexOf('v=') + 2;
                let endIndex = videoUrl.indexOf('&');
                if (endIndex > -1) {
                    videoId = videoUrl.slice(begIndex, endIndex);
                } else 
                    videoId = videoUrl.slice(begIndex);
                }
            
            chrome
                .tabs
                .update({url: `https://wetube-rhinos.herokuapp.com/home/${videoId}`})

        })
})
