import React from 'react';
import './App.css';
import {useState} from 'react';
import { types } from 'util';
import Chat from './Chat';
import {UserInfo} from './types';
import LandingPage from './LandingPage'


function App () {
    const [userInfo, setUserInfo] = useState<null | UserInfo>(null);

    if(userInfo === null) return <div className="App"><LandingPage setUserInfo={setUserInfo} /> </div>

    return (
        <div className="App">
            <Chat userInfo={userInfo} />
        </div>
    )
}

export default App;