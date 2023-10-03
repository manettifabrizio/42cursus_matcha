import { Exception } from "@/core/exception";

// Type ------------------------------------------------------------------------
export type Cause = "ExpiredJwt" | "NotBeforeJwt" | "InvalidJwt";

type Data = {
  cause: Cause;
};

// Class -----------------------------------------------------------------------
export class JwtException extends Exception<Data> {
  constructor(data: Data) {
    super(data);
  }
}
