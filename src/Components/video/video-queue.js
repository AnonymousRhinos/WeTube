import React, { Component } from 'react';

class Queue extends Component {

  render(props){
    return (
      <div className="trending-component">
          {this.props.playlist.length > 1
          ?
          <div>
          <h2>Playlist</h2>
          <div className="trend-scroll">
        {
          this.props.playlist.map(queuedVid => {
            return (
        <div key={queuedVid} className="mini-vid"
        onClick={(event) =>{this.props.changeVideo(queuedVid)}}>
          <img src={`https://img.youtube.com/vi/${queuedVid}/hqdefault.jpg`} className='trendingThumbnail' alt='thumbnail' />
        </div>
            )
          })
        }
        </div>
        </div>
      :
      <div>
      <h2>No Videos in Playlist</h2>
      </div>
    }
    </div>
    )
  }

}

export default Queue;

{/* <Queue
  videoId={this.state.videoId}
  roomId={this.state.roomId}
  playlist={this.state.playlist}
  ItemView={(category) => (
    <CategoryCardView
      key={videoId}
     />
  )}
  BlankSlate={() => (
    <div>
      There are No Videos in Playlist
    </div>
  )}
/>

const CollectionComponent = (props) => {
  const {items, ItemView, BlankSlate} = props;
  if (items && items.length > 0) {
    return items.map(item => <CategoryCardView item={item}/>)
  }
  else {
    return <BlankSlate/>
  }
} */}
