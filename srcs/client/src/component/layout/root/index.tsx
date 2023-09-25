import { useState } from "react";
import { Outlet } from "react-router-dom";
import BootLoader from "@/component/boot-loader";

// Component -------------------------------------------------------------------
export default function RootLayout() {
  const [isBooting, setBooting] = useState(true);

  return isBooting ? <BootLoader setBooting={setBooting} /> : <Outlet />;
}
