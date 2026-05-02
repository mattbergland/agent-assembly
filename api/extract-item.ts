export const config = {
  runtime: 'edge',
}

interface ExtractRequest {
  image: string // base64 data URL
  apiKey?: string
}

interface ExtractedItem {
  name: string
  cost: number
  category: 'apparel' | 'tech' | 'drinkware' | 'stationery' | 'food' | 'custom'
  brand?: string
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let body: ExtractRequest
  try {
    body = await request.json()
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
  const apiKey = body.apiKey || process.env.OPENAI_API_KEY

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'no_api_key', message: 'No API key configured. Add your OpenAI API key in the settings.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Validate data URL format
  const base64Match = body.image?.match(/^data:image\/(\w+);base64,.+$/)
  if (!base64Match) {
    return new Response(
      JSON.stringify({ error: 'Invalid image format. Expected a base64 data URL.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: body.image,
                  detail: 'low',
                },
              },
              {
                type: 'text',
                text: `Look at this product screenshot and extract the product details. Return ONLY a JSON object with these fields:
- "name": the product name (string, keep it short — e.g. "Classic Hoodie")
- "brand": the brand or company name (string, e.g. "Patagonia", "Nike"). If not visible, use ""
- "cost": the unit price as a number (e.g. 29.99). If multiple prices, use the main/default one. If no price visible, use 0
- "category": the single best match from: "apparel", "tech", "drinkware", "stationery", "food", or "custom"

Return ONLY the JSON object, no markdown, no explanation.`,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${response.status}`, details: errorText }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const result = await response.json()
    const text = result.choices?.[0]?.message?.content || ''

    // Parse JSON from the response, handling potential markdown code blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return new Response(
        JSON.stringify({ error: 'Could not parse AI response', raw: text }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const extracted: ExtractedItem = JSON.parse(jsonMatch[0])

    // Validate category
    const validCategories = ['apparel', 'tech', 'drinkware', 'stationery', 'food', 'custom']
    if (!validCategories.includes(extracted.category)) {
      extracted.category = 'custom'
    }

    return new Response(JSON.stringify(extracted), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Failed to process screenshot', details: String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
