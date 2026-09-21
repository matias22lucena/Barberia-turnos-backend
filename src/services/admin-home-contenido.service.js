import {
  actualizarContenidoHome,
  actualizarImagenHome,
  obtenerContenidoHome,
} from "../repositories/home-contenido.repository.js";

import {
  subirImagenCloudinary,
  eliminarImagenCloudinary,
} from "../utils/cloudinary.js";

const validarTexto = (
  valor,
  nombre,
  maximo
) => {
  const texto =
    String(
      valor ?? ""
    ).trim();

  if (!texto) {
    const error =
      new Error(
        `El campo ${nombre} es obligatorio`
      );

    error.statusCode =
      400;

    throw error;
  }

  if (
    texto.length >
    maximo
  ) {
    const error =
      new Error(
        `El campo ${nombre} no puede superar los ${maximo} caracteres`
      );

    error.statusCode =
      400;

    throw error;
  }

  return texto;
};

const eliminarImagenAnterior =
  async (
    publicId
  ) => {
    if (!publicId) {
      return;
    }

    try {
      await eliminarImagenCloudinary(
        publicId
      );
    } catch (error) {
      console.error(
        "No se pudo eliminar la imagen anterior de Cloudinary:",
        error.message
      );
    }
  };

export const listarContenidoHomeAdmin =
  async () => {
    const contenido =
      await obtenerContenidoHome();

    if (!contenido) {
      const error =
        new Error(
          "No existe la configuración del Home"
        );

      error.statusCode =
        404;

      throw error;
    }

    return contenido;
  };

export const editarContenidoHomeAdmin =
  async (
    datos
  ) => {
    const contenidoExistente =
      await obtenerContenidoHome();

    if (!contenidoExistente) {
      const error =
        new Error(
          "No existe la configuración del Home"
        );

      error.statusCode =
        404;

      throw error;
    }

    const contenidoValidado = {
      heroEyebrow:
        validarTexto(
          datos.heroEyebrow,
          "heroEyebrow",
          150
        ),

      heroTitulo:
        validarTexto(
          datos.heroTitulo,
          "heroTitulo",
          200
        ),

      heroTituloDestacado:
        validarTexto(
          datos.heroTituloDestacado,
          "heroTituloDestacado",
          200
        ),

      heroDescripcion:
        validarTexto(
          datos.heroDescripcion,
          "heroDescripcion",
          500
        ),

      heroBotonReservar:
        validarTexto(
          datos.heroBotonReservar,
          "heroBotonReservar",
          100
        ),

      heroBotonServicios:
        validarTexto(
          datos.heroBotonServicios,
          "heroBotonServicios",
          100
        ),

      heroBotonHorarios:
        validarTexto(
          datos.heroBotonHorarios,
          "heroBotonHorarios",
          100
        ),

      carruselEyebrow:
        validarTexto(
          datos.carruselEyebrow,
          "carruselEyebrow",
          150
        ),

      carruselTitulo:
        validarTexto(
          datos.carruselTitulo,
          "carruselTitulo",
          200
        ),

      carruselDescripcion:
        validarTexto(
          datos.carruselDescripcion,
          "carruselDescripcion",
          500
        ),

      serviciosEyebrow:
        validarTexto(
          datos.serviciosEyebrow,
          "serviciosEyebrow",
          150
        ),

      serviciosTitulo:
        validarTexto(
          datos.serviciosTitulo,
          "serviciosTitulo",
          250
        ),

      serviciosDescripcion:
        validarTexto(
          datos.serviciosDescripcion,
          "serviciosDescripcion",
          500
        ),

      serviciosBotonReservar:
        validarTexto(
          datos.serviciosBotonReservar,
          "serviciosBotonReservar",
          100
        ),

      promocionesEyebrow:
        validarTexto(
          datos.promocionesEyebrow,
          "promocionesEyebrow",
          150
        ),

      promocionesTitulo:
        validarTexto(
          datos.promocionesTitulo,
          "promocionesTitulo",
          250
        ),

      promocionesDescripcion:
        validarTexto(
          datos.promocionesDescripcion,
          "promocionesDescripcion",
          500
        ),

      promocionesBadge:
        validarTexto(
          datos.promocionesBadge,
          "promocionesBadge",
          50
        ),

      promocionesBotonReservar:
        validarTexto(
          datos.promocionesBotonReservar,
          "promocionesBotonReservar",
          100
        ),

      horariosEyebrow:
        validarTexto(
          datos.horariosEyebrow,
          "horariosEyebrow",
          150
        ),

      horariosTitulo:
        validarTexto(
          datos.horariosTitulo,
          "horariosTitulo",
          250
        ),

      horariosDescripcion:
        validarTexto(
          datos.horariosDescripcion,
          "horariosDescripcion",
          500
        ),

      horariosNota:
        validarTexto(
          datos.horariosNota,
          "horariosNota",
          500
        ),
    };

    await actualizarContenidoHome(
      contenidoValidado
    );

    return await obtenerContenidoHome();
  };

export const cambiarImagenHomeAdmin =
  async (
    archivo
  ) => {
    if (!archivo) {
      const error =
        new Error(
          "Debés seleccionar una imagen"
        );

      error.statusCode =
        400;

      throw error;
    }

    const contenido =
      await obtenerContenidoHome();

    if (!contenido) {
      const error =
        new Error(
          "No existe la configuración del Home"
        );

      error.statusCode =
        404;

      throw error;
    }

    /*
     * Subimos la nueva imagen.
     */
    const resultadoCloudinary =
      await subirImagenCloudinary(
        archivo,
        "home"
      );

    try {
      /*
       * Guardamos URL y public_id
       * en MySQL.
       */
      await actualizarImagenHome({
        imagenUrl:
          resultadoCloudinary.secure_url,

        heroImagenPublicId:
          resultadoCloudinary.public_id,
      });
    } catch (error) {
      /*
       * Si falla MySQL,
       * eliminamos la imagen recién
       * subida.
       */
      await eliminarImagenAnterior(
        resultadoCloudinary.public_id
      );

      throw error;
    }

    /*
     * Si existía una imagen anterior
     * de Cloudinary, la eliminamos
     * después de actualizar MySQL.
     */
    if (
      contenido.heroImagenPublicId &&
      contenido.heroImagenPublicId !==
        resultadoCloudinary.public_id
    ) {
      await eliminarImagenAnterior(
        contenido.heroImagenPublicId
      );
    }

    return await obtenerContenidoHome();
  };

export const quitarImagenHomeAdmin =
  async () => {
    const contenido =
      await obtenerContenidoHome();

    if (!contenido) {
      const error =
        new Error(
          "No existe la configuración del Home"
        );

      error.statusCode =
        404;

      throw error;
    }

    const publicIdAnterior =
      contenido.heroImagenPublicId;

    /*
     * Primero limpiamos MySQL.
     */
    await actualizarImagenHome({
      imagenUrl:
        null,

      heroImagenPublicId:
        null,
    });

    /*
     * Después eliminamos
     * de Cloudinary.
     */
    if (
      publicIdAnterior
    ) {
      await eliminarImagenAnterior(
        publicIdAnterior
      );
    }

    return await obtenerContenidoHome();
  };