import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import {Message} from './types';

function ChatOutput ({messages, myUsername} : {messages : Message[], myUsername: string}) {
    const formatMessage = ({message, author}) => {
        const amAuthor = author === myUsername ? "amAuthor" : "message"
        return <li className={amAuthor}><span className="author">{author}: </span>{message}</li>
    }

    return (
        <ScrollToBottom className="messages">
                <ul className="message-list">
                    {messages.map((x) => formatMessage(x))}
                </ul>
        </ScrollToBottom>
      )
    }
export default ChatOutput