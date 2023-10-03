// Type ------------------------------------------------------------------------
declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload;
    }
  }
}

export type JwtPayload = {
  id: number;
};

export interface JwtService {
  createToken: (
    payload: JwtPayload,
    secret: string,
    lifetime_in_sec: number
  ) => string;
  verifyToken: (token: string, secret: string) => JwtPayload;
}
