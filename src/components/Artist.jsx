import React from 'react'
import { Image, Row, Col } from 'react-bootstrap'
function Artist(props) {
  return (
    <div>
      <Image src={props.artist.images[0].url} roundedCircle style={{ width: '50px', height: '50px' }} />
      <p>{props.artist.name}</p>
    </div>
  )
}

export default Artist