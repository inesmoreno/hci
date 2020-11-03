import React, {useState} from 'react';
import {UserInfo} from './types';
import {Form, Input, Radio} from 'semantic-ui-react';

function LandingPage ({setUserInfo}:{setUserInfo : (userInfo : UserInfo) => void}) {

    const [username, setUsername] = useState("");
    const [role, setRole] = useState("participant");
    return (
        <>
            <p>Welcome to relier!</p>
            <p>Please input your name and role</p>
            <Form onSubmit = {() => setUserInfo({username, role})}>
                <Form.Field inline>
                    <label>Username</label>
                    <Input 
                        placeholder='Grace Hopper'
                        name='username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}  
                        />
                </Form.Field>
                <Form.Group inline>
                    <Form.Field
                        control={Radio}
                        label='Presenter'
                        value='presenter'
                        checked={role === 'presenter'}
                        onChange={(e, {value}) => setRole(value) }
                    />
                    <Form.Field
                        control={Radio}
                        label='Participant'
                        value='participant'
                        checked={role === 'participant'}
                        onChange={(e, {value}) => setRole(value) }
                    />
                </Form.Group>
                <button>Submit</button>
            </Form >
        </>
    )


}

export default LandingPage;