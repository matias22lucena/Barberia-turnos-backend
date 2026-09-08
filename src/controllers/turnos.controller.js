import {
  registrarTurno,
} from "../services/turnos.service.js";

export const crearTurno = async (
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
      hora,
    } = req.body;

    if (
      !barberoId ||
      !servicioId ||
      !fecha ||
      !hora
    ) {
      return res.status(400).json({
        ok: false,
        message:
          "barberoId, servicioId, fecha y hora son obligatorios",
      });
    }

    const turno =
      await registrarTurno({
        barberoId,
        servicioId,
        promocionId:
          promocionId || null,
        fecha,
        hora,
      });

    res.status(201).json({
      ok: true,
      message:
        "Turno reservado correctamente",
      data: turno,
    });
  } catch (error) {
    next(error);
  }
};