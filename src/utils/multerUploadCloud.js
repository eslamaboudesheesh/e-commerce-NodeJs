import multer, { diskStorage } from "multer";

export const multerUploadCloud = () => {
  const storage = diskStorage({});
  const fileFilter = (req, file, cb) => {
    //check file type
    if (!["image/png", "image/jpeg"].includes(file.mimetype)) {
      return cb(new Error("invalid Format"), false);
    }

    return cb(null, true);
  };

  const multerObj = multer({ storage, fileFilter });

  return multerObj;
};
