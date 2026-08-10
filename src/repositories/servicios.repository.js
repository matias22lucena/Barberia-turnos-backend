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
export const obtenerServiciosAdmin = async () => {
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        nombre,
        descripcion,
        duracion_minutos AS duracionMinutos,
        precio,
        activo,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM servicios
      ORDER BY id ASC
    `
  );

  return rows;
};

export const obtenerServicioPorId = async (servicioId) => {
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        nombre,
        descripcion,
        duracion_minutos AS duracionMinutos,
        precio,
        activo
      FROM servicios
      WHERE id = ?
      LIMIT 1
    `,
    [servicioId]
  );

  return rows[0] || null;
};

export const actualizarServicioAdmin = async ({
  servicioId,
  nombre,
  descripcion,
  duracionMinutos,
  precio,
  activo,
}) => {
  await pool.execute(
    `
      UPDATE servicios
      SET
        nombre = ?,
        descripcion = ?,
        duracion_minutos = ?,
        precio = ?,
        activo = ?
      WHERE id = ?
    `,
    [
      nombre,
      descripcion || null,
      duracionMinutos,
      precio,
      activo,
      servicioId,
    ]
  );
};