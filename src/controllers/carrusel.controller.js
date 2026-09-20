import {
  listarImagenesCarrusel,
} from "../services/carrusel.service.js";

export const obtenerCarrusel =
  async (
    req,
    res,
    next
  ) => {
    try {
      const imagenes =
        await listarImagenesCarrusel();

      res.status(200).json({
        ok: true,
        data: imagenes,
      });
    } catch (error) {
      next(error);
    }
  };