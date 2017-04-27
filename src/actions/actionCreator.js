import { request } from '../utils/request';
export function setErrorText(text, timeout = 3000) {
    return (dispatch) => {
        dispatch({ type: "ERROR_TEXT", text });
        setTimeout(() => dispatch({ type: "ERROR_TEXT", text: "" }), timeout);
    }
}

export function getConfirmModal(confirm) {
    return { type: "GET_CONFIRM_OPTIONS", confirm };
}

export function loginFn(token, login) {
    return { type: "AUTH", token, login }
}

export function getOrders(orders) {
    return { type: "ORDERS", orders }
}

export function setUserData(user) {
    return { type: "USER", user }
}

export function getCurrentUser() {
    return async function(dispatch) {
        try {
            await request('api/users/current', {}, 'json').then(j => {
                    return dispatch(setUserData(j || { name: "", roles: [], permissions: [] }))
                })
                .catch(j => dispatch(setUserData({ name: "", roles: [], permissions: [] })))
        } catch (e) {
            console.log(e);
        }
    }
}

export function getTags(tags) {
    return { type: "GET_TAGS", tags }
}
export function getAvailableTags(tags) {
    return { type: "GET_AVAILABLE_TAGS", tags }
}
export function getTagsAsync() {
    return function(dispatch) {
        request('api/tags', {}, 'json').then(j => dispatch(getTags(j || [])));
        request('api/tags/available', {}, 'json').then(j => dispatch(getAvailableTags(j || [])));
    }
}


export function getUsersAsync() {
    return function(dispatch) {
        request(`api/users`, {}, 'json')
            .then(j => dispatch({ type: "GET_USERS", users: j || [] }))
    }
}

export function setMapCenter(position) {
    return {
        type: "SET_MAP_CENTER",
        position: position && position[0] && position
    }
}

export function handleLogin(login, password) {
    return function(dispatch) {

        return request(`api/authentication/${login===false?"invalidate":"authenticate"}`, {

                method: "POST",
                body: JSON.stringify({ login, password })
            }, 'json')
            .then(token => {
                if (token.error) {
                    throw new Error(token.message);
                }
                localStorage.token = token || "";
                localStorage.login = login || "";
                dispatch(loginFn(token, login));
                return token
            }).catch(err => {
                dispatch(loginFn(false, ""));
                delete localStorage.login;
                delete localStorage.token;
                return err
            });
    }
}

export function getGeoZones(zones) {
    return {
        type: "REQUEST_ZONES",
        zones
    }
}

export function getSettings(settings) {
    return {
        type: "REQUEST_SETTINGS",
        settings
    }
}

function  getDeepestChilds(zone){
    return [zone,...zone.childs.map(child=>getDeepestChilds(child))]
  }

export function getGeoZonesAsync() {
    return function(dispatch) {
        dispatch(getGeoZones([]))
        request('api/zones', {}, "json").then(zones => {
            if (zones) {
                let data = zones
                    .map(data => {
                        return [...getDeepestChilds(data)]
                    }, [])
                    .reduce((pr, cu) => {
                        return pr.concat(...cu);
                    }, [])
                    .sort((a, b) => a.lvl - b.lvl);
                return dispatch(getGeoZones(data.map(zone => {
                    return {...zone, type: "Feature" }
                })));
            }
            return dispatch(getGeoZones([]))
        })
        request('api/maps/settings', {}, 'json').then(settings => dispatch(getSettings(settings || false)))
    }
}

export function mapAttributes(attr = []) {
    let attributes = {};
    attr.forEach((item) => {
        attributes[item.name] = attributes[item.name] || [];
        attributes[item.name] = [...attributes[item.name], item.value];
    })
    return {
        type: "REQUEST_ATTRIBUTES",
        attributes
    }
}

export function getAttributes(orderQuery = {}, checkIn = false) {

    return async function(dispatch) {
        if (localStorage.token && localStorage.login) {

            await request('api/orders/query', { method: "POST", body: JSON.stringify(orderQuery) }, 'json').then(orders => dispatch(getOrders(
                orders || [])))
            if (checkIn) {
                request('api/tags', {}, 'json').then(j => dispatch(getTags(j || [])))
                request('api/attributes', {}, 'json').then(j => { dispatch(mapAttributes(j || [])) })
            }
        }

    }
}
export function getCheckinOrders() {
    const query = {
        "properties": [{
            "name": "status",
            "op": "eq",
            "value": "New"
        }]
    };
    return getAttributes(query, true);
}

export function getCheckoutOrders() {
    const query = {
        "properties": [{
            "name": "status",
            "op": "eq",
            "value": "Ready"
        }]
    };
    return getAttributes(query);
}

export function getInspectedOrders() {
    const query = {
        "properties": [{
            "name": "status",
            "op": "eq",
            "value": "Checked In"
        }]
    };
    return getAttributes(query);
}

export function getDispatchedOrders() {
    const query = {
        "properties": [{
            "name": "status",
            "op": "eq",
            "value": "Inspected"
        }]
    };
    return getAttributes(query);
}

export function changeLocale(locale) {
    localStorage.locale = locale || "sp";
    return { type: "CHANGE_LOCALE", locale }
}
