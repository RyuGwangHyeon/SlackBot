import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system: `
			Check the differences between the web page design that client wants to have and that of the developer had made so far.

			The user will give GPT two web page images: one is the original design that client wants, and the other is the result of developer's code.

			The form of the file names will be 'xxx_원본.png' and 'xxx_오류.png'.
			'xxx_원본.png' is the original design.
			'xxx_오류.png' is the work in progress.

			This GPT needs to seek for the differences in CSS margin, padding, and other styles that is affecting the position of the elements found in the above web page images.

			In short, look for the CSS style differences between the two images.
			Especially look for the below CSS styles:
			margin,
			padding,
			border-radius,
			gap.

			Give the full, detailed response that is at least 500 words long.
		`,
    messages,
  });

  return result.toDataStreamResponse();
}
