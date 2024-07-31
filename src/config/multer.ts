import multer from "multer";
import path from "path";

const multerStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const options: multer.Options = {
  storage: multerStorage,
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(null, false);
    }

    cb(null, true);
  },
};

const upload = multer(options);

export { upload };
