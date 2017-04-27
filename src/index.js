import React from 'react';
import {render} from 'react-dom';
// import 'react-bootstrap';
// import './css/bootstrap.min.css';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import store, { history } from './store.js';
import routes from './routes';
import './css/normalize.css';
import './fonts/fonts.css';
import './css/index.css';
import 'react-treeview/react-treeview.css';
import 'react-table/react-table.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

render(
  <Provider store={store} >
	<Router routes={routes} onUpdate={() => window.scrollTo(0, 0)} history={history} />
  </Provider>,
  document.getElementById('root')
);