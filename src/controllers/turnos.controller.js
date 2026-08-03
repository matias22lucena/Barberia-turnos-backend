import { registrarTurno } from "../services/turnos.service.js";

export const crearTurno = async (req, res, next) => {
  try {
    const {
      barberoId,
      servicioId,
      fecha,
      hora,
      cliente,
    } = req.body;

    if (
      !barberoId ||
      !servicioId ||
      !fecha ||
      !hora ||
      !cliente
    ) {
      return res.status(400).json({
        ok: false,
        message:
          "barberoId, servicioId, fecha, hora y cliente son obligatorios",
      });
    }

    const turno = await registrarTurno({
      barberoId,
      servicioId,
      fecha,
      hora,
      cliente,
    });

    res.status(201).json({
      ok: true,
      message: "Turno reservado correctamente",
      data: turno,
    });
  } catch (error) {
    next(error);
  }
};