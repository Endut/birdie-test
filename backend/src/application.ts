import * as express from "express";

import router from "./api";

const app = express();

app.use('/api/v1', router);

export default app;
