import { createStore, StoreEnhancer } from 'redux';
import { rootReducer } from './reducers';


declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: () => undefined;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: (arg: StoreEnhancer) => undefined;
  }
}

// const sagaMiddleware = createSagaMiddleware();
// export const history = createBrowserHistory();

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  // composeEnhancers(applyMiddleware(sagaMiddleware)),
);

// sagaMiddleware.run(initSaga);

export default store;