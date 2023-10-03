import { Router } from "express";
import { route as Csrf } from "./route/csrf";

// Controller ------------------------------------------------------------------
export const controller = Router();

controller.get("/csrf", Csrf);
