import multer from "multer";

const storage =
  multer.memoryStorage();

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

export const uploadHome =
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