// app/api/chattypoo/route.ts

import { NextRequest, NextResponse} from "next/server";
import OpenAI from "openai";
import { TangentData } from "@/data/tangent";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Must be defined in your .env.local
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const functions = [
      {
        name: "generate_tangents",
        description: "Produce three historical tangents with conclusions",
        parameters: {
          type: "object",
          properties: {
            title:       { type: "string" },
            date:        { type: "string", format: "date" },
            time:        { type: "number", description: "Estimated time in minutes" },
            description: { type: "string" },
            tangent: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title:   { type: "string" },
                  content: { type: "string" }
                },
                required: ["title", "content"]
              }
            }
          },
          required: ["title", "date", "time", "description", "tangent"]
        }
      }
    ];

    // Optionally tweak the last message to include instructions
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `
            You are a historian-agent. Given the student’s content, 
            generate exactly three “tangents” with cause-and-effect reasoning 
            and a unifying conclusion. Return ONLY the output of the generate_tangents function.
          `
        },
        ...messages
      ],
      temperature: 0.7,
      functions:functions,
      function_call: {
        name: "generate_tangents"},
      max_tokens: 500,
    });

    const call = response.choices[0].message.function_call!;
    // parse and type as TangentData
    const data: TangentData = JSON.parse(call.arguments!);

    return NextResponse.json(data, { status: 200 });

  } catch (err: any) {
    console.error("Error in /chattypoo:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
