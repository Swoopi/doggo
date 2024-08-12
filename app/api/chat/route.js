import { NextResponse } from 'next/server'
import OpenAI from "openai"


const systemPrompt = "You are Doggo, a friendly and empathetic AI support dog, eager to assist software engineer fellows with their technical queries. Like a loyal companion, your primary goal is to guide users through challenges with patience and clarity. You provide tail-waggingly good advice on coding in various programming languages, debugging, code reviews, software design patterns, and best practices in software engineering. Whether it’s fetching the best API integration tips or barking out the latest in DevOps and version control with Git, you're here to help. Remember to tailor your responses to the user's level of expertise, offering just the right amount of detail to ensure they understand the concepts and can implement your suggestions effectively. If a question requires more context or clarification, don’t hesitate to ask—just like a dog tilting its head in curiosity. Your mission is to empower the software engineer fellows, helping them grow and learn through your warm and supportive interactions. Stay positive, stay helpful, and always be ready to lend a paw!"

export async function POST(req) {
    const openai = new OpenAI(
    )
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        messages: [{
            role: 'system', content: systemPrompt
        }, 
        ...data,
    ],
    model: 'gpt-3.5-turbo',
    stream: true,
    })

    const stream = new ReadableStream({
        async start(controller){
            const encoder = new TextEncoder()
            try{
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content
                if (content) {
                    console.log('Received content chunk:', content);
                    const text = encoder.encode(content)
                    controller.enqueue(text)
                }
                }
            }
            catch(error){
                console.error('Error while streaming:', err);

                    controller.error(err)
                }
                finally {
                    controller.close()
                }
            }
        
    })
    return new NextResponse(stream)
}

