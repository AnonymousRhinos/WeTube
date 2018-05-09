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

    let trendingVideos = []
    axios
      .get('https://www.googleapis.com/youtube/v3/videos?part=contentDetails&chart=mostPopul' +
        'ar&regionCode=US&key=AIzaSyBZgswVANLvCdoyNvTtjDtUa6Ou4DAg9pE')
      .then(results => {
        trendingVideos = results.data.items;
        this.setState({ trendingVideos: trendingVideos })
      })
      .then( () => {

          return Promise.all(this.state.trendingVideos.map(vidId => {
            return axios
            .get(`https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBZgswVANLvCdoyNvTtjDtUa6Ou4DAg9pE&part=snippet&id=${vidId.id}`)
          })).then( data => {
            data.forEach(vidInfo => {
            const title = vidInfo.data.items[0].snippet.title
              this.setState({
                titles: [...this.state.titles, title]
              })
            })
          })


      })

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
                  <div className="mini-vid" key={video.id}>
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
