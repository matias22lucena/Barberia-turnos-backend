import multer from "multer";
import fs from "fs";
import path from "path";

/*
 * Carpeta donde se guardará
 * la imagen principal del Home.
 */
const carpetaHome = path.resolve(
  "uploads",
  "home"
);

/*
 * Si la carpeta no existe,
 * la creamos automáticamente.
 */
if (!fs.existsSync(carpetaHome)) {
  fs.mkdirSync(carpetaHome, {
    recursive: true,
  });
}

/*
 * Configuración de almacenamiento.
 */
const storage = multer.diskStorage({
  destination: (
    req,
    file,
    cb
  ) => {
    cb(
      null,
      carpetaHome
    );
  },

  filename: (
    req,
    file,
    cb
  ) => {
    const extension = path
      .extname(
        file.originalname
      )
      .toLowerCase();

    const nombreArchivo =
      `home-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${extension}`;

    cb(
      null,
      nombreArchivo
    );
  },
});

/*
 * Validación del tipo de imagen.
 */
const filtroArchivos = (
  req,
  file,
  cb
) => {
  const tiposPermitidos = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (
    !tiposPermitidos.includes(
      file.mimetype
    )
  ) {
    const error =
      new Error(
        "Solo se permiten imágenes JPG, JPEG, PNG o WEBP"
      );

    error.statusCode = 400;

    return cb(
      error,
      false
    );
  }

  cb(
    null,
    true
  );
};

/*
 * Middleware para subir
 * la imagen del Home.
 */
export const uploadHome = multer({
  storage,

  fileFilter:
    filtroArchivos,

  limits: {
    fileSize:
      5 *
      1024 *
      1024,
  },
});