import { RequestHandler } from "express";

// Type ------------------------------------------------------------------------
export interface UploadService {
  single: (field_name: string) => RequestHandler;
}
