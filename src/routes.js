import App from './components/App';
import Main from './components/Main';

const routes = {
    path: '/',
    component: App,
    indexRoute: { component: Main },
    childRoutes: [{
        path: 'main',
        component: Main
    },  ]
};


export default routes;
