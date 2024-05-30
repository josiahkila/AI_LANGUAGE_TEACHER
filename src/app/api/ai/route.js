import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"]  // This is the default and can be omitted
});

const generalExample = {
  prompt: "Mi película favorita es El Laberinto del Fauno de Guillermo del Toro. Ambientada en la España de posguerra, sigue a Ofelia, una niña que descubre un mundo fantástico lleno de criaturas extraordinarias. A través de pruebas místicas, Ofelia busca probar su valía en este entorno lleno de simbolismo y desafíos. La película mezcla magistralmente la realidad con la fantasía, aunque algunos encuentran que ciertos personajes secundarios están menos desarrollados",
  responses: [
    { text: "It looks like you were trying to say that 'El Laberinto del Fauno' is your favorite movie, set in post-war Spain and follows Ofelia, a young girl discovering a fantastic world. The way you could say it in Spanish to make it clearer and more engaging would be 'Mi película favorita es 'El Laberinto del Fauno' de Guillermo del Toro. Está ambientada en la España de la posguerra de los años cuarenta, donde Ofelia, una joven, encuentra un mundo fantástico lleno de criaturas asombrosas. Ofelia se enfrenta a desafíos místicos para demostrar su valía en un entorno rico en simbolismo.'" }
  ]
};

export async function GET(req) {
  // WARNING: Do not expose your keys
  // WARNING: If you host publicly your project, add an authentication layer to limit the consumption of ChatGPT resources

  const response = req.nextUrl.searchParams.get("response");
  const responseExamples = generalExample.responses.map(response => response.text).join(" or ");

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: response,
      },
      {
        role: "system",
        content: `as a restaurant customer, ask me a random question. Add a nice greeting. This conversation is formatted as a json object.`,
      },
      {
        role: "user",
        content: response,
      },
      {
        role: "system",
        content: `Give a response. Remember, all responses should be formatted in json style for consistency. For example: {"response": "You're response"}`
      }
    ],
    model: "gpt-3.5-turbo",
    response_format: {
      type: "json_object",
    },
});
  
  console.log(chatCompletion.choices[0].message.content);
  console.log("Hdsd"+Response.json(JSON.parse(chatCompletion.choices[0].message.content)));
  return Response.json(JSON.parse(chatCompletion.choices[0].message.content));
}
