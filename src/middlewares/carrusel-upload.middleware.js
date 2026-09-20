import multer from "multer";
import fs from "fs";
import path from "path";

const carpetaCarrusel =
  path.resolve(
    "uploads",
    "carrusel"
  );

/*
 * Si la carpeta no existe,
 * se crea automáticamente.
 */
if (
  !fs.existsSync(
    carpetaCarrusel
  )
) {
  fs.mkdirSync(
    carpetaCarrusel,
    {
      recursive: true,
    }
  );
}

const storage =
  multer.diskStorage({
    destination: (
      req,
      file,
      cb
    ) => {
      cb(
        null,
        carpetaCarrusel
      );
    },

    filename: (
      req,
      file,
      cb
    ) => {
      const extension =
        path
          .extname(
            file.originalname
          )
          .toLowerCase();

      const nombre =
        `carrusel-${Date.now()}-${Math.round(
          Math.random() *
            1e9
        )}${extension}`;

      cb(
        null,
        nombre
      );
    },
  });

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

    error.statusCode =
      400;

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

export const uploadCarrusel =
  multer({
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