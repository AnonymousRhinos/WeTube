import React, { Component } from 'react';
import { Screen } from '../index.js';
import { Queue } from '../index.js';
import { VideoChat } from '../index.js';
import { Chat } from '../index.js';
import { VideoShare } from '../index.js';
import myFirebase from '../../Firebase/firebaseInit';
import OpenTok from "opentok";
import { VideoSearch } from '../index.js';
import {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  // TelegramShareButton,
  WhatsappShareButton,
  // PinterestShareButton, VKShareButton, OKShareButton,
  RedditShareButton,
  // TumblrShareButton, LivejournalShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  GooglePlusIcon,
  LinkedinIcon,
  // PinterestIcon, VKIcon, OKIcon, TelegramIcon,
  WhatsappIcon,
  RedditIcon,
  // TumblrIcon, MailruIcon,
  EmailIcon,
  // LivejournalIcon,
} from 'react-share';
import tokbox from '../../tokboxConfig'
const apiKey = tokbox.apiKey
const secret = tokbox.secret



class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoId: this.props.match.params.id.split('&')[1],
      roomId: this.props.match.params.id,
      name: "",
      sessionId: '',
      token: '',
      playlist: [],
      newVideo: '',
    };
  }

  componentWillMount = () => {
    const guestName = prompt('Enter name:');
          this.setState({
            name: guestName,
          })
  }

  componentDidMount = () => {
    const opentok = new OpenTok(apiKey, secret);
    const roomRef = myFirebase.database().ref('rooms/' + this.props.match.params.id);
    roomRef.once('value')
      .then(snapshot => {
        let value = snapshot.val()
          let token = opentok.generateToken(value.sessionId)
          this.setState({
            sessionId: value.sessionId,
            token: token
          })
      })
  }

  updatePlaylist = newVideo => {
    const { playlist } = this.state;
    this.setState(prevState => ({playlist: [...prevState.playlist, newVideo]}))
  }

  changeVideo = (newVideo) => {
    let intermedStatus = 20;
    this.setState({newVideo: newVideo})
  }

  render() {
    console.log("STATE", this.state)
    console.log("PROPS", this.props)
    return (
      <div className="vid-view">
      {
        this.state.sessionId ?
        <VideoChat
          roomId={this.state.roomId}
          guestName={this.state.name}
          sessionId={this.state.sessionId}
          token={this.state.token}
        />
        :
        <div />
      }
        <VideoShare roomId={this.state.roomId} />
        <div id="video">
          <div id="screen">
            <Screen videoId={this.state.videoId}
                    roomId={this.state.roomId}
                    playlist={this.state.playlist}
                    update={this.updatePlaylist}
                    newVideo={this.state.newVideo}
                    />
            <VideoSearch roomId={this.state.roomId} />
          </div>
          <Chat
            videoId={this.state.videoId}
            roomId={this.state.roomId}
            token={this.state.token}
            guestName={this.state.name}
          />
        </div>
        <Queue videoId={this.state.videoId}
               roomId={this.state.roomId}
               playlist={this.state.playlist}
               changeVideo={this.changeVideo}
               />
      </div>
    );
  }
}

export default Video;
