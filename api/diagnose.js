export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answers } = req.body;

  if (!answers) {
    return res.status(400).json({ error: 'No answers provided' });
  }

  const prompt = `You are a senior financial consultant called Coseek. A small business owner has just completed their Finance MOT — a diagnostic questionnaire. Based on their answers, write a personalised Finance MOT report.

Their answers:
${answers}

Write the report in a direct, warm, plain English tone — like a trusted advisor who genuinely understands their situation. Not corporate, not condescending.

Structure it as follows:

1. A brief 2-sentence opening that reflects their specific situation back to them (use their actual answers to make it feel personal)

2. OVERALL MOT RESULT — give them a rating: Pass, Advisory Notice, or Fail — with a one-line verdict

3. YOUR THREE CRITICAL FINDINGS — the three most important issues, each with a specific financial consequence where possible (e.g. "this could mean you're losing £X without knowing it")

4. YOUR ACTION PLAN — three prioritised actions labelled Quick Win (this week), Short Term (next 30 days), and Bigger Fix (60-90 days)

5. A closing paragraph that references their specific answer to what they most want to fix, and tells them what the first step looks like

Keep the whole report to around 400-500 words. Make it feel like it was written specifically for them, not generated. Do not use bullet points — write in short paragraphs.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const text = data.content?.map(b => b.text || '').join('') || '';

    return res.status(200).json({ report: text });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Failed to generate report' });
  }
}
