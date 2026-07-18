export const notFoundHandler = (req, res) => {
  res.status(404).json({
    ok: false,
    message: `La ruta ${req.method} ${req.originalUrl} no existe`,
  });
};