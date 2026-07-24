import { obtenerHorariosPorBarbero } from "../repositories/horarios.repository.js";

export const listarHorariosPorBarbero = async (barberoId) => {
  const id = Number(barberoId);

  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error("El barberoId debe ser un número entero válido");
    error.statusCode = 400;
    throw error;
  }

  return obtenerHorariosPorBarbero(id);
};