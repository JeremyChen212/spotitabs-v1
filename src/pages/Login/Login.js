import React from 'react';
import { Container } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { accessToken, logout, getCurrentUserProfile } from '../../spotify';
import "./styles.css"
import Dashboard from '../Dashboard/Dashboard';
import { Button, DatePicker } from 'antd';

const queryString = window.location.hash;
const urlParams = new URLSearchParams(queryString);
const token = urlParams.get('access_token'); //Import access token from spotify.js


const Login = () => {
    const [token, setToken] = useState(null);

    console.log(token)
    // Whenever access token changes, update the token.
    console.log(accessToken)

    useEffect(() => {
        setToken(accessToken);
        console.log(token);
    }, [])
    

   
    return (
        <>
            <Container className='d-flex justify-content-space-between align-items-center'>
            {!token ? (
                <a className='App-link' href="http://localhost:8888/login">Log in to Spotify</a>
            ) : (
                <>
                    <Button onClick={logout}>Log out</Button>
                </>
            )}
            </Container>
        </>
    )
}

export default Login;