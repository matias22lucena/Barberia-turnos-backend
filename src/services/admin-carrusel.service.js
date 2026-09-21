import {
  actualizarImagenCarrusel,
  crearImagenCarrusel,
  eliminarImagenCarrusel,
  obtenerImagenCarruselPorId,
  obtenerImagenesCarruselAdmin,
} from "../repositories/carrusel.repository.js";

import {
  subirImagenCloudinary,
  eliminarImagenCloudinary,
} from "../utils/cloudinary.js";

const validarId = (
  valor
) => {
  const id =
    Number(valor);

  if (
    !Number.isInteger(
      id
    ) ||
    id <= 0
  ) {
    const error =
      new Error(
        "El id de la imagen no es válido"
      );

    error.statusCode =
      400;

    throw error;
  }

  return id;
};

const validarTitulo = (
  valor
) => {
  const titulo =
    String(
      valor || ""
    ).trim();

  if (
    titulo.length >
    120
  ) {
    const error =
      new Error(
        "El título no puede superar los 120 caracteres"
      );

    error.statusCode =
      400;

    throw error;
  }

  return titulo;
};

const validarOrden = (
  valor
) => {
  const orden =
    Number(
      valor ?? 0
    );

  if (
    !Number.isInteger(
      orden
    ) ||
    orden < 0
  ) {
    const error =
      new Error(
        "El orden debe ser un número entero mayor o igual a cero"
      );

    error.statusCode =
      400;

    throw error;
  }

  return orden;
};

const convertirBoolean = (
  valor
) => {
  if (
    typeof valor ===
    "boolean"
  ) {
    return valor;
  }

  if (
    valor === "true" ||
    valor === "1" ||
    valor === 1
  ) {
    return true;
  }

  if (
    valor === "false" ||
    valor === "0" ||
    valor === 0
  ) {
    return false;
  }

  return true;
};

/*
 * Intenta eliminar una imagen de
 * Cloudinary sin romper la operación
 * principal si Cloudinary devuelve
 * algún error.
 */
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

export const listarCarruselAdmin =
  async () => {
    return await obtenerImagenesCarruselAdmin();
  };

export const crearImagenCarruselAdmin =
  async ({
    archivo,
    titulo,
    orden,
    activo,
  }) => {
    if (!archivo) {
      const error =
        new Error(
          "Debés seleccionar una imagen"
        );

      error.statusCode =
        400;

      throw error;
    }

    /*
     * Validamos antes de subir
     * la imagen para no generar
     * archivos huérfanos.
     */
    const tituloValidado =
      validarTitulo(
        titulo
      );

    const ordenValidado =
      validarOrden(
        orden
      );

    const activoValidado =
      convertirBoolean(
        activo
      );

    /*
     * Subimos la imagen.
     */
    const resultadoCloudinary =
      await subirImagenCloudinary(
        archivo,
        "carrusel"
      );

    try {
      const imagenId =
        await crearImagenCarrusel({
          imagenUrl:
            resultadoCloudinary.secure_url,

          cloudinaryPublicId:
            resultadoCloudinary.public_id,

          titulo:
            tituloValidado,

          orden:
            ordenValidado,

          activo:
            activoValidado,
        });

      return await obtenerImagenCarruselPorId(
        imagenId
      );
    } catch (error) {
      /*
       * Si falla MySQL después de
       * subir a Cloudinary,
       * eliminamos la imagen nueva.
       */
      await eliminarImagenAnterior(
        resultadoCloudinary.public_id
      );

      throw error;
    }
  };

export const editarImagenCarruselAdmin =
  async ({
    imagenId,
    archivo,
    titulo,
    orden,
    activo,
  }) => {
    const id =
      validarId(
        imagenId
      );

    const existente =
      await obtenerImagenCarruselPorId(
        id
      );

    if (!existente) {
      const error =
        new Error(
          "La imagen no existe"
        );

      error.statusCode =
        404;

      throw error;
    }

    const tituloValidado =
      validarTitulo(
        titulo
      );

    const ordenValidado =
      validarOrden(
        orden
      );

    const activoValidado =
      convertirBoolean(
        activo
      );

    let imagenUrl =
      existente.imagenUrl;

    let cloudinaryPublicId =
      existente.cloudinaryPublicId;

    let nuevaImagen =
      null;

    /*
     * Solo subimos otra imagen
     * si el administrador seleccionó
     * un archivo nuevo.
     */
    if (archivo) {
      nuevaImagen =
        await subirImagenCloudinary(
          archivo,
          "carrusel"
        );

      imagenUrl =
        nuevaImagen.secure_url;

      cloudinaryPublicId =
        nuevaImagen.public_id;
    }

    try {
      await actualizarImagenCarrusel({
        imagenId:
          id,

        imagenUrl,

        cloudinaryPublicId,

        titulo:
          tituloValidado,

        orden:
          ordenValidado,

        activo:
          activoValidado,
      });
    } catch (error) {
      /*
       * Si se subió una imagen nueva
       * pero falló MySQL,
       * la quitamos de Cloudinary.
       */
      if (nuevaImagen) {
        await eliminarImagenAnterior(
          nuevaImagen.public_id
        );
      }

      throw error;
    }

    /*
     * Recién después de confirmar
     * el UPDATE eliminamos
     * la imagen anterior.
     */
    if (
      nuevaImagen &&
      existente.cloudinaryPublicId &&
      existente.cloudinaryPublicId !==
        nuevaImagen.public_id
    ) {
      await eliminarImagenAnterior(
        existente.cloudinaryPublicId
      );
    }

    return await obtenerImagenCarruselPorId(
      id
    );
  };

export const eliminarImagenCarruselAdmin =
  async (
    imagenId
  ) => {
    const id =
      validarId(
        imagenId
      );

    const existente =
      await obtenerImagenCarruselPorId(
        id
      );

    if (!existente) {
      const error =
        new Error(
          "La imagen no existe"
        );

      error.statusCode =
        404;

      throw error;
    }

    /*
     * Primero eliminamos el registro
     * de MySQL.
     */
    await eliminarImagenCarrusel(
      id
    );

    /*
     * Después eliminamos el recurso
     * físico de Cloudinary.
     */
    if (
      existente.cloudinaryPublicId
    ) {
      await eliminarImagenAnterior(
        existente.cloudinaryPublicId
      );
    }
  };