import { Exception } from "@/core/exception";

// Type ------------------------------------------------------------------------
export type Cause =
  | "Query:ConstraintsViolation:Unique"
  | "Query:ConstraintsViolation:ForeignKey"
  | "Query:ConstraintsViolation:Restrict"
  | "Pool:Initialization"
  | "Unknown";

type Data = {
  cause: Cause;
  message: string;
  details?: {
    column: string;
  };
};

// Class ------------------------------------------------------------------------
export class DatabaseException extends Exception<Data> {
  constructor(data: Data) {
    super(data);
  }
}
