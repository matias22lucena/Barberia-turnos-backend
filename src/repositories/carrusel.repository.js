import pool from "../config/database.js";

export const obtenerImagenesCarruselActivas =
  async () => {
    const [rows] =
      await pool.execute(`
        SELECT
          id,
          imagen_url AS imagenUrl,
          titulo,
          orden,
          activo

        FROM carrusel_imagenes

        WHERE activo = 1

        ORDER BY
          orden ASC,
          id ASC
      `);

    return rows;
  };

export const obtenerImagenesCarruselAdmin =
  async () => {
    const [rows] =
      await pool.execute(`
        SELECT
          id,
          imagen_url AS imagenUrl,
          titulo,
          orden,
          activo,
          created_at AS createdAt,
          updated_at AS updatedAt

        FROM carrusel_imagenes

        ORDER BY
          orden ASC,
          id ASC
      `);

    return rows;
  };

export const obtenerImagenCarruselPorId =
  async (
    imagenId
  ) => {
    const [rows] =
      await pool.execute(
        `
          SELECT
            id,
            imagen_url AS imagenUrl,
            titulo,
            orden,
            activo

          FROM carrusel_imagenes

          WHERE id = ?

          LIMIT 1
        `,
        [
          imagenId,
        ]
      );

    return (
      rows[0] ||
      null
    );
  };

export const crearImagenCarrusel =
  async ({
    imagenUrl,
    titulo,
    orden,
    activo,
  }) => {
    const [result] =
      await pool.execute(
        `
          INSERT INTO carrusel_imagenes (
            imagen_url,
            titulo,
            orden,
            activo
          )
          VALUES (?, ?, ?, ?)
        `,
        [
          imagenUrl,
          titulo ||
            null,
          orden,
          activo,
        ]
      );

    return result.insertId;
  };

export const actualizarImagenCarrusel =
  async ({
    imagenId,
    imagenUrl,
    titulo,
    orden,
    activo,
  }) => {
    await pool.execute(
      `
        UPDATE carrusel_imagenes

        SET
          imagen_url = ?,
          titulo = ?,
          orden = ?,
          activo = ?

        WHERE id = ?
      `,
      [
        imagenUrl,
        titulo ||
          null,
        orden,
        activo,
        imagenId,
      ]
    );
  };

export const eliminarImagenCarrusel =
  async (
    imagenId
  ) => {
    await pool.execute(
      `
        DELETE FROM carrusel_imagenes
        WHERE id = ?
      `,
      [
        imagenId,
      ]
    );
  };