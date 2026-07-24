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