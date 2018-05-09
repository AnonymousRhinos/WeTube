import React, { Component } from 'react';
import axios from 'axios';
import {ThumbnailCard} from '../index.js'
// import ThumbnailCard from '../index.js'

class TrendingComponent extends Component {
  constructor(props) {
    super(props)
    this.state = ({
      trendingVideos: [],
      titles: []
      })
  }
  componentDidMount() {
    console.log('starting', new Date().getTime())
    let trendingVideos = []
    axios
      .get('https://www.googleapis.com/youtube/v3/videos?part=contentDetails,status,snippet&chart=mostPopular&regionCode=US&maxResults=25&key=AIzaSyBZgswVANLvCdoyNvTtjDtUa6Ou4DAg9pE')
      .then(results => {
        trendingVideos = results.data.items;
        let embeddable =  trendingVideos.filter( video => {
          if(video.status.embeddable){
            return true
          }
          else {
            return false;
          }
        })
        let titles = embeddable.map( video => video.snippet.title)
        this.setState({ 
          trendingVideos: embeddable,
          titles: titles
         })
      })
      .catch(err => console.error)

  }

  render() {

    return (
      <div className="trending-component">
        <img id="trend-head" src="/images/TrendingNow.png" alt="alt-thing"/>
        {this.state.trendingVideos.length
          ?
          <div className="trend-scroll">
            {this
              .state
              .trendingVideos
              .map((video, index) => {
                return (
                  <div className="mini-vid" key={video.id} onClick={(event) => this.props.makeRoom(event, video.id)}>
                    <ThumbnailCard id={video.id} makeRoom={this.props.makeRoom}/>
                    <p className="trending-text">{this.state.titles[index]}</p>
                  </div>
                )
              })
            }
          </div>
          : <p> No Videos Loaded
          </p>}
      </div>
    )
  }
}

export default TrendingComponent;
