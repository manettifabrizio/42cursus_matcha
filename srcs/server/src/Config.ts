import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

export const {
	// App
	SERVER_PORT: PORT = '3000',
	PUBLIC_PATH = path.join(path.dirname(__dirname), 'public'),

	// Frontend
	FRONTEND_HOST = 'localhost:4443',

	// Database
	DB_HOST = '',
	DB_PORT = '',
	POSTGRES_DB: DB_NAME = '',
	POSTGRES_USER: DB_USER = '',
	POSTGRES_PASSWORD: DB_PASS = '',

	// Socket
	SOCKET_URL = '',

	// Defined in the .env
	// Mailer
	MAILER_HOST = '',
	MAILER_PORT = '',
	MAILER_USER = '',
	MAILER_PASS = '',

	// Uploader
	PICTURES_DEST = path.join(PUBLIC_PATH, 'pictures'),

	// Csrf
	CSRF_LIFETIME = '86400',

	// Cookie
	COOKIE_SECRET = '',

	// Json Web Token
	JWT_ACCESS_SECRET = '',
	JWT_ACCESS_LIFETIME = '600',
	JWT_REFRESH_SECRET = '',
	JWT_REFRESH_LIFETIME = '86400',
} = process.env;
