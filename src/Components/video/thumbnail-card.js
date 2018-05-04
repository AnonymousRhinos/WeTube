import React, { Component } from 'react';


class ThumbnailCard extends Component {
constructor(props){
    super(props)
}
//https://img.youtube.com/vi/<insert-youtube-video-id-here>/default.jpg

    render() {
        const id = this.props.id
        const makeRoom = this.props.makeRoom;
        return (
            <div onClick={(event)=> {makeRoom(event, id)}}>
                <img src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`} className='trendingThumbnail' />
            </div>
        )

    }
}

export default ThumbnailCard