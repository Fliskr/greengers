import { createStore,applyMiddleware } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import rootReducer from './reducers/index';

const loggerMiddleware=createLogger();

const store = createStore(
	rootReducer,
	applyMiddleware(
		thunk,
		loggerMiddleware
	)
	);

export const history = syncHistoryWithStore(browserHistory, store);

if (module.hot) {
  module.hot.accept('./reducers/', () => {
    const nextRootReducer = require('./reducers/index').default;
    store.replaceReducer(nextRootReducer);
  })
}

export default store;;
