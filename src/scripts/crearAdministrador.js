import "dotenv/config";
import bcrypt from "bcrypt";

import pool from "../config/database.js";

const [nombre, emailIngresado, password] = process.argv.slice(2);

const cerrarProceso = async (codigo) => {
  try {
    await pool.end();
  } finally {
    process.exit(codigo);
  }
};

if (!nombre || !emailIngresado || !password) {
  console.error(
    "Uso: npm run admin:create -- \"Nombre\" email contraseña"
  );

  await cerrarProceso(1);
}

const email = emailIngresado.trim().toLowerCase();

if (nombre.trim().length < 3) {
  console.error("El nombre debe tener al menos 3 caracteres.");
  await cerrarProceso(1);
}

const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!formatoEmail.test(email)) {
  console.error("El email ingresado no es válido.");
  await cerrarProceso(1);
}

if (password.length < 8) {
  console.error(
    "La contraseña debe tener al menos 8 caracteres."
  );

  await cerrarProceso(1);
}

const rounds = Number(process.env.BCRYPT_ROUNDS || 12);

if (
  !Number.isInteger(rounds) ||
  rounds < 10 ||
  rounds > 15
) {
  console.error(
    "BCRYPT_ROUNDS debe ser un número entero entre 10 y 15."
  );

  await cerrarProceso(1);
}

try {
  const passwordHash = await bcrypt.hash(password, rounds);

  const [administradores] = await pool.execute(
    `
      SELECT id
      FROM administradores
      LIMIT 1
    `
  );

  if (administradores.length > 0) {
    await pool.execute(
      `
        UPDATE administradores
        SET
          nombre = ?,
          email = ?,
          password_hash = ?,
          activo = 1
        WHERE id = ?
      `,
      [
        nombre.trim(),
        email,
        passwordHash,
        administradores[0].id,
      ]
    );

    console.log(
      "La cuenta del propietario fue actualizada correctamente."
    );
  } else {
    await pool.execute(
      `
        INSERT INTO administradores (
          nombre,
          email,
          password_hash
        )
        VALUES (?, ?, ?)
      `,
      [
        nombre.trim(),
        email,
        passwordHash,
      ]
    );

    console.log(
      "La cuenta del propietario fue creada correctamente."
    );
  }

  await cerrarProceso(0);
} catch (error) {
  console.error(
    "No se pudo crear la cuenta administrativa:",
    error.message
  );

  await cerrarProceso(1);
}