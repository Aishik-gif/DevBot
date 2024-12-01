import { NextRequest, NextResponse } from "next/server";
import { codeIdentifierModel } from "../gemini";
import { stripIndents } from "../stripindents";
import { BASE_PROMPT } from "../prompts";
import { basePrompt as reactBasePrompt, reactPrompts } from "../defaults/react";
import { basePrompt as nodeBasePrompt } from "../defaults/node";
import { nextPrompts } from "../defaults/next";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const prompt = body.prompt;

  const response = await codeIdentifierModel.generateContent(prompt);
  const text = stripIndents(response.response.text());

  const mainPrompt = `<bolt_running_commands>
          </bolt_running_commands>

          ${prompt}
          IMPORTANT: Do not create one file for react projects! Instead divide the code into reusable components.

          # File Changes

          Here is a list of all files that have been modified since the start of the conversation.
          This information serves as the true contents of these files!

          The contents include either the full file contents or a diff (when changes are smaller and localized).

          Use it to:
          - Understand the latest file modifications
          - Ensure your suggestions build upon the most recent version of the files
          - Make informed decisions about changes
          - Ensure suggestions are compatible with existing code

          Here is a list of files that exist on the file system but are not being shown to you:

            - /home/project/.bolt/config.json`;

  if (text === "react") {
    return NextResponse.json({
      prompts: [reactPrompts, BASE_PROMPT, mainPrompt],
      uiPrompts: [reactBasePrompt],
    });
  }

  if (text === "node") {
    return NextResponse.json({
      prompts: [
        BASE_PROMPT,
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        mainPrompt,
      ],
      uiPrompts: [nodeBasePrompt],
    });
  }

  if (text === "next") {
    return NextResponse.json({
      prompts: [BASE_PROMPT, nextPrompts, mainPrompt],
      uiPrompts: [nodeBasePrompt],
    });
  }

  return NextResponse.json(
    { message: "You cannot access this" },
    { status: 403 }
  );
}
