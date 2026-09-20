import {
  obtenerImagenesCarruselActivas,
} from "../repositories/carrusel.repository.js";

export const listarImagenesCarrusel =
  async () => {
    return await obtenerImagenesCarruselActivas();
  };