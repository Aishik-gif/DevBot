import { NextRequest, NextResponse } from "next/server";
import { model } from "../gemini";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const prompts: string[] = body.prompts;

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