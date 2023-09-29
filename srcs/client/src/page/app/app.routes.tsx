import ProtectedLayout from "@/component/layout/protected";
import { RouteObject } from "react-router-dom";

// Route -----------------------------------------------------------------------
export const appRoutes: RouteObject[] = [
  {
    path: "/",
    lazy: () => import("./landing_page"),
  },
  {
    element: <ProtectedLayout accepted="AUTHENTICATED" />,
    children: [
      {
        path: "/home",
        lazy: () => import("./home"),
      },
    ],
  },
];
