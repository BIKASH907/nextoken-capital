export function apiHandler(handler) {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (err) {
      console.error('API Error [' + req.url + ']:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
