import pool from "../config/database.js";

export const obtenerHorariosPorBarbero = async (barberoId) => {
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        barbero_id AS barberoId,
        dia_semana AS diaSemana,
        TIME_FORMAT(hora_inicio, '%H:%i') AS horaInicio,
        TIME_FORMAT(hora_fin, '%H:%i') AS horaFin
      FROM horarios_barberos
      WHERE barbero_id = ?
        AND activo = 1
      ORDER BY dia_semana ASC, hora_inicio ASC
    `,
    [barberoId]
  );

  return rows;
};

export const obtenerHorariosAdminPorBarbero = async (
  barberoId
) => {
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        barbero_id AS barberoId,
        dia_semana AS diaSemana,
        TIME_FORMAT(hora_inicio, '%H:%i') AS horaInicio,
        TIME_FORMAT(hora_fin, '%H:%i') AS horaFin,
        activo,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM horarios_barberos
      WHERE barbero_id = ?
      ORDER BY dia_semana ASC, hora_inicio ASC
    `,
    [barberoId]
  );

  return rows;
};

export const obtenerHorarioPorId = async (horarioId) => {
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        barbero_id AS barberoId,
        dia_semana AS diaSemana,
        TIME_FORMAT(hora_inicio, '%H:%i') AS horaInicio,
        TIME_FORMAT(hora_fin, '%H:%i') AS horaFin,
        activo
      FROM horarios_barberos
      WHERE id = ?
      LIMIT 1
    `,
    [horarioId]
  );

  return rows[0] || null;
};

export const crearHorarioAdmin = async ({
  barberoId,
  diaSemana,
  horaInicio,
  horaFin,
}) => {
  const [result] = await pool.execute(
    `
      INSERT INTO horarios_barberos (
        barbero_id,
        dia_semana,
        hora_inicio,
        hora_fin,
        activo
      )
      VALUES (?, ?, ?, ?, 1)
    `,
    [
      barberoId,
      diaSemana,
      horaInicio,
      horaFin,
    ]
  );

  return result.insertId;
};

export const actualizarHorarioAdmin = async ({
  horarioId,
  diaSemana,
  horaInicio,
  horaFin,
  activo,
}) => {
  await pool.execute(
    `
      UPDATE horarios_barberos
      SET
        dia_semana = ?,
        hora_inicio = ?,
        hora_fin = ?,
        activo = ?
      WHERE id = ?
    `,
    [
      diaSemana,
      horaInicio,
      horaFin,
      activo,
      horarioId,
    ]
  );
};

export const eliminarHorarioAdmin = async (horarioId) => {
  await pool.execute(
    `
      DELETE FROM horarios_barberos
      WHERE id = ?
    `,
    [horarioId]
  );
};

export const buscarHorarioSuperpuesto = async ({
  barberoId,
  diaSemana,
  horaInicio,
  horaFin,
  excluirHorarioId = null,
}) => {
  const parametros = [
    barberoId,
    diaSemana,
    horaFin,
    horaInicio,
  ];

  let excluir = "";

  if (excluirHorarioId) {
    excluir = "AND id <> ?";
    parametros.push(excluirHorarioId);
  }

  const [rows] = await pool.execute(
    `
      SELECT id
      FROM horarios_barberos
      WHERE barbero_id = ?
        AND dia_semana = ?
        AND activo = 1
        AND hora_inicio < ?
        AND hora_fin > ?
        ${excluir}
      LIMIT 1
    `,
    parametros
  );

  return rows[0] || null;
};