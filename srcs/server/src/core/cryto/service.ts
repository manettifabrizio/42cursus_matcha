import * as bcrypt from "bcrypt";
import * as crypto from "crypto";

import { CryptoService } from './types';


const hashPassword = async (
	password: string
)
	: Promise<string> =>
{
	return bcrypt.hash(password, 10);
};

const verifyPassword = async (
	password: string,
	hash: string,
)
	: Promise<boolean> =>
{
	return bcrypt.compare(password, hash);
};

const generateSecret = async (
	size: number = 32,
)
	: Promise<string> =>
{
	return crypto.randomBytes(size).toString('base64url');
};

export const service: CryptoService =
{
	hashPassword,
	verifyPassword,
	generateSecret,
};
