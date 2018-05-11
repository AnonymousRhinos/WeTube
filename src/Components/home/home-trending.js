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
      categoryList: Object.keys(categories),
      noResults: false
    })
  }
  componentDidMount() {
    let requestUrl = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails,status,snippet&chart=mostPopular&regionCode=US&maxResults=20&key=AIzaSyBZgswVANLvCdoyNvTtjDtUa6Ou4DAg9pE'
    let trendingVideos = []
    axios.get(requestUrl)
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
    let requestUrl = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails,status,snippet&chart=mostPopular&regionCode=US&maxResults=20&key=AIzaSyBZgswVANLvCdoyNvTtjDtUa6Ou4DAg9pE'
    let trendingVideos = []
    let category = event.target.value
    if (category !== this.state.category) {
      if (category !== 'all') {
        let categoryId = +categories[category]
        console.log("state: ", this.state.category, "event: ", category, categoryId)
        requestUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,status,snippet&chart=mostPopular&videoCategoryId=${categoryId}&maxResults=20&key=AIzaSyBZgswVANLvCdoyNvTtjDtUa6Ou4DAg9pE`
      }
      axios.get(requestUrl)
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
          if (titles.length) {
            this.setState({
              trendingVideos: embeddable,
              titles: titles,
              noResults: false,
              category: category
            })
          } else {
            this.setState({
              noResults: true,
              category: category
            })
          }
        })
    }
  }

  render() {
    const { trendingVideos, category } = this.state
    return (
      <div className="trending-component">
        <img id="trend-head" src="/images/TrendingNow.png" alt="alt-thing" />
        {this.state.trendingVideos.length
          ?
          <div>
            <label id="category-label">
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
            {
              this.state.noResults ?
                <h5 id="no-videos">Sorry, No Current Trending Videos in the {this.state.category} Category</h5>
                :
                <div />
            }
            <div className="trend-scroll">
              {trendingVideos.map((video, index) => {
                return (
                  <div className="mini-vid" key={video.id} onClick={(event) => this.props.handleClick(event, video.id)}>
                    <ThumbnailCard id={video.id} />
                    <p className="trending-text">{this.state.titles[index]}</p>
                  </div>
                )
              })
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
