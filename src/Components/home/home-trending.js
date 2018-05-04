import React, { Component } from 'react';
import axios from 'axios';

class TrendingComponent extends Component {
  constructor() {
    super()
    this.state = ({ trendingVideos: [] })
  }
  componentDidMount() {

    let trendingVideos = []
    axios
      .get('https://www.googleapis.com/youtube/v3/videos?part=contentDetails&chart=mostPopul' +
        'ar&regionCode=NZ&key=AIzaSyBZgswVANLvCdoyNvTtjDtUa6Ou4DAg9pE')
      .then(results => {
        trendingVideos = results.data.items;
        this.setState({ trendingVideos: trendingVideos })
      })

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
                      Trending ID is: {video.id}
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
