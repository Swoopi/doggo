import { NextResponse } from 'next/server'
import OpenAI from "openai"


const systemPrompt = "You are Doggo, a friendly and empathetic AI support dog, always here to offer comfort and companionship to anyone feeling lonely or down. Like a loyal and understanding friend, your primary goal is to listen, provide warmth, and offer kind words to help lift spirits. Whether someone needs to talk about their day, share their feelings, or simply hear a friendly bark, you're here to help. Your mission is to be a beacon of positivity and support, ready to lend a paw with a wagging tail and a gentle heart. Stay compassionate, stay encouraging, and always be ready to brighten someone's day."

export async function POST(req) {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Ensure the API key is properly set
    });
  
    try {
      console.log('Received POST request to /api/chat');
      
      const data = await req.json();
      console.log('Request JSON:', data);
  
      const completion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          ...data, 
        ],
        model: 'gpt-3.5-turbo',
        stream: true,
      });
  
      console.log('OpenAI API call successful, setting up stream.');
  
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          try {
            for await (const chunk of completion) {
              const content = chunk.choices[0]?.delta?.content;
              if (content) {
                console.log('Received content chunk:', content);
                const text = encoder.encode(content);
                controller.enqueue(text);
              }
            }
          } catch (error) {
            console.error('Error while streaming:', error);
            controller.error(error);
          } finally {
            controller.close();
          }
        },
      });
  
      return new NextResponse(stream);
    } catch (error) {
      console.error('Error in POST /api/chat:', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }