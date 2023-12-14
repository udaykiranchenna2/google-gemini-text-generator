const { NextResponse } = require('next/server');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_AI_API_KEY);

export async function POST(request) {
  try {
    const data = await request.json();
    console.log(data.question);
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const prompt = data.question

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return NextResponse.json({ status: true, result: text });
  } catch (error) {
    return NextResponse.json({ status: false, error: error });
  }
}
