require("module-alias/register");

import * as Config from "@/Config";
import { server } from "@/App";

server.listen(Config.PORT, () => {
  console.log(`[Server] Listening on port ${Config.PORT}.`);
});
