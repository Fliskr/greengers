import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import * as reducers from './App';

const rootReducer = combineReducers({ routing: routerReducer ,...reducers})

export default rootReducer;
