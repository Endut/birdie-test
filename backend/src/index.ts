import app from './application';

const port = process.env.PORT || 8000;

import { createConnection } from "./db";

createConnection().then(_ => {	
	app.listen(port, () => {
	  // tslint:disable-next-line:no-console
	  console.log(`Server started at http://localhost:${port}`);
	});
})

