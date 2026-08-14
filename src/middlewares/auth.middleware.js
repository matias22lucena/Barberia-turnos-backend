import jwt from "jsonwebtoken";

export const verificarAdministrador = (
  req,
  res,
  next
) => {
  try {
    const encabezado = req.headers.authorization;

    if (
      !encabezado ||
      !encabezado.startsWith("Bearer ")
    ) {
      const error = new Error(
        "Token de autenticación requerido"
      );

      error.statusCode = 401;
      throw error;
    }

    const token = encabezado.slice(7);

    if (!process.env.JWT_SECRET) {
      const error = new Error(
        "JWT_SECRET no está configurado en el servidor"
      );

      error.statusCode = 500;
      throw error;
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (payload.tipo !== "ADMIN") {
      const error = new Error(
        "No tenés permisos para acceder a este recurso"
      );

      error.statusCode = 403;
      throw error;
    }

    req.administrador = {
      id: Number(payload.sub),
      tipo: payload.tipo,
    };

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      error.statusCode = 401;
      error.message =
        error.name === "TokenExpiredError"
          ? "La sesión expiró"
          : "El token no es válido";
    }

    next(error);
  }
};