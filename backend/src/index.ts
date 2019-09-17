import app from './application';

const port = process.env.PORT || 8000;

import { createPool } from "./db";

createPool().then(_pool => {
	app.listen(port, () => {
	  // tslint:disable-next-line:no-console
	  console.log(`Server started at http://localhost:${port}`);
	});
})

