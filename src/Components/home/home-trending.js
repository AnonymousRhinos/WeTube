import React, { Component } from 'react';
import axios from 'axios';
import { ThumbnailCard } from '../index.js'
import categories from '../../youtube-cats'
// import ThumbnailCard from '../index.js'

class TrendingComponent extends Component {
  constructor(props) {
    super(props)
    this.state = ({
      trendingVideos: [],
      titles: [],
      category: 'all',
      categoryList: Object.keys(categories)
    })
  }
  componentDidMount() {
    console.log('starting', new Date().getTime())
    let trendingVideos = []
    axios
      .get('https://www.googleapis.com/youtube/v3/videos?part=contentDetails,status,snippet&chart=mostPopular&regionCode=US&maxResults=50&key=AIzaSyBZgswVANLvCdoyNvTtjDtUa6Ou4DAg9pE')
      .then(results => {
        trendingVideos = results.data.items;
        let embeddable = trendingVideos.filter(video => {
          if (video.status.embeddable) {
            return true
          }
          else {
            return false;
          }
        })
        let titles = embeddable.map(video => video.snippet.title)
        this.setState({
          trendingVideos: embeddable,
          titles: titles
        })
      })
      .catch(err => console.error)

  }

  handleChange = (event) => {
    this.setState({category: event.target.value});
  }

  render() {
    const { trendingVideos, category } = this.state
    let filteredVideos = trendingVideos;
    if ( category !== 'all' ) {
      filteredVideos = trendingVideos.filter(video => {
        return +categories[category] === +video.snippet.categoryId
      })
    }
    return (
      <div className="trending-component">
        <img id="trend-head" src="/images/TrendingNow.png" alt="alt-thing" />
        {this.state.trendingVideos.length
          ?
          <div>
          <label>
          Select a Category: 
          <select value={this.state.category} onChange={this.handleChange}>
            <option value="all">ALL</option>
          {
            this.state.categoryList.map(cat => {
              return <option key={categories[cat]} value={cat}>{cat}</option>
            })
          }
          </select>
        </label>
            <div className="trend-scroll">
            {
              filteredVideos.length ?
              <div>
              {filteredVideos.map((video, index) => {
                return (
                  <div className="mini-vid" key={video.id} onClick={(event) => this.props.handleClick(event, video.id)}>
                    <ThumbnailCard id={video.id} />
                    <p className="trending-text">{this.state.titles[index]}</p>
                  </div>
                )
              })
              }
              </div>
              :
              <div>
              <p> No Trending Videos in {this.state.category} Category </p>
              </div>
            }
            </div>
          </div>
          : <p> No Videos Loaded
          </p>}
      </div>
    )
  }
}

export default TrendingComponent;
