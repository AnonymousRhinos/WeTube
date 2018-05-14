import React, { Component } from 'react';

class Queue extends Component {


  render(props) {
    let playlistInfo = [];
    if (this.props.playlist.length > 0) {
      for (let i = 0; i < this.props.playlist.length; i++) {
        playlistInfo.push({
          videoId: this.props.playlist[i],
          timeAdded: this.props.playlistAddedTime[i]
        })
      }
      console.log('unsorted playlistinfo', playlistInfo)
      playlistInfo.sort((a, b) => a.timeAdded - b.timeAdded)
      console.log('sorted playlistinfo', playlistInfo)
    }
    let currentVideo = this.props.videoId

    return (
      <div className="trending-component">
        {this.props.playlist.length >= 1
          ?
          <div>
            <h2 className="playlist-header">Playlist</h2>
            <div className="trend-scroll" id="playlist-scroll">
              {
                playlistInfo.map(item => {
                  return (
                    <div key={item.videoId} className="queue-vid">
                      <div className="mini-vid-playlist" id={currentVideo === item.videoId ? 'selectedVid' : 'unselected'}>
                        <button className="remove-from-queue"
                          onClick={event => { this.props.removeFromDatabase(item.videoId) }}>Delete</button>
                        <img
                          onClick={(event) => { this.props.changeVideo(item.videoId) }}
                          src={`https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`} className='trendingThumbnail-playlist' alt='thumbnail' />
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
          :
          <div>
            <h2 className="playlist-header">No Videos in Playlist</h2>
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
