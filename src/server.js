import "dotenv/config";
import app from "./app.js";
import { checkDatabaseConnection } from "./config/checkDatabase.js";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await checkDatabaseConnection();

/*     app.listen(PORT, () => {
      console.log(`Servidor funcionando en http://localhost:${PORT}`);
    }); */
    app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
  } catch (error) {
    console.error("No se pudo iniciar el servidor");
    process.exit(1);
  }
};

startServer();