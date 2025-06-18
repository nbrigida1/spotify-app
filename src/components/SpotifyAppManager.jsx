import React from 'react'
import { Button, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Login from './Login.jsx';
import Home from './Home.jsx';
function SpotifyAppManager() {
  const clientId = "25a422d80c2e4233aa16b7a026cdbd27"; 
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const [loggedIn, setLoggedIn] = useState(false);
  const [saved_profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [authorization_code, setAuthorizationCode] = useState(null);

  async function redirectToAuthCodeFlow(clientId) {
      const verifier = generateCodeVerifier(128);
      const challenge = await generateCodeChallenge(verifier);

      localStorage.setItem("verifier", verifier);

      const params = new URLSearchParams();
      params.append("client_id", clientId);
      params.append("response_type", "code");
      params.append("redirect_uri", "http://127.0.0.1:5173/callback");
      params.append("scope", "user-read-private user-read-email user-top-read");
      params.append("code_challenge_method", "S256");
      params.append("code_challenge", challenge);
      

      document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  function generateCodeVerifier(length) {
      let text = '';
      let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (let i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
  }

  async function generateCodeChallenge(codeVerifier) {
      const data = new TextEncoder().encode(codeVerifier);
      const digest = await window.crypto.subtle.digest('SHA-256', data);
      return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
  }



  async function getAccessToken(clientId, code) {
      const verifier = localStorage.getItem("verifier");

      const params = new URLSearchParams();
      params.append("client_id", clientId);
      params.append("grant_type", "authorization_code");
      params.append("code", code);
      params.append("redirect_uri", "http://127.0.0.1:5173/callback");
      params.append("code_verifier", verifier);

      const result = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params
      });

      const { access_token } = await result.json();
      return access_token;
  }

  async function fetchProfile(token) {
      const result = await fetch("https://api.spotify.com/v1/me", {
          method: "GET", headers: { Authorization: `Bearer ${token}` }
      });
      return await result.json();
  }

  async function fetchStats(token, time_range = "medium_term") {
      const artists = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${time_range}&limit=10`, {
          method: "GET", headers: { Authorization: `Bearer ${token}` } 
      });
      const tracks = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${time_range}&limit=10`, {
          method: "GET", headers: { Authorization: `Bearer ${token}` } 
      });
      const newStats = {
          artists: await artists.json(),
          tracks: await tracks.json()
      }
      return newStats;
  }

  async function onLogin(clientId) {
    console.log(loggedIn)
    if (code) {
        const accessToken = await getAccessToken(clientId, code);
        setAuthorizationCode(accessToken)
        const profile = await fetchProfile(accessToken);
        console.log("User Profile:", profile); 
        const stats = await fetchStats(accessToken);
        console.log("User Stats:", stats);
        setStats(stats);
        setProfile(profile);
        setLoggedIn(true);
    } else {
        redirectToAuthCodeFlow(clientId);
    }
  }

  // auto login if code is present or code update
  useEffect(() => {
    if (code && !loggedIn) {
      onLogin(clientId);
    }
  }, [code]);

  async function updateTimeRange(timeRange) {
    console.log("Updating time range to:", timeRange);
    if (!authorization_code) {
      console.error("No authorization code available.");
      return;
    }
    const newStats = await fetchStats(authorization_code, timeRange);
    setStats(newStats);
    console.log("Updated stats:", newStats);
  }

return(
  <div>
    {!loggedIn? 
    <Login onLogin={() => onLogin(clientId)} isLoggedIn = {loggedIn} /> :
    <Home profile = {saved_profile} stats = {stats} updateTimeRange = {updateTimeRange}/>
    }
  </div>
)
}

export default SpotifyAppManager