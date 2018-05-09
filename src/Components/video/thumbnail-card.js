import React from 'react';


const ThumbnailCard = (props) => {

    const id = props.id
    const makeRoom = props.makeRoom;
    return (
        <div /*onClick={(event) => { makeRoom(event, id) }}*/>
            <img src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
            className='trendingThumbnail'
            alt="alt-thing"
            />
        </div>
    )

}

export default ThumbnailCard
