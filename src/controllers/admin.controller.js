export const obtenerPerfilAdministrador = async (
  req,
  res,
  next
) => {
  try {
    res.status(200).json({
      ok: true,
      message: "Acceso administrativo autorizado",
      data: {
        administrador: req.administrador,
      },
    });
  } catch (error) {
    next(error);
  }
};