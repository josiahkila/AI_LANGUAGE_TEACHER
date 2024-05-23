import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"]  // This is the default and can be omitted
});

const generalExample = {
  prompt: "What is your favorite movie?",
  responses: [
    { text: "My favorite movie is Inception because of its complex narrative structure." },
    { text: "I love The Matrix for its action scenes and deep philosophical questions." }
  ]
};

export async function GET(req) {
  // WARNING: Do not expose your keys
  // WARNING: If you host publicly your project, add an authentication layer to limit the consumption of ChatGPT resources

  const question = req.nextUrl.searchParams.get("question") || "What is your favorite movie?";
  const responseExamples = generalExample.responses.map(response => response.text).join(" or ");

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are an English conversational bot. Engage the user by answering questions and follow up with your own questions to keep the conversation going. This conversation is formatted as a json object.`,
      },
      {
        role: "user",
        content: question,
      },
      {
        role: "system",
        content: `You can answer like: "${responseExamples}". Remember, all responses should be formatted in json style for consistency.`
      }
    ],
    model: "gpt-3.5-turbo",
    response_format: {
      type: "json_object",
    },
});
  
  console.log(chatCompletion.choices[0].message.content);
  return Response.json(JSON.parse(chatCompletion.choices[0].message.content));
}
