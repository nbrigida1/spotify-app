import React from 'react'
import { Button, Row, Col, Image } from 'react-bootstrap';
import Artist from './Artist.jsx';
import Track from './Track.jsx';
function Home(props) {
    const artists = props.stats?.artists?.items || [];
    const tracks = props.stats?.tracks?.items || [];
    const displayName = props.profile?.display_name || "User";
    const imageUrl = props.profile?.images?.[0]?.url || 'https://via.placeholder.com/150';
    console.log("Home component props:", props);
    return (
        <Col>
            <h2>Welcome to the Home Page, {displayName}!</h2>
            <Image
                src={imageUrl}
                roundedCircle
                style={{ width: '150px', height: '150px' }}
            />
            <h3>Time Range</h3>
            <Row>
                <Col>
                    <Button variant="primary" onClick={() => props.updateTimeRange("short_term")}>4 weeks</Button>
                </Col>
                <Col>
                    <Button variant="primary" onClick={() => props.updateTimeRange("medium_term")}>6 months</Button>
                </Col>
                <Col>
                    <Button variant="primary" onClick={() => props.updateTimeRange("long_term")}>1 year</Button>
                </Col>
            </Row>
            <h3>Top Artists</h3>
            <Row>
                {artists.map((artist, index) => (
                    <Col>
                        <Artist key={index} artist={artist} />
                    </Col>
                ))}
            </Row>
            <h3>Top Tracks</h3>
            <Row>
            {tracks.map((track, index) => (
                <Col>
                    <Track key={index} track={track} />
                </Col>
            ))}
            </Row>
        </Col>
    )
}

export default Home