import pool from "../config/database.js";

export const obtenerServiciosActivos = async () => {
  const [rows] = await pool.execute(`
    SELECT
      id,
      nombre,
      descripcion,
      duracion_minutos AS duracionMinutos,
      precio
    FROM servicios
    WHERE activo = 1
    ORDER BY id ASC
  `);

  return rows;
};