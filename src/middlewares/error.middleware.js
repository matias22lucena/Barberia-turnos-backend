export const errorHandler = (error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    ok: false,
    message: "Ocurrió un error interno en el servidor",
  });
};