import React, { Component } from 'react';
import Screen from './video-screen';
import VideoSearch from './video-search';
import Chat from './chat';
import {
  FacebookShareButton, GooglePlusShareButton, LinkedinShareButton, TwitterShareButton,
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

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoId: this
        .props
        .match
        .params
        .id
        .split('&')[1],
      roomId: this.props.match.params.id
    };
  }

  render() {
    console.log('my state videoId is: ', this.state.roomId)
    return (
      <div className="vid-view">
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
          <Chat videoId={this.state.videoId} roomId={this.state.roomId} />
        </div>
      </div>
    );
  }
}

export default Video;
