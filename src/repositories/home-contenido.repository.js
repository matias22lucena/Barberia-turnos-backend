import pool from "../config/database.js";

export const obtenerContenidoHome =
  async () => {
    const [rows] =
      await pool.execute(`
        SELECT
          id,

          hero_imagen_url AS heroImagenUrl,
          hero_imagen_public_id AS heroImagenPublicId,

          hero_eyebrow AS heroEyebrow,
          hero_titulo AS heroTitulo,
          hero_titulo_destacado AS heroTituloDestacado,
          hero_descripcion AS heroDescripcion,

          hero_boton_reservar AS heroBotonReservar,
          hero_boton_servicios AS heroBotonServicios,
          hero_boton_horarios AS heroBotonHorarios,

          carrusel_eyebrow AS carruselEyebrow,
          carrusel_titulo AS carruselTitulo,
          carrusel_descripcion AS carruselDescripcion,

          servicios_eyebrow AS serviciosEyebrow,
          servicios_titulo AS serviciosTitulo,
          servicios_descripcion AS serviciosDescripcion,
          servicios_boton_reservar AS serviciosBotonReservar,

          promociones_eyebrow AS promocionesEyebrow,
          promociones_titulo AS promocionesTitulo,
          promociones_descripcion AS promocionesDescripcion,
          promociones_badge AS promocionesBadge,
          promociones_boton_reservar AS promocionesBotonReservar,

          horarios_eyebrow AS horariosEyebrow,
          horarios_titulo AS horariosTitulo,
          horarios_descripcion AS horariosDescripcion,
          horarios_nota AS horariosNota,

          updated_at AS updatedAt

        FROM home_contenido

        WHERE id = 1

        LIMIT 1
      `);

    return (
      rows[0] ||
      null
    );
  };

export const actualizarContenidoHome =
  async ({
    heroEyebrow,
    heroTitulo,
    heroTituloDestacado,
    heroDescripcion,

    heroBotonReservar,
    heroBotonServicios,
    heroBotonHorarios,

    carruselEyebrow,
    carruselTitulo,
    carruselDescripcion,

    serviciosEyebrow,
    serviciosTitulo,
    serviciosDescripcion,
    serviciosBotonReservar,

    promocionesEyebrow,
    promocionesTitulo,
    promocionesDescripcion,
    promocionesBadge,
    promocionesBotonReservar,

    horariosEyebrow,
    horariosTitulo,
    horariosDescripcion,
    horariosNota,
  }) => {
    await pool.execute(
      `
        UPDATE home_contenido

        SET
          hero_eyebrow = ?,
          hero_titulo = ?,
          hero_titulo_destacado = ?,
          hero_descripcion = ?,

          hero_boton_reservar = ?,
          hero_boton_servicios = ?,
          hero_boton_horarios = ?,

          carrusel_eyebrow = ?,
          carrusel_titulo = ?,
          carrusel_descripcion = ?,

          servicios_eyebrow = ?,
          servicios_titulo = ?,
          servicios_descripcion = ?,
          servicios_boton_reservar = ?,

          promociones_eyebrow = ?,
          promociones_titulo = ?,
          promociones_descripcion = ?,
          promociones_badge = ?,
          promociones_boton_reservar = ?,

          horarios_eyebrow = ?,
          horarios_titulo = ?,
          horarios_descripcion = ?,
          horarios_nota = ?

        WHERE id = 1
      `,
      [
        heroEyebrow,
        heroTitulo,
        heroTituloDestacado,
        heroDescripcion,

        heroBotonReservar,
        heroBotonServicios,
        heroBotonHorarios,

        carruselEyebrow,
        carruselTitulo,
        carruselDescripcion,

        serviciosEyebrow,
        serviciosTitulo,
        serviciosDescripcion,
        serviciosBotonReservar,

        promocionesEyebrow,
        promocionesTitulo,
        promocionesDescripcion,
        promocionesBadge,
        promocionesBotonReservar,

        horariosEyebrow,
        horariosTitulo,
        horariosDescripcion,
        horariosNota,
      ]
    );
  };

export const actualizarImagenHome =
  async ({
    imagenUrl,
    heroImagenPublicId,
  }) => {
    await pool.execute(
      `
        UPDATE home_contenido

        SET
          hero_imagen_url = ?,
          hero_imagen_public_id = ?

        WHERE id = 1
      `,
      [
        imagenUrl,
        heroImagenPublicId,
      ]
    );
  };