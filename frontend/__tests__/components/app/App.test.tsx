import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import App from '@App/components/app/App';
import { Provider } from 'react-redux';
import store from '@App/store';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store as any}>
			<Router >
				<Route path="/{123123}" component={App}>
				</Route>
			</Router>
    </Provider>
    , div);
});

