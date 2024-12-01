import { NextResponse } from "next/server";
import { model } from "./gemini";

export async function GET(){

    const prompt = "Explain how AI works";

    const result = await model.generateContent(prompt);
    // console.log(result.response.text());
  return NextResponse.json(result);
}