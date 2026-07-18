import pool from "./database.js";

export const checkDatabaseConnection = async () => {
  let connection;

  try {
    connection = await pool.getConnection();

    await connection.query("SELECT 1");

    console.log("Conexión exitosa con MariaDB");
  } catch (error) {
    console.error("Error al conectar con MariaDB:");
    console.error(error.message);

    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};