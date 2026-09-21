import {
  obtenerContenidoHome,
} from "../repositories/home-contenido.repository.js";

export const consultarContenidoHome =
  async () => {
    const contenido =
      await obtenerContenidoHome();

    if (!contenido) {
      const error =
        new Error(
          "No se encontró la configuración del Home"
        );

      error.statusCode =
        404;

      throw error;
    }

    return contenido;
  };