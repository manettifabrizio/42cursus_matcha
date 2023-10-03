import type { CryptoService } from "./types";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";

// Function ------------------------------------------------------------------------
const hashPassword: CryptoService["hashPassword"] = async (password) => {
  return await bcrypt.hash(password, 10);
};

const verifyPassword: CryptoService["verifyPassword"] = async (
  password,
  hash
) => {
  return await bcrypt.compare(password, hash);
};

const generateSecret: CryptoService["generateSecret"] = async (size = 32) => {
  return crypto.randomBytes(size).toString("base64url");
};

// Service ---------------------------------------------------------------------
export const service: CryptoService = {
  hashPassword,
  verifyPassword,
  generateSecret,
};
