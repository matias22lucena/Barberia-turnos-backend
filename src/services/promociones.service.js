import {
  obtenerPromocionesActivas,
} from "../repositories/promociones.repository.js";

export const listarPromocionesActivas = async () => {
  const promociones = await obtenerPromocionesActivas();

  return promociones;
};