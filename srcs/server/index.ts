require('module-alias/register');
require('express-async-errors');

import * as http    from 'http';
import express      from 'express';
import { Express }  from 'express';

// Application -----------------------------------------------------------------
const app: Express = express();
const server: http.Server = http.createServer(app);

// Routes ----------------------------------------------------------------------
import { home } from '@/home';
import { error } from '@/error';

app.use('/', home);
app.use(error);

server.listen(3000, () => {
  console.log(`[Server] Listening on port ${3000}.`);
});
