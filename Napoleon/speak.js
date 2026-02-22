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
    if (!response.ok) return res.status(response.status).json({ error: 'ElevenLabs error' });
    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.end(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
