import multer from "multer";
import { ErrorType } from "../types";

const multerStorage = multer.memoryStorage();

const upload: multer.Options = {
  storage: multerStorage,
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      cb(new Error("invalid-image-upload" as ErrorType));
    }

    cb(null, true);
  },
};

export { upload };
