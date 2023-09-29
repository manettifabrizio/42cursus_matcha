import * as Crypto       from 'node:crypto';
import multer            from 'multer';
import * as Config       from '@/Config';
import { UploadService } from './types';

// Variable --------------------------------------------------------------------
const ALLOWED_MIME_TYPES_EXT: Record<string, string> =
{
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/gif': 'gif',
};
const ALLOWED_MAX_SIZE_IN_BYTES = 2e9;

const storage = multer.diskStorage(
{
	destination: (req, file, cb) =>
	{
		cb(null, Config.PICTURES_DEST);
	},
	filename: (req, file, cb) =>
	{
		const name = Crypto.randomUUID();
		const ext = ALLOWED_MIME_TYPES_EXT[file.mimetype] ?? 'invalid';

		cb(null, `${name}.${ext}`);
	},
});

const uploader = multer(
{
	storage: storage,
	limits:
	{
		fileSize: ALLOWED_MAX_SIZE_IN_BYTES,
	},
	fileFilter: (req, file, cb) =>
	{
		if (!Object.keys(ALLOWED_MIME_TYPES_EXT).includes(file.mimetype))
		{
			return cb(new Error(`Invalid image format.`));
		}

		return cb(null, true);
	}
});

// Service ---------------------------------------------------------------------
export const service: UploadService =
{
	single: uploader.single,
};
