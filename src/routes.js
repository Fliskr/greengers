import CheckIn from './components/Container/CheckIn';
import App from './components/App';
import Dispatch from './components/Container/Dispatch';
import CheckOut from './components/Container/CheckOut';
import Inspect from './components/Container/Inspect';
import Search from './components/Container/Search';
import Maps from './components/Container/Map';
import Devices from './components/Container/Devices';
import Users from './components/Container/Users';
import Roles from './components/Container/Roles';
import Assets from './components/Container/Assets';
import Departments from './components/Container/Departments';
import Categories from './components/Container/Categories';
import Settings from './components/Container/Settings';
import Main from './components/Main';

const routes = {
    path: '/',
    component: App,
    indexRoute: { component: Main },
    childRoutes: [{
        path: 'checkin',
        component: CheckIn
    }, {
        path: 'inspect',
        component: Inspect
    }, {
        path: 'dispatch',
        component: Dispatch
    }, {
        path: 'checkout',
        component: CheckOut
    }, {
        path: 'search',
        component: Search
    }, {
        path: 'map',
        component: Maps
    }, {
        path: 'devices',
        component: Devices
    }, {
        path: 'users',
        component: Users
    }, {
        path: 'roles',
        component: Roles
    }, {
        path: 'assets',
        component: Assets
    }, {
        path: 'departments',
        component: Departments
    }, {
        path: 'categories',
        component: Categories
    }, {
        path: 'settings',
        component: Settings
    }, ]
};


export default routes;
