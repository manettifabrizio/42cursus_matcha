import * as bcrypt from "bcrypt";
import * as crypto from "crypto";

import { CryptoService } from './types';


const hashPassword: CryptoService['hashPassword'] = async (password) =>
{
	return await bcrypt.hash(password, 10);
};

const verifyPassword: CryptoService['verifyPassword'] = async (password, hash) =>
{
	return await bcrypt.compare(password, hash);
};

const generateSecret: CryptoService['generateSecret'] = async (size = 32) =>
{
	return crypto.randomBytes(size).toString('base64url');
};

export const service: CryptoService =
{
	hashPassword,
	verifyPassword,
	generateSecret,
};
