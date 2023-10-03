import { Exception } from "@/core/exception";

// Type ------------------------------------------------------------------------
type Data = {
  [field: string]: string[];
};

// Class -----------------------------------------------------------------------
export class ValidationException extends Exception<Data> {
  constructor(data: Data) {
    super(data);
  }
}
