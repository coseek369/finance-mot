export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answers, contact } = req.body;

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
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
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

    const claudeData = await claudeResponse.json();
    const report = claudeData.content?.map(b => b.text || '').join('') || '';

    if (contact && contact.email) {
      const answersFormatted = answers.split('\n').map(line => {
        const [q, ...a] = line.split(': ');
        return `<tr><td style="padding:8px 12px;border-bottom:1px solid #1f2937;color:#9ca3af;font-family:monospace;font-size:13px;">${q}</td><td style="padding:8px 12px;border-bottom:1px solid #1f2937;color:#f9fafb;font-size:13px;">${a.join(': ')}</td></tr>`;
      }).join('');

      const reportFormatted = report.split('\n\n').map(p =>
        `<p style="margin:0 0 16px;line-height:1.7;color:#d1d5db;">${p}</p>`
      ).join('');

      const dateStr = new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

      // Email to Rich
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'Coseek Finance MOT <contact@coseek.ai>',
          to: 'contact@coseek.ai',
          subject: `${contact.wantsCall ? '🟢 WANTS A CALL' : '📧 Report Only'} — New Finance MOT: ${contact.company ? contact.company + ' · ' : ''}${contact.name || contact.email}`,
          html: `<div style="background:#030712;padding:32px;font-family:sans-serif;max-width:700px;margin:0 auto;">
            <div style="margin-bottom:24px;"><span style="color:#f9fafb;font-size:20px;font-weight:700;">⚡ COSEEK FINANCE MOT</span></div>
            <div style="background:${contact.wantsCall ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)'};border:1px solid ${contact.wantsCall ? '#10b981' : 'rgba(255,255,255,0.1)'};border-radius:12px;padding:20px;margin-bottom:24px;">
              <p style="color:${contact.wantsCall ? '#10b981' : '#9ca3af'};font-size:12px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 8px;">${contact.wantsCall ? '🟢 INTERESTED IN A CALL' : '📧 REPORT ONLY — FOLLOW UP IN 2 WEEKS'}</p>
              <p style="color:#10b981;font-size:13px;font-family:monospace;margin:0 0 4px;">${contact.company || ''}</p>
              <p style="color:#f9fafb;font-size:22px;font-weight:700;margin:0 0 6px;">${contact.name || 'Name not provided'}</p>
              <p style="color:#9ca3af;margin:0 0 4px;font-size:14px;">📧 ${contact.email}</p>
              ${contact.phone ? `<p style="color:#9ca3af;margin:0 0 4px;font-size:14px;">📞 ${contact.phone}</p>` : ''}
              <p style="color:#4b5563;font-size:12px;margin:8px 0 0;font-family:monospace;">${dateStr}</p>
            </div>
            ${contact.wantsCall ? `<div style="margin-bottom:24px;"><a href="https://calendly.com/coseekai/30min" style="display:inline-block;background:linear-gradient(135deg,#10b981,#059669);color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Book Their Call on Calendly →</a></div>` : ''}
            <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;margin-bottom:24px;">
              <div style="padding:14px 20px;border-bottom:1px solid rgba(255,255,255,0.08);"><p style="color:#10b981;font-family:monospace;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;margin:0;">Their Answers</p></div>
              <table style="width:100%;border-collapse:collapse;">${answersFormatted}</table>
            </div>
            <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:24px;">
              <p style="color:#10b981;font-family:monospace;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 16px;">Their MOT Report</p>
              ${reportFormatted}
            </div>
          </div>`
        })
      });

      // Email to client
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'Coseek Finance MOT <contact@coseek.ai>',
          to: contact.email,
          subject: 'Your Coseek Finance MOT Report',
          html: `<div style="background:#030712;padding:32px;font-family:sans-serif;max-width:700px;margin:0 auto;">
            <div style="margin-bottom:24px;"><span style="color:#f9fafb;font-size:20px;font-weight:700;">⚡ COSEEK FINANCE MOT</span></div>
            <p style="color:#f9fafb;font-size:22px;font-weight:700;margin:0 0 8px;">Hi ${contact.name ? contact.name.split(' ')[0] : 'there'},</p>
            <p style="color:#9ca3af;font-size:15px;line-height:1.7;margin:0 0 24px;">Here's your personalised Finance MOT report. We've analysed your answers and put together a clear picture of where your business finances stand — and what to focus on next.</p>
            <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:24px;margin-bottom:24px;">
              <p style="color:#10b981;font-family:monospace;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 16px;">Your Finance MOT Report</p>
              ${reportFormatted}
            </div>
            <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:24px;margin-bottom:24px;text-align:center;">
              <p style="color:#f9fafb;font-size:16px;font-weight:600;margin:0 0 8px;">Want to act on this?</p>
              <p style="color:#9ca3af;font-size:14px;margin:0 0 16px;">Book a free 30-minute call to walk through your results and build a plan together. No obligation.</p>
              <a href="https://calendly.com/coseekai/30min" style="display:inline-block;background:linear-gradient(135deg,#10b981,#059669);color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Book Your Free Call →</a>
            </div>
            <p style="color:#4b5563;font-size:12px;text-align:center;margin:0;">© Coseek · <a href="https://coseek.ai" style="color:#4b5563;">coseek.ai</a> · You received this because you completed the Coseek Finance MOT.</p>
          </div>`
        })
      });
    }

    return res.status(200).json({ report });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Failed to generate report' });
  }
}
