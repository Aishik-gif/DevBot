import { NextRequest, NextResponse } from "next/server";
import { model } from "../gemini";
import { Chat } from "@/types";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const prompts: string[] = body.prompts;
  const oldChats: Chat[] = body.history;
  const chat: Chat = body.chat;
  
  if(oldChats && chat){
    const history = oldChats.map(chat => {
      const part = [{text: chat.prompts}]
      return {role: chat.role, parts: part}
    })
    const geminiChat = model.startChat({
      history: history
    })

    const result = await geminiChat.sendMessage(chat.prompts);
    const response = result.response.text()

    console.log(response)

    return NextResponse.json({response: response});
  }


  const textPrompt = prompts.map(prompt => {
    return {text: prompt}
  })

  const result = await model.generateContent({
    contents:[
      {
        role: "user",
        parts: textPrompt
      }
    ]
  });


  const response = result.response.text()

  console.log(response);

  return NextResponse.json({response: response});
}