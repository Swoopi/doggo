'use client';

import { Box, Button, Stack, TextField } from "@mui/material";
import { useEffect, useRef, useState } from 'react';
import './page.css'

export default function Home() {
  const [messages, setMessages] = useState([{
    role: 'assistant', 
    content: 'Hi, I\'m Doggo the dog, here to make you feel better! Do you need anything?'
  }]);
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);

    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = '';
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new int8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ];
        });
        return reader.read().then(processText);
      });
    });
  }

  // Dog animation setup
  const leftIrisRef = useRef(null);
  const rightIrisRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;

      const updateIris = (irisRef, eyeCenterX, eyeCenterY) => {
        const deltaX = clientX - eyeCenterX;
        const deltaY = clientY - eyeCenterY;
        const angle = Math.atan2(deltaY, deltaX);

        const maxMovement = 4;
        const moveX = Math.cos(angle) * maxMovement;
        const moveY = Math.sin(angle) * maxMovement - 1;

        irisRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
      };

      const leftEye = leftIrisRef.current.getBoundingClientRect();
      const leftEyeCenterX = leftEye.left + leftEye.width / 2;
      const leftEyeCenterY = leftEye.top + leftEye.height / 2;
      updateIris(leftIrisRef, leftEyeCenterX, leftEyeCenterY);

      const rightEye = rightIrisRef.current.getBoundingClientRect();
      const rightEyeCenterX = rightEye.left + rightEye.width / 2;
      const rightEyeCenterY = rightEye.top + rightEye.height / 2;
      updateIris(rightIrisRef, rightEyeCenterX, rightEyeCenterY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      className="mainContainer"
    >
      {/* Chatbot Component */}
      <div className="chatContainerCustom">
        <div className="chatbotCustom">
          <Stack
            direction="column"
            width="100%"
            height="100%"
            border="1px solid white"
            p={2}
            spacing={3}
          >
            <Stack
              direction="column"
              maxHeight="100%"
              overflow="auto"
              flexGrow={1}
              spacing={2}
            >
              {messages.map((message, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
                >
                  <Box
                    className={message.role === 'assistant' ? 'assistantMessageCustom' : 'userMessageCustom'}
                    borderRadius={16}
                    p={3}
                  >
                    {message.content}
                  </Box>
                </Box>
              ))}
            </Stack>
  
            <Stack direction="row" spacing={2}>
              <TextField
                label="Message"
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button className="sendButtonCustom" disableElevation variant="contained" onClick={sendMessage}>
                Send
              </Button>
            </Stack>
          </Stack>
        </div>
      </div>
  
      {/* Dog Component */}
      <div className="dogContainerCustom">
        <div className="dogWrapperCustom">
          <div className="dogCustom">
            <span className="backLegCustom"></span>
            <div className="bodyCustom">
              <span className="tailCustom"></span>
              <span className="frontLegCustom"></span>
            </div>
            <div className="headCustom">
              <div className="earsCustom">
                <span className="innerEarCustom"></span>
              </div>
              <div className="outerEarsCustom">
                <span className="innerEarTipCustom"></span>
              </div>
              <div className="faceCustom">
                <span className="innerFaceCustom"></span>
                <span className="eyesCustom">
                  <span className="pupilCustom" ref={leftIrisRef}></span>
                </span>
                <span className="eyesCustom">
                  <span className="pupilCustom" ref={rightIrisRef}></span>
                </span>
                <span className="noseCustom"></span>
                <span className="noseTipCustom"></span>
              </div>
            </div>
            <div className="basketCustom"></div>
          </div>
        </div>
      </div>
    </Box>
  );
}  