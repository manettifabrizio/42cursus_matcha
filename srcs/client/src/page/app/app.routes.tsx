import { RouteObject } from "react-router-dom";

// Route -----------------------------------------------------------------------
export const appRoutes: RouteObject[] = [
  {
    path: "/",
    lazy: () => import("./home"),
  },
];
