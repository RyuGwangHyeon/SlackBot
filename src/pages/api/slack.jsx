import { App } from "@slack/bolt";
import axios from "axios";

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN;

const app = new App({
  token: SLACK_BOT_TOKEN,
  appToken: SLACK_APP_TOKEN,
  socketMode: true,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { type, event } = req.body;

    if (type === "url_verification") {
      return res.status(200).json({ challenge: req.body.challenge });
    }

    if (event && event.type === "message" && event.files) {
      const imageUrls = event.files.map((file) => file.url_private);

      const response = await axios.post("/api/gpt", {
        imageUrls,
      });

      await app.client.chat.postMessage({
        token: SLACK_BOT_TOKEN,
        channel: event.channel,
        text: response.data.reply,
      });
    }

    res.status(200).send("Event processed");
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
