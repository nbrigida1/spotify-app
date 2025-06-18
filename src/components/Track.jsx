import React from 'react'
import { Image } from 'react-bootstrap'
function Track(props) {
  //console.log("Track component props:", props);
  return (
    <div>
      <Image src={props.track.album.images[0].url} style={{ width: '50px', height: '50px' }} />
      <p>{props.track.name}</p>
    </div>
  )
}

export default Track