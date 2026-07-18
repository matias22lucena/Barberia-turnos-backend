import { obtenerServiciosActivos } from "../repositories/servicios.repository.js";

export const listarServiciosActivos = async () => {
  const servicios = await obtenerServiciosActivos();

  return servicios;
};