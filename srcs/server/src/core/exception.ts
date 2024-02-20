import type { ValueOf } from "@/core/typing";

// Type ------------------------------------------------------------------------
const HTTP_ERROR = {
  "Not Found": 404,
  Unauthorized: 401,
  Forbidden: 403,
  "Unprocessable Entity": 422,
  "Failed Dependency": 424,
  "Internal Server Error": 500,
} as const;

type HttpData = {
  cause: string | string[];
  details?: Record<string, string[]>;
};

// Class -----------------------------------------------------------------------
export class Exception<T> extends Error {
  private _data: T;

  constructor(data: T) {
    super();
    this._data = data;
  }

  public get data() {
    return this._data;
  }
}

export class HttpException extends Exception<HttpData> {
  private _text: keyof typeof HTTP_ERROR;
  private _code: ValueOf<typeof HTTP_ERROR>;

  constructor(type: keyof typeof HTTP_ERROR, data: HttpData) {
    super(data);

    this._text = type;
    this._code = HTTP_ERROR[type];
  }

  public get type() {
    return this._text;
  }

  public get code() {
    return this._code;
  }
}
