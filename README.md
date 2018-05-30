This project was created by The Anonymous Rhinos (Nick Angelos, Jaime Syvino, John Walsh, and David Lu) to solve the problem of wanting to watch YouTube videos with your friends, but not being sure you were at the same point in your video.
We used the YouTube API, Google's Firebase, WebRTC, React, and Node for this project.

Navbar:
The Navbar has several links, the movie reel and 'WeTube' text both return a user to the home screen, the YouTube button opens a new tab that takes the user directly to YouTube to search for videos, the 'Copy URL' button copies the tab's URL to the clipboard, and the 'Sign-in/Sign-out' button allows a user to log in using their Google account, and become searchable for people to send them direct invitations to rooms with a push notification on their current WeTube tab.

Home Screen:
From the home screen you can put the url of any YouTube video in the search bar, and hit the 'Launch Theater' button.
- This will take you directly to a theater room with a unique url that you can share with others.

We also have a Trending Videos component, with the top 25 trending videos on YouTube, or you can filter by category if you want to see trending videos by category. If you see one you want to watch, just click the thumbnail and your theater room will be launched.

Theater Room:
Once inside the theater room, you can invite other users who are online (signed in with Google), write out instant messages to participants in your room, share the link to the room via social media or email, add videos the the playlist by pasting a YouTube url into the box, or add trending videos to the playlist by clicking the thumbnails. If you want to remove a video from the playlist, you can click the delete button just above the thumbnail, and it will be removed. Each user's screen will be synced with a central database, so even if someone joins late, they will immediately be plugged into the video at the same spot as everyone else. If any user pauses, plays, or skips around in the video, each user's screen reacts accordingly.

The best feature is the Video Chat functionality. By clicking the 'Join Video Chat' button, your webcam and microphone will be accessed (if you allow them to be), and you can watch everyone else and talk to them in real time, while you watch the playlist of videos.
