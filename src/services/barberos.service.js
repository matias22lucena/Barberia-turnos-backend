import { obtenerBarberosPorServicio } from "../repositories/barberos.repository.js";

export const listarBarberosPorServicio = async (servicioId) => {
  const id = Number(servicioId);

  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error("El servicioId debe ser un número entero válido");
    error.statusCode = 400;
    throw error;
  }

  return obtenerBarberosPorServicio(id);
};  