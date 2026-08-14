import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import pool from "../config/database.js";

import {
  actualizarUltimoAcceso,
  buscarAdministradorPorEmail,
} from "../repositories/auth.repository.js";

const validarEmail = (email) => {
  const emailLimpio = String(email || "")
    .trim()
    .toLowerCase();

  const formato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formato.test(emailLimpio)) {
    const error = new Error("El email ingresado no es válido");
    error.statusCode = 400;
    throw error;
  }

  return emailLimpio;
};

const validarPassword = (password) => {
  const passwordLimpio = String(password || "");

  if (passwordLimpio.length < 8) {
    const error = new Error(
      "La contraseña debe tener al menos 8 caracteres"
    );

    error.statusCode = 400;
    throw error;
  }

  return passwordLimpio;
};

export const iniciarSesionAdministrador = async ({
  email,
  password,
}) => {
  const emailValidado = validarEmail(email);
  const passwordValidado = validarPassword(password);

  if (!process.env.JWT_SECRET) {
    const error = new Error(
      "JWT_SECRET no está configurado en el servidor"
    );

    error.statusCode = 500;
    throw error;
  }

  const connection = await pool.getConnection();

  try {
    const administrador =
      await buscarAdministradorPorEmail(
        connection,
        emailValidado
      );

    if (!administrador || !administrador.activo) {
      const error = new Error(
        "Email o contraseña incorrectos"
      );

      error.statusCode = 401;
      throw error;
    }

    const passwordCorrecta = await bcrypt.compare(
      passwordValidado,
      administrador.passwordHash
    );

    if (!passwordCorrecta) {
      const error = new Error(
        "Email o contraseña incorrectos"
      );

      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        sub: administrador.id,
        tipo: "ADMIN",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "8h",
      }
    );

    await actualizarUltimoAcceso(
      connection,
      administrador.id
    );

    return {
      token,
      administrador: {
        id: administrador.id,
        nombre: administrador.nombre,
        email: administrador.email,
      },
    };
  } finally {
    connection.release();
  }
};