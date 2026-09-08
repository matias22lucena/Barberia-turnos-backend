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
  const [rows] = await pool.execute(`
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
  `);

  return rows;
};

export const obtenerServicioPorId = async (
  servicioId
) => {
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

export const obtenerServicioPorNombre = async (
  nombre
) => {
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        nombre
      FROM servicios
      WHERE LOWER(nombre) = LOWER(?)
      LIMIT 1
    `,
    [nombre]
  );

  return rows[0] || null;
};

export const crearServicioAdmin = async ({
  nombre,
  descripcion,
  duracionMinutos,
  precio,
  activo,
}) => {
  const connection =
    await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] =
      await connection.execute(
        `
          INSERT INTO servicios (
            nombre,
            descripcion,
            duracion_minutos,
            precio,
            activo
          )
          VALUES (?, ?, ?, ?, ?)
        `,
        [
          nombre,
          descripcion || null,
          duracionMinutos,
          precio,
          activo,
        ]
      );

    const servicioId =
      result.insertId;

    /*
     * Relacionamos automáticamente
     * el servicio nuevo con todos
     * los barberos activos.
     */
    await connection.execute(
      `
        INSERT IGNORE INTO barbero_servicios (
          barbero_id,
          servicio_id
        )
        SELECT
          id,
          ?
        FROM barberos
        WHERE activo = 1
      `,
      [servicioId]
    );

    await connection.commit();

    return servicioId;
  } catch (error) {
    await connection.rollback();

    throw error;
  } finally {
    connection.release();
  }
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