import cloudinary from "../config/cloudinary.js";

export const subirImagenCloudinary = (
  archivo,
  carpeta
) => {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      const stream =
        cloudinary.uploader.upload_stream(
          {
            folder:
              `pitbull-barber/${carpeta}`,

            resource_type:
              "image",
          },

          (
            error,
            resultado
          ) => {
            if (error) {
              return reject(
                error
              );
            }

            resolve(
              resultado
            );
          }
        );

      stream.end(
        archivo.buffer
      );
    }
  );
};

export const eliminarImagenCloudinary =
  async (
    publicId
  ) => {
    if (!publicId) {
      return;
    }

    await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type:
          "image",

        invalidate:
          true,
      }
    );
  };