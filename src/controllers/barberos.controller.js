import { listarBarberosPorServicio } from "../services/barberos.service.js";

export const obtenerBarberos = async (req, res, next) => {
  try {
    const { servicioId } = req.query;

    if (!servicioId) {
      return res.status(400).json({
        ok: false,
        message: "El parámetro servicioId es obligatorio",
      });
    }

    const barberos = await listarBarberosPorServicio(servicioId);

    res.status(200).json({
      ok: true,
      data: barberos,
    });
  } catch (error) {
    next(error);
  }
};