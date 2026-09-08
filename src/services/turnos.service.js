import pool from "../config/database.js";

import {
  bloquearBarbero,
  buscarTurnoSuperpuesto,
  crearTurno,
  obtenerPromocionParaTurno,
  obtenerServicioParaTurno,
  obtenerTurnoCreado,
  verificarHorarioLaboral,
  verificarRelacionBarberoServicio,
} from "../repositories/turnos.repository.js";

import {
  generarCodigoTurno,
} from "../utils/codigos.js";

import {
  convertirHoraAMinutos,
  sumarMinutosAHora,
} from "../utils/horas.js";

import {
  obtenerFechaHoraActualArgentina,
} from "../utils/fechaHora.js";

const validarId = (
  valor,
  nombreCampo
) => {
  const id = Number(valor);

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    const error = new Error(
      `${nombreCampo} no es válido`
    );

    error.statusCode = 400;

    throw error;
  }

  return id;
};

const validarFecha = (fecha) => {
  const formato =
    /^\d{4}-\d{2}-\d{2}$/;

  if (!formato.test(fecha)) {
    const error = new Error(
      "La fecha debe tener el formato YYYY-MM-DD"
    );

    error.statusCode = 400;

    throw error;
  }

  const fechaObjeto =
    new Date(
      `${fecha}T12:00:00`
    );

  if (
    Number.isNaN(
      fechaObjeto.getTime()
    )
  ) {
    const error = new Error(
      "La fecha no es válida"
    );

    error.statusCode = 400;

    throw error;
  }

  return fechaObjeto;
};

const validarHora = (hora) => {
  const formato =
    /^([01]\d|2[0-3]):[0-5]\d$/;

  if (!formato.test(hora)) {
    const error = new Error(
      "La hora debe tener el formato HH:mm"
    );

    error.statusCode = 400;

    throw error;
  }

  return hora;
};

const convertirDiaJavaScriptADiaBaseDatos = (
  diaJavaScript
) => {
  return diaJavaScript === 0
    ? 7
    : diaJavaScript;
};

export const registrarTurno = async ({
  barberoId,
  servicioId,
  promocionId = null,
  fecha,
  hora,
}) => {
  const barberoIdValidado =
    validarId(
      barberoId,
      "barberoId"
    );

  const servicioIdValidado =
    validarId(
      servicioId,
      "servicioId"
    );

  const promocionIdValidado =
    promocionId !== null &&
    promocionId !== undefined &&
    promocionId !== ""
      ? validarId(
          promocionId,
          "promocionId"
        )
      : null;

  const fechaObjeto =
    validarFecha(fecha);

  const horaInicio =
    validarHora(hora);

  const fechaHoraActual =
    obtenerFechaHoraActualArgentina();

  if (
    fecha <
    fechaHoraActual.fecha
  ) {
    const error = new Error(
      "No se puede reservar un turno en una fecha pasada"
    );

    error.statusCode = 400;

    throw error;
  }

  if (
    fecha ===
      fechaHoraActual.fecha &&
    convertirHoraAMinutos(
      horaInicio
    ) <=
      fechaHoraActual.minutosActuales
  ) {
    const error = new Error(
      "El horario seleccionado ya pasó"
    );

    error.statusCode = 400;

    throw error;
  }

  const connection =
    await pool.getConnection();

  try {
    await connection.beginTransaction();

    const barbero =
      await bloquearBarbero(
        connection,
        barberoIdValidado
      );

    if (
      !barbero ||
      !barbero.activo
    ) {
      const error = new Error(
        "El profesional no existe o está inactivo"
      );

      error.statusCode = 404;

      throw error;
    }

    const servicio =
      await obtenerServicioParaTurno(
        connection,
        servicioIdValidado
      );

    if (
      !servicio ||
      !servicio.activo
    ) {
      const error = new Error(
        "El servicio no existe o está inactivo"
      );

      error.statusCode = 404;

      throw error;
    }

    /*
     * Si viene promocionId,
     * buscamos y validamos la promoción.
     */
    let promocion = null;

    if (promocionIdValidado) {
      promocion =
        await obtenerPromocionParaTurno(
          connection,
          promocionIdValidado
        );

      if (
        !promocion ||
        !promocion.activo
      ) {
        const error = new Error(
          "La promoción no existe o está inactiva"
        );

        error.statusCode = 404;

        throw error;
      }

      if (
        !promocion.servicioId ||
        Number(
          promocion.servicioId
        ) !==
          servicioIdValidado
      ) {
        const error = new Error(
          "La promoción no corresponde al servicio seleccionado"
        );

        error.statusCode = 400;

        throw error;
      }
    }

    const realizaServicio =
      await verificarRelacionBarberoServicio(
        connection,
        barberoIdValidado,
        servicioIdValidado
      );

    if (!realizaServicio) {
      const error = new Error(
        "El profesional no realiza el servicio seleccionado"
      );

      error.statusCode = 400;

      throw error;
    }

    /*
     * Si es promo:
     * usamos duración y precio de la promo.
     *
     * Si es servicio normal:
     * usamos duración y precio del servicio.
     */
    const duracionReserva =
      promocion
        ? Number(
            promocion.duracionMinutos
          )
        : Number(
            servicio.duracionMinutos
          );

    const precioReserva =
      promocion
        ? promocion.precio
        : servicio.precio;

    const horaFin =
      sumarMinutosAHora(
        horaInicio,
        duracionReserva
      );

    const diaSemana =
      convertirDiaJavaScriptADiaBaseDatos(
        fechaObjeto.getDay()
      );

    const trabajaEnEseHorario =
      await verificarHorarioLaboral(
        connection,
        {
          barberoId:
            barberoIdValidado,

          diaSemana,

          horaInicio,
          horaFin,
        }
      );

    if (!trabajaEnEseHorario) {
      const error = new Error(
        "El horario seleccionado está fuera de la jornada laboral"
      );

      error.statusCode = 400;

      throw error;
    }

    const turnoSuperpuesto =
      await buscarTurnoSuperpuesto(
        connection,
        {
          barberoId:
            barberoIdValidado,

          fecha,
          horaInicio,
          horaFin,
        }
      );

    if (turnoSuperpuesto) {
      const error = new Error(
        "El horario seleccionado acaba de ser reservado"
      );

      error.statusCode = 409;

      throw error;
    }

    const codigo =
      generarCodigoTurno();

    const turnoId =
      await crearTurno(
        connection,
        {
          codigo,

          clienteId: null,

          barberoId:
            barberoIdValidado,

          servicioId:
            servicioIdValidado,

          promocionId:
            promocionIdValidado,

          fecha,

          horaInicio,
          horaFin,

          duracionMinutos:
            duracionReserva,

          precio:
            precioReserva,

          observacion: null,
        }
      );

    const turnoCreado =
      await obtenerTurnoCreado(
        connection,
        turnoId
      );

    await connection.commit();

    return turnoCreado;
  } catch (error) {
    await connection.rollback();

    throw error;
  } finally {
    connection.release();
  }
};