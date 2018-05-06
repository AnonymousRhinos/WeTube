import React, { Component } from 'react';
import { Screen } from '../index.js';
import myFirebase from '../../Firebase/firebaseInit';
import OpenTok from "opentok";
import { VideoSearch } from '../index.js';
import { VideoChat } from '../index.js';
import { Chat } from '../index.js';
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
      token: ''
    };
  }

  componentWillMount = () => {
    const guestName = prompt('Enter name:');
    const opentok = new OpenTok(apiKey, secret);
    const roomRef = myFirebase.database().ref('rooms/' + this.props.match.params.id);
    roomRef.once('value')
      .then(snapshot => {
        let value = snapshot.val()
        console.log("IS THIS WORKING", snapshot.val())
        if (value) {
          let token = opentok.generateToken(value.sessionId)
          this.setState({
            name: guestName,
            sessionId: value.sessionId,
            token: token
          })
        }
      })
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
          apiKey={apiKey}
          sessionId={this.state.sessionId}
          token={this.state.token}
        />
        :
        <div />
      }
        <div className="share-btns">
          <FacebookShareButton
            url={"http://localhost:3000/room/" + this.state.roomId}
            className="share-button">
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <EmailShareButton
            url={"http://localhost:3000/room/" + this.state.roomId}
            className="share-button">
            <EmailIcon size={32} round />
          </EmailShareButton>
          <TwitterShareButton
            url={"http://localhost:3000/room/" + this.state.roomId}
            className="share-button">
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <RedditShareButton
            url={"http://localhost:3000/room/" + this.state.roomId}
            className="share-button">
            <RedditIcon size={32} round />
          </RedditShareButton>
          <GooglePlusShareButton
            url={"http://localhost:3000/room/" + this.state.roomId}
            className="share-button">
            <GooglePlusIcon size={32} round />
          </GooglePlusShareButton>
          <LinkedinShareButton
            url={"http://localhost:3000/room/" + this.state.roomId}
            className="share-button">
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
          <WhatsappShareButton
            url={"http://localhost:3000/room/" + this.state.roomId}
            className="share-button">
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        </div>
        <div id="video">
          <div id="screen">
            <Screen videoId={this.state.videoId} roomId={this.state.roomId} />
            <VideoSearch />
          </div>
          <Chat
            videoId={this.state.videoId}
            roomId={this.state.roomId}
            token={this.state.token}
            guestName={this.state.name}
          />
        </div>
      </div>
    );
  }
}

export default Video;
