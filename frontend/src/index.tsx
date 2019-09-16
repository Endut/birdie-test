import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import { Provider } from 'react-redux';
import store from '@App/store';
import './index.css';
import App from '@App/components/app/App';
import registerServiceWorker from './serviceWorker';

ReactDOM.render(
	<Provider store={store as any}>
		<Router >
			<Route
				path="/:care_recipient_id"
				component={App}
				>
			</Route>
		</Router>
	</Provider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
registerServiceWorker()
