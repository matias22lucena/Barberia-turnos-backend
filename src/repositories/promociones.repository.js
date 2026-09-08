import pool from "../config/database.js";

export const obtenerPromocionesActivas = async () => {
  const [rows] = await pool.execute(`
    SELECT
      p.id,
      p.servicio_id AS servicioId,
      p.titulo,
      p.descripcion,
      p.precio,
      p.duracion_minutos AS duracionMinutos,
      p.activo,

      s.nombre AS servicioNombre

    FROM promociones p

    LEFT JOIN servicios s
      ON s.id = p.servicio_id

    WHERE p.activo = 1

    ORDER BY p.id ASC
  `);

  return rows;
};

export const obtenerPromocionesAdmin = async () => {
  const [rows] = await pool.execute(`
    SELECT
      p.id,
      p.servicio_id AS servicioId,
      p.titulo,
      p.descripcion,
      p.precio,
      p.duracion_minutos AS duracionMinutos,
      p.activo,
      p.created_at AS createdAt,
      p.updated_at AS updatedAt,

      s.nombre AS servicioNombre

    FROM promociones p

    LEFT JOIN servicios s
      ON s.id = p.servicio_id

    ORDER BY p.id ASC
  `);

  return rows;
};

export const obtenerPromocionPorId = async (promocionId) => {
  const [rows] = await pool.execute(
    `
      SELECT
        p.id,
        p.servicio_id AS servicioId,
        p.titulo,
        p.descripcion,
        p.precio,
        p.duracion_minutos AS duracionMinutos,
        p.activo,

        s.nombre AS servicioNombre

      FROM promociones p

      LEFT JOIN servicios s
        ON s.id = p.servicio_id

      WHERE p.id = ?

      LIMIT 1
    `,
    [promocionId]
  );

  return rows[0] || null;
};

export const crearPromocionAdmin = async ({
  servicioId,
  titulo,
  descripcion,
  precio,
  duracionMinutos,
  activo,
}) => {
  const [result] = await pool.execute(
    `
      INSERT INTO promociones (
        servicio_id,
        titulo,
        descripcion,
        precio,
        duracion_minutos,
        activo
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      servicioId || null,
      titulo,
      descripcion || null,
      precio ?? null,
      duracionMinutos,
      activo,
    ]
  );

  return result.insertId;
};

export const actualizarPromocionAdmin = async ({
  promocionId,
  servicioId,
  titulo,
  descripcion,
  precio,
  duracionMinutos,
  activo,
}) => {
  await pool.execute(
    `
      UPDATE promociones
      SET
        servicio_id = ?,
        titulo = ?,
        descripcion = ?,
        precio = ?,
        duracion_minutos = ?,
        activo = ?
      WHERE id = ?
    `,
    [
      servicioId || null,
      titulo,
      descripcion || null,
      precio ?? null,
      duracionMinutos,
      activo,
      promocionId,
    ]
  );
};

export const eliminarPromocionAdmin = async (promocionId) => {
  await pool.execute(
    `
      DELETE FROM promociones
      WHERE id = ?
    `,
    [promocionId]
  );
};