import { createStore, StoreEnhancer, applyMiddleware, compose } from 'redux';
import { rootReducer } from './reducers';
import createSagaMiddleware from 'redux-saga'

import rootSaga from './sagas';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: () => undefined;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: (arg: StoreEnhancer) => undefined;
  }
}

const sagaMiddleware = createSagaMiddleware();
// export const history = createBrowserHistory();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
  // composeEnhancers(applyMiddleware(sagaMiddleware)),
);

sagaMiddleware.run(rootSaga);

export default store;