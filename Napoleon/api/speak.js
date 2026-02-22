export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const voiceId = process.env.NAPOLEON_VOICE_ID || 'CCddj69Jp4YRwsf5QEuT';
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify(req.body),
    });
    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    res.status(200).json({ audio: base64 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
