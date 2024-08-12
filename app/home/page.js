'use client';
import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [messages, setMessages] = useState([{
    role: 'assistant', 
    content: 'Hi, I\'m Doggo the dog. What do you need?'
  }]);
  const [message, setMessage] = useState('');

  const router = useRouter();  // Use Next.js App Router's useRouter

  const navigateToChatbot = () => {
    router.push('/home');  // Navigate to the AI chatbot page
  };

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

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      {/* New Doggo Animation */}
      <Box onClick={navigateToChatbot} style={{ cursor: 'pointer', position: 'absolute', left: '2vw', top: '50%', transform: 'translateY(-50%)', width: '15vw', height: 'auto' }}>
        <div className="new-doggo-container">
          <div className="new-todo">
            <div className="new-dog">
              <div className="new-body">
                <span className="new-cola"></span>
                <span className="new-leg new-front-left-leg"></span>
                <span className="new-leg new-front-right-leg"></span>
                <span className="new-leg new-back-left-leg"></span>
                <span className="new-leg new-back-right-leg"></span>
              </div>
              <div className="new-cabezota">
                <div className="new-orejas">
                  <span className="new-orejitas"></span>
                </div>
                <div className="new-orejas3">
                  <span className="new-orejitas3"></span>
                </div>
                <div className="new-cabeza">
                  <span className="new-cabeza3"></span>
                  <span className="new-ojos">
                    <span className="new-iris"></span>
                    <span className="new-tongue"></span>
                    <span className="new-tongue-line"></span>
                  </span>
                  <span className="new-nariz"></span>
                  <span className="new-nariz3"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>

      {/* Chatbot (which will be shown on the /home route) */}
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          direction="column"
          width="600px"
          height="700px"
          border="1px solid black"
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
                display='flex' 
                justifyContent={
                  message.role === 'assistant' ? 'flex-start' : 'flex-end'
                }
              >
                <Box
                  bgcolor={
                    message.role === 'assistant'
                      ? 'primary.main'
                      : 'secondary.main'
                  }
                  color='white'
                  borderRadius={16}
                  p={3}
                >
                  {message.content}
                </Box>
              </Box>
            ))}
          </Stack>
          <Stack direction='row' spacing={2}>
            <TextField
              label="Message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button variant="contained" onClick={sendMessage}>
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
