const GAS_URL = 'ここにあなたのGASのexec URLを入れる';

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const params = new URLSearchParams();

      for (const [key, value] of Object.entries(req.query || {})) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, String(v)));
        } else if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      }

      const upstream = await fetch(`${GAS_URL}?${params.toString()}`, {
        method: 'GET',
        cache: 'no-store',
      });

      const text = await upstream.text();
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.status(upstream.ok ? 200 : 500).send(text);
      return;
    }

    if (req.method === 'POST') {
      const upstream = await fetch(GAS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(req.body || {}),
      });

      const text = await upstream.text();
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.status(upstream.ok ? 200 : 500).send(text);
      return;
    }

    res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: String(error),
    });
  }
};
