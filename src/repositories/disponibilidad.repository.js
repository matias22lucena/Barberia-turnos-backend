import pool from "../config/database.js";

export const obtenerServicioPorId = async (
  servicioId
) => {
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        nombre,
        duracion_minutos AS duracionMinutos,
        activo
      FROM servicios
      WHERE id = ?
      LIMIT 1
    `,
    [servicioId]
  );

  return rows[0] || null;
};

export const obtenerPromocionPorId = async (
  promocionId
) => {
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        servicio_id AS servicioId,
        cantidad_servicios AS cantidadServicios,
        titulo,
        descripcion,
        duracion_minutos AS duracionMinutos,
        precio,
        activo
      FROM promociones
      WHERE id = ?
      LIMIT 1
    `,
    [promocionId]
  );

  return rows[0] || null;
};

export const obtenerBarberoPorId = async (
  barberoId
) => {
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        nombre,
        apellido,
        activo
      FROM barberos
      WHERE id = ?
      LIMIT 1
    `,
    [barberoId]
  );

  return rows[0] || null;
};

export const verificarBarberoRealizaServicio = async (
  barberoId,
  servicioId
) => {
  const [rows] = await pool.execute(
    `
      SELECT barbero_id
      FROM barbero_servicios
      WHERE barbero_id = ?
        AND servicio_id = ?
      LIMIT 1
    `,
    [
      barberoId,
      servicioId,
    ]
  );

  return rows.length > 0;
};

export const obtenerFranjasLaborales = async (
  barberoId,
  diaSemana
) => {
  const [rows] = await pool.execute(
    `
      SELECT
        id,

        TIME_FORMAT(
          hora_inicio,
          '%H:%i'
        ) AS horaInicio,

        TIME_FORMAT(
          hora_fin,
          '%H:%i'
        ) AS horaFin

      FROM horarios_barberos

      WHERE barbero_id = ?
        AND dia_semana = ?
        AND activo = 1

      ORDER BY hora_inicio ASC
    `,
    [
      barberoId,
      diaSemana,
    ]
  );

  return rows;
};

export const obtenerTurnosOcupadosPorFecha = async (
  barberoId,
  fecha
) => {
  const [rows] = await pool.execute(
    `
      SELECT
        id,

        TIME_FORMAT(
          hora_inicio,
          '%H:%i'
        ) AS horaInicio,

        TIME_FORMAT(
          hora_fin,
          '%H:%i'
        ) AS horaFin

      FROM turnos

      WHERE barbero_id = ?
        AND fecha = ?
        AND estado = 'CONFIRMADO'

      ORDER BY hora_inicio ASC
    `,
    [
      barberoId,
      fecha,
    ]
  );

  return rows;
};