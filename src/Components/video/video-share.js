import React from 'react';
import { withRouter } from 'react-router';

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

const VideoShare = (props) => {
  return (
    <div className="share-btns">
          <FacebookShareButton
            url={'https://www.wetubelive.com/room/' + props.roomId}
            className="share-button"
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <EmailShareButton
            url={'https://www.wetubelive.com/room/' + props.roomId}
            className="share-button"
          >
            <EmailIcon size={32} round />
          </EmailShareButton>
          <TwitterShareButton
            url={'https://www.wetubelive.com/room/' + props.roomId}
            className="share-button"
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <RedditShareButton
            url={'https://www.wetubelive.com/room/' + props.roomId}
            className="share-button"
          >
            <RedditIcon size={32} round />
          </RedditShareButton>
          <GooglePlusShareButton
            url={'https://www.wetubelive.com/room/' + props.roomId}
            className="share-button"
          >
            <GooglePlusIcon size={32} round />
          </GooglePlusShareButton>
          <WhatsappShareButton
            url={'https://www.wetubelive.com/room/' + props.roomId}
            className="share-button"
          >
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        </div>
  )
}

export default withRouter(VideoShare);
