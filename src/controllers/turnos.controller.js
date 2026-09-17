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
      turnos,
      cliente,
    } = req.body;

    if (
      !barberoId ||
      !servicioId ||
      !cliente?.nombre ||
      !cliente?.telefono
    ) {
      return res
        .status(400)
        .json({
          ok: false,

          message:
            "barberoId, servicioId, nombre y teléfono son obligatorios",
        });
    }

    /*
     * Una reserva puede ser:
     *
     * 1) fecha + hora
     * 2) un array de turnos para una promo paquete
     */
    if (
      !fecha &&
      !hora &&
      !Array.isArray(turnos)
    ) {
      return res
        .status(400)
        .json({
          ok: false,

          message:
            "Debés indicar fecha y hora o los turnos de la promoción",
        });
    }

    const resultado =
      await registrarTurno({
        barberoId,
        servicioId,

        promocionId:
          promocionId || null,

        fecha:
          fecha || null,

        hora:
          hora || null,

        turnos:
          Array.isArray(turnos)
            ? turnos
            : null,

        cliente: {
          nombre:
            cliente.nombre,

          telefono:
            cliente.telefono,
        },
      });

    res.status(201).json({
      ok: true,

      message:
        resultado.esPaquete
          ? "Promoción reservada correctamente"
          : "Turno reservado correctamente",

      data:
        resultado,
    });
  } catch (error) {
    next(error);
  }
};