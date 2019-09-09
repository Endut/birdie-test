import * as express from 'express';
import router from './routes';
import { FRONTEND_DOMAIN } from './config';

const app = express();

if (process.env.NODE_ENV === 'development') {
	const cors = require('cors');
  app.use('/api/v1', cors({ origin: FRONTEND_DOMAIN }));
}

app.use('/api/v1', router);

export default app;
