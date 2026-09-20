import fs from "fs";
import path from "path";

import {
  actualizarImagenCarrusel,
  crearImagenCarrusel,
  eliminarImagenCarrusel,
  obtenerImagenCarruselPorId,
  obtenerImagenesCarruselAdmin,
} from "../repositories/carrusel.repository.js";

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
      valor ||
        ""
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

const eliminarArchivoFisico = (
  imagenUrl
) => {
  if (!imagenUrl) {
    return;
  }

  const rutaRelativa =
    imagenUrl.replace(
      /^\/+/,
      ""
    );

  const ruta =
    path.resolve(
      rutaRelativa
    );

  if (
    fs.existsSync(
      ruta
    )
  ) {
    fs.unlinkSync(
      ruta
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

    const imagenUrl =
      `/uploads/carrusel/${archivo.filename}`;

    const imagenId =
      await crearImagenCarrusel({
        imagenUrl,

        titulo:
          validarTitulo(
            titulo
          ),

        orden:
          validarOrden(
            orden
          ),

        activo:
          convertirBoolean(
            activo
          ),
      });

    return await obtenerImagenCarruselPorId(
      imagenId
    );
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

    let imagenUrl =
      existente.imagenUrl;

    if (archivo) {
      imagenUrl =
        `/uploads/carrusel/${archivo.filename}`;
    }

    await actualizarImagenCarrusel({
      imagenId:
        id,

      imagenUrl,

      titulo:
        validarTitulo(
          titulo
        ),

      orden:
        validarOrden(
          orden
        ),

      activo:
        convertirBoolean(
          activo
        ),
    });

    if (
      archivo &&
      existente.imagenUrl !==
        imagenUrl
    ) {
      eliminarArchivoFisico(
        existente.imagenUrl
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

    await eliminarImagenCarrusel(
      id
    );

    eliminarArchivoFisico(
      existente.imagenUrl
    );
  };