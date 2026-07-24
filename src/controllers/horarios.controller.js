import { listarHorariosPorBarbero } from "../services/horarios.service.js";

export const obtenerHorarios = async (req, res, next) => {
  try {
    const { barberoId } = req.query;

    if (!barberoId) {
      return res.status(400).json({
        ok: false,
        message: "El parámetro barberoId es obligatorio",
      });
    }

    const horarios = await listarHorariosPorBarbero(barberoId);

    res.status(200).json({
      ok: true,
      data: horarios,
    });
  } catch (error) {
    next(error);
  }
};