const GAS_URL = 'https://script.google.com/macros/s/AKfycbxjXYOJtlzWaclaI1q_g1jBkLTlzt8fJk6zj4cTnMXekg2ge37CmL-qoJjyaP9M0Sdl/exec';

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const params = new URLSearchParams();

      for (const [key, value] of Object.entries(req.query || {})) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, String(v)));
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
      res.setHeader('Cache-Control', 'no-store');
      res.status(200).send(text);
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
      res.setHeader('Cache-Control', 'no-store');
      res.status(200).send(text);
      return;
    }

    res.status(405).json({
      ok: false,
      error: 'Method not allowed',
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: String(error),
    });
  }
};
