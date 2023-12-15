const {
  NextResponse
} = require('next/server');
const {
  GoogleGenerativeAI
} = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_AI_API_KEY);

export async function POST(request) {
  try {
    const data = await request.json();
    const prompt = data.question
    const file = data.image
    const mimeType = data.image_type
    let MODEL_NAME = 'gemini-pro-vision';
    MODEL_NAME = !file || !mimeType ? 'gemini-pro' : MODEL_NAME
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME
    });

    const generationConfig = {
      temperature: 0.4,
      topK: 32,
      topP: 1,
      maxOutputTokens: 4096,
    };
   
    let result;
    if (file && mimeType) {
      const parts = [{
          inlineData: {
            mimeType: mimeType,
            data: file
          }
        },
        {
          text: prompt
        },
      ];
      result = await model.generateContent({
        contents: [{
          role: "user",
          parts
        }],
        generationConfig,
      });
    } else {
      result = await model.generateContent(prompt);
    }

    const response = result.response;
    const text = response.text();
    return NextResponse.json({
      status: true,
      result: text
    });
  } catch (error) {
    return NextResponse.json({
      status: true,
      result: error
    });
  }

}