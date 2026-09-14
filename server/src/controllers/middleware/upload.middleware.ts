import multer from "multer";

const storage = multer.memoryStorage();

export const uploadSingleImage = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedExtensions = /\.(jpg|jpeg|png|webp|gif|jfif)$/i;

    if (allowedExtensions.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file gambar yang diperbolehkan!"));
    }
  },
}).single("image");