export const errorHandler = (
  error,
  req,
  res,
  next
) => {
  console.error(error);

  const statusCode =
    error.statusCode ||
    error.status ||
    500;

  const message =
    statusCode === 500
      ? "Ocurrió un error interno en el servidor"
      : error.message;

  res.status(statusCode).json({
    ok: false,
    message,
  });
};