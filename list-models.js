const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
});

async function main() {
  const list = await client.models.list();

  for await (const model of list) {
    console.log(model);
  }
}

main();
