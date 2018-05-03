import React, {Component} from 'react';
import axios from 'axios';

class TrendingComponent extends Component {
  constructor() {
    super()
    this.state = ({trendingVideos: []})
  }
  componentDidMount() {

    let trendingVideos = []
    axios
      .get('https://www.googleapis.com/youtube/v3/videos?part=contentDetails&chart=mostPopul' +
        'ar&regionCode=NZ&key=AIzaSyBZgswVANLvCdoyNvTtjDtUa6Ou4DAg9pE')
      .then(results => {
        trendingVideos = results.data.items;
        this.setState({trendingVideos: trendingVideos})
      })

  }

  render() {
    return (
      <div className="trending-component">
        <h2>Here is a trending video</h2>
        {this.state.trendingVideos.length
          ? this
            .state
            .trendingVideos
            .map(video => {
              return (
                <p key={video.id}>
                  Trending ID is: {video.id}
                </p>
              )
            })
          : <p> No Videos Loaded
          </p>}
      </div>
    )
  }
}

export default TrendingComponent;
