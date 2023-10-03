import * as Crypto from "node:crypto";
import multer from "multer";
import * as Config from "@/Config";
import { UploadService } from "./types";
import { UploadException } from "./exception";

// Variable --------------------------------------------------------------------
const ALLOWED_MIME_TYPES_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
};

const ALLOWED_MAX_SIZE_IN_MB = 2;

const MULTER_ERROR_CODE_DESCRIPTION: Record<multer.ErrorCode, string> = {
  LIMIT_FILE_SIZE: `Picture must be less than ${ALLOWED_MAX_SIZE_IN_MB}mb.`,
  LIMIT_PART_COUNT: "Too many parts.",
  LIMIT_FILE_COUNT: "Too many files.",
  LIMIT_FIELD_KEY: "Field name too long.",
  LIMIT_FIELD_VALUE: "Field value too long.",
  LIMIT_FIELD_COUNT: "Too many fields.",
  LIMIT_UNEXPECTED_FILE: "Unexpected field.",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, Config.PICTURES_DEST);
  },
  filename: (req, file, cb) => {
    const name = Crypto.randomUUID();
    const ext = ALLOWED_MIME_TYPES_EXT[file.mimetype] ?? "invalid";

    cb(null, `${name}.${ext}`);
  },
});

const uploader = multer({
  storage: storage,
  limits: {
    fileSize: ALLOWED_MAX_SIZE_IN_MB * 1e6,
  },
  fileFilter: (req, file, cb) => {
    if (!Object.keys(ALLOWED_MIME_TYPES_EXT).includes(file.mimetype)) {
      return cb(
        new UploadException({
          [file.fieldname]: [
            `Picture must one of the following format: ${Object.values(
              ALLOWED_MIME_TYPES_EXT
            ).join(", ")}.`,
          ],
        })
      );
    }

    return cb(null, true);
  },
});

// Function --------------------------------------------------------------------
const single: UploadService["single"] = (field_name) => {
  const upload = uploader.single(field_name);

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (!err) {
        return next();
      }

      if (err instanceof multer.MulterError) {
        return next(
          new UploadException({
            [err.field ?? "unknown"]: [MULTER_ERROR_CODE_DESCRIPTION[err.code]],
          })
        );
      }

      next(err);
    });
  };
};

// Service ---------------------------------------------------------------------
export const service: UploadService = {
  single,
};
