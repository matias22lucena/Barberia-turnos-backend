import { listarServiciosActivos } from "../services/servicios.service.js";

export const obtenerServicios = async (req, res, next) => {
  try {
    const servicios = await listarServiciosActivos();

    res.status(200).json({
      ok: true,
      data: servicios,
    });
  } catch (error) {
    next(error);
  }
};