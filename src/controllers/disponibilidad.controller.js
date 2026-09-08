import {
  obtenerDisponibilidad,
} from "../services/disponibilidad.service.js";

export const obtenerHorariosDisponibles =
  async (
    req,
    res,
    next
  ) => {
    try {
      const {
        barberoId,
        servicioId,
        promocionId,
        fecha,
      } = req.query;

      if (
        !barberoId ||
        !servicioId ||
        !fecha
      ) {
        return res.status(400).json({
          ok: false,
          message:
            "Los parámetros barberoId, servicioId y fecha son obligatorios",
        });
      }

      const disponibilidad =
        await obtenerDisponibilidad({
          barberoId,
          servicioId,
          promocionId:
            promocionId || null,
          fecha,
        });

      res.status(200).json({
        ok: true,
        data: disponibilidad,
      });
    } catch (error) {
      next(error);
    }
  };