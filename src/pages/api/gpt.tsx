import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { imageUrls } = req.body;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: imageUrls.map((url: string) => ({
          role: "user",
          content: "다음 이미지를 분석해줘.",
          image_url: url,
        })),
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ reply: response.data.choices[0].message.content });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
