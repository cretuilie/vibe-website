import Anthropic from '@anthropic-ai/sdk';
import { KNOWLEDGE_BASE } from '@/lib/knowledge-base';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MAX_MESAJE_CONTEXT = 6;

export async function POST(request: Request) {
  const { messages } = await request.json();

  // Păstrează doar ultimele 6 mesaje ca context
  const mesajeContext = messages.slice(-MAX_MESAJE_CONTEXT);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 200,
    system: KNOWLEDGE_BASE,
    messages: mesajeContext,
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  return Response.json({ reply: text });
}
