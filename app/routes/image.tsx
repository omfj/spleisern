import { getAuth } from "@clerk/remix/ssr.server";
import { json } from "@remix-run/cloudflare";
import { Buffer } from "node:buffer";

import { getOpenAI } from "~/openai.server";

import type { ActionFunctionArgs } from "@remix-run/cloudflare";

const ALLOWED_TYPES = ["image/jpeg", "image/png"];

const SYSTEM_PROMPT = `
You will recieve an image of a reciept. Please extract the names and price of all
of the items on the reciept. The name of the item is on the left and the price of
the item is on the right on the same line.

The output should be in the following JSON format:

[
    {
        "name": <name of the item>,
        "price": <price of the item>
    }
]

The output should be valid JSON. Do not include any other markup in the output.
`;

export const action = async (args: ActionFunctionArgs) => {
  const { userId } = await getAuth(args);

  if (!userId) {
    throw new Response(null, { status: 401 });
  }

  const { request, context } = args;

  const formData = await request.formData();
  const image = formData.get("image");

  if (!image || !(image instanceof File)) {
    throw new Response(null, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(image.type)) {
    throw new Response(null, { status: 415 });
  }

  const blob = await image.arrayBuffer();
  const openai = getOpenAI(context.cloudflare.env.OPENAI_API_KEY);
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:${image.type};base64,${Buffer.from(blob).toString(
                "base64"
              )}`,
            },
          },
        ],
      },
    ],
  });

  const content = response.choices[0].message.content;

  if (!content) {
    throw new Response(null, { status: 500 });
  }

  let jsonData: Array<{ name: string; price: string }> | null;

  try {
    jsonData = JSON.parse(content);
  } catch (e) {
    console.error(e);
    jsonData = null;
  }

  if (!jsonData || !Array.isArray(jsonData)) {
    throw new Response(null, { status: 500 });
  }

  return json(jsonData);
};
