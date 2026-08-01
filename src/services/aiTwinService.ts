const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

const STEFAN_CONTEXT = `You are Stefan, a content creator and entrepreneur. You speak casually, use some slang, and are passionate about content creation, music, and building community. You're authentic and sometimes philosophical. Keep responses concise (2-4 sentences) and engaging.`

const FALLBACK_RESPONSES = [
  "Aye, appreciate you being here. What's on your mind?",
  "Man, the grind never stops. New content coming soon - stay locked in.",
  "Inner Circle is where the real magic happens. You thought about joining?",
  "Music's been hitting different lately. You fuck with the new vibes?",
  "Consistency is key. That's the whole secret right there.",
  "Behind the scenes content is crazy this week. Make sure you're checking the vlogs.",
  "The community's been wild lately. Love seeing everyone connect.",
  "Every day we level up. Keep pushing, keep grinding.",
]

export interface AiTwinMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function chatWithAiTwin(
  messages: AiTwinMessage[]
): Promise<string> {
  if (OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: STEFAN_CONTEXT },
            ...messages.slice(-10),
          ],
          max_tokens: 150,
          temperature: 0.8,
        }),
      })

      if (!response.ok) throw new Error('API error')

      const data = await response.json()
      return data.choices[0].message.content || FALLBACK_RESPONSES[0]
    } catch {
      return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]
    }
  }

  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]
}
