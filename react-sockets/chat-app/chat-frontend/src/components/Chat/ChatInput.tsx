import React, { createRef } from 'react';
import { Button, Checkbox, Form, Input } from 'semantic-ui-react'
import {useEffect, useState} from 'react'

function ChatInput ({sendMessage} : {sendMessage : (message:string) => void}) {
    const [message, setMessage] = useState<string>("");
    const handleSubmit = () => {
        if (message==="") return
        if (message.match(/^\s+$/)) return

        sendMessage(message);
        setMessage("");
    }
    return(
        <div className="chat-input">
            <Input 
                placeholder='Type your message here'
                name='message'
                value={message}
                onChange={(e) => setMessage(e.target.value)}  
                onKeyPress={(e: { key: string; }) => { if(e.key === 'Enter') {handleSubmit();}}}
                />
            <Button content='Send' onClick={ () => {if (message!="") {sendMessage(message); setMessage("")};}} />
        </div>
    )
}

export default ChatInput