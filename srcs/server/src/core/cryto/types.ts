// Type ------------------------------------------------------------------------
export interface CryptoService {
  hashPassword: (password: string) => Promise<string>;
  verifyPassword: (password: string, hash: string) => Promise<boolean>;
  generateSecret: (size?: number) => Promise<string>;
}
