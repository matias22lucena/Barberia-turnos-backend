import { iniciarSesionAdministrador } from "../services/auth.service.js";

export const loginAdministrador = async (req, res, next) => {
  try {
    const resultado = await iniciarSesionAdministrador({
      email: req.body?.email,
      password: req.body?.password,
    });

    res.status(200).json({
      ok: true,
      message: "Inicio de sesión exitoso",
      data: resultado,
    });
  } catch (error) {
    next(error);
  }
};