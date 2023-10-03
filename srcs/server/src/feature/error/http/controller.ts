import { Router } from "express";
import { route as NotFound } from "./route/not-found";

// Controller ------------------------------------------------------------------
export const controller = Router();

controller.all("*", NotFound);
