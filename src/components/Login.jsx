import React from 'react'
import { Button, Row, Col } from 'react-bootstrap'; 
function Login(props) {
  return (
    <Row>
      {!props.isLoggedIn ? (
        <Col>
          <h2>Welcome to Spotify App</h2>
          <p>Click the button below to authenticate with Spotify.</p>
          <Button onClick={props.onLogin}>Login with Spotify</Button>
      </Col>):(
      <Col>
        <p>You are already logged in!</p>
        <Button>Home</Button>
      </Col>
      )}
    </Row>
  )
}

export default Login