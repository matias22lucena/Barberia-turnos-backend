import pool from "../config/database.js";

export const obtenerBarberosPorServicio = async (servicioId) => {
  const [rows] = await pool.execute(
    `
      SELECT
        b.id,
        b.nombre,
        b.apellido,
        b.descripcion,
        b.foto_url AS fotoUrl
      FROM barberos b
      INNER JOIN barbero_servicios bs
        ON bs.barbero_id = b.id
      INNER JOIN servicios s
        ON s.id = bs.servicio_id
      WHERE bs.servicio_id = ?
        AND b.activo = 1
        AND s.activo = 1
      ORDER BY b.nombre ASC
    `,
    [servicioId]
  );

  return rows;
};