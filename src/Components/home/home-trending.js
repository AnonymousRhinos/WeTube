import React, { Component } from 'react';
import axios from 'axios';
import ThumbnailCard from '../video/thumbnail-card'

class TrendingComponent extends Component {
  constructor(props) {
    super(props)
    this.state = ({ trendingVideos: [] })
  }
  componentDidMount() {

    let trendingVideos = []
    axios
      .get('https://www.googleapis.com/youtube/v3/videos?part=contentDetails&chart=mostPopul' +
        'ar&regionCode=NZ&key=AIzaSyBZgswVANLvCdoyNvTtjDtUa6Ou4DAg9pE')
      .then(results => {
        trendingVideos = results.data.items;
        console.log('results are here ', results.data)
        this.setState({ trendingVideos: trendingVideos })
      })
      // .then( () => {
      //       axios
      //       .get('https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBZgswVANLvCdoyNvTtjDtUa6Ou4DAg9pE&part=snippet&id=VIDEO_ID' )
      //       .then(results => {
      //         trendingVideos = results.data.items;
      //         this.setState({ trendingVideos: trendingVideos })
      //       })
      // })


  }

  render() {

    return (
      <div className="trending-component">
        <img id="trend-head" src="/images/TrendingNow.png" />
        {this.state.trendingVideos.length
          ?
          <div className="trend-scroll">
            {this
              .state
              .trendingVideos
              .map(video => {
                return (
                  <div className="mini-vid">
                    <p key={video.id}>
                      <ThumbnailCard id={video.id} makeRoom={this.props.makeRoom}/>
                    </p>
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
