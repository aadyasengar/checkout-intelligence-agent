import OpenAI from 'openai';

export async function analyzeHesitation(session, eventLogs) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey === 'your_openai_api_key') {
    return runFallbackRules(session, eventLogs);
  }

  const client = new OpenAI({ apiKey });

  const summaryData = {
    cartTotal: session.cartTotal,
    cartItemCount: session.cartItems?.length ?? 0,
    frictionScore: session.frictionScore,
    events: eventLogs.map(e => ({ type: e.eventType, meta: e.metadata }))
  };

  const systemPrompt = `You are a checkout friction classifier for an e-commerce checkout agent.
Based on the following user session behavior, determine the PRIMARY reason this user is hesitating.
Output strictly valid JSON only (no markdown, no explanation):
{
  "reason": "price hesitation" | "shipping confusion" | "coupon confusion" | "exit intent" | "payment error" | "trust gap" | "other",
  "confidence": <number 0-1>,
  "explanation": "<one sentence>"
}`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(summaryData) }
      ],
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content);

    if (result.confidence > 0.55 && result.reason !== 'other') {
      console.log(`[analyzer] ${result.reason} (${result.confidence}) — ${result.explanation}`);
      return result.reason;
    }
    return null;
  } catch (err) {
    console.error('OpenAI analyzer error:', err.message);
    return runFallbackRules(session, eventLogs);
  }
}

function runFallbackRules(session, eventLogs) {
  const counts = {};
  for (const e of eventLogs) {
    counts[e.eventType] = (counts[e.eventType] || 0) + 1;
  }

  if (counts['coupon_failed'] >= 1) return 'coupon confusion';
  if (counts['payment_error'] >= 1) return 'payment error';
  if (counts['exit_intent'] >= 1) return 'exit intent';
  if ((counts['address_edited'] || 0) + (counts['shipping_method_changed'] || 0) >= 2) return 'shipping confusion';
  if ((counts['idle_checkout'] || 0) >= 2 || (counts['price_hover'] || 0) >= 2) return 'price hesitation';

  return null;
}
