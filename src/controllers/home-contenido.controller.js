import {
  consultarContenidoHome,
} from "../services/home-contenido.service.js";

export const obtenerContenidoHomePublico =
  async (
    req,
    res,
    next
  ) => {
    try {
      const contenido =
        await consultarContenidoHome();

      res.status(200).json({
        ok: true,
        data: contenido,
      });
    } catch (error) {
      next(error);
    }
  };