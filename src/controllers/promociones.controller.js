import {
  listarPromocionesActivas,
} from "../services/promociones.service.js";

export const obtenerPromociones = async (req, res, next) => {
  try {
    const promociones = await listarPromocionesActivas();

    res.status(200).json({
      ok: true,
      data: promociones,
    });
  } catch (error) {
    next(error);
  }
};