import crypto from "node:crypto";

export const generarCodigoTurno = () => {
  return crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase();
};