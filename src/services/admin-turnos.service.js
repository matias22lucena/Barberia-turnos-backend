import pool from "../config/database.js";

import {
  actualizarEstadoTurno,
  buscarTurnoAdminPorId,
  listarTurnosAdmin,
  obtenerTurnoCreado,
} from "../repositories/turnos.repository.js";

const ESTADOS_VALIDOS = [
  "CONFIRMADO",
  "CANCELADO",
  "COMPLETADO",
  "AUSENTE",
];

const validarFecha = (fecha) => {
  if (!fecha) {
    return null;
  }

  const formato = /^\d{4}-\d{2}-\d{2}$/;

  if (!formato.test(fecha)) {
    const error = new Error(
      "La fecha debe tener el formato YYYY-MM-DD"
    );

    error.statusCode = 400;
    throw error;
  }

  return fecha;
};

const validarEstado = (estado) => {
  if (!estado) {
    return null;
  }

  const estadoNormalizado = String(
    estado
  ).trim().toUpperCase();

  if (!ESTADOS_VALIDOS.includes(estadoNormalizado)) {
    const error = new Error(
      "El estado del turno no es válido"
    );

    error.statusCode = 400;
    throw error;
  }

  return estadoNormalizado;
};

const validarTurnoId = (valor) => {
  const turnoId = Number(valor);

  if (
    !Number.isInteger(turnoId) ||
    turnoId <= 0
  ) {
    const error = new Error(
      "El id del turno no es válido"
    );

    error.statusCode = 400;
    throw error;
  }

  return turnoId;
};

export const obtenerTurnosAdmin = async ({
  fecha,
  estado,
}) => {
  const fechaValidada = validarFecha(fecha);
  const estadoValidado = validarEstado(estado);

  const connection = await pool.getConnection();

  try {
    return await listarTurnosAdmin(connection, {
      fecha: fechaValidada,
      estado: estadoValidado,
    });
  } finally {
    connection.release();
  }
};

export const cambiarEstadoTurnoAdmin = async ({
  turnoId,
  estado,
}) => {
  const turnoIdValidado = validarTurnoId(turnoId);
  const estadoValidado = validarEstado(estado);

  if (!estadoValidado) {
    const error = new Error(
      "El estado es obligatorio"
    );

    error.statusCode = 400;
    throw error;
  }

  const connection = await pool.getConnection();

  try {
    const turno = await buscarTurnoAdminPorId(
      connection,
      turnoIdValidado
    );

    if (!turno) {
      const error = new Error(
        "El turno no existe"
      );

      error.statusCode = 404;
      throw error;
    }

    await actualizarEstadoTurno(connection, {
      turnoId: turnoIdValidado,
      estado: estadoValidado,
    });

    return await obtenerTurnoCreado(
      connection,
      turnoIdValidado
    );
  } finally {
    connection.release();
  }
};