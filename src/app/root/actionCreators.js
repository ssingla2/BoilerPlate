// let { batchActions } = window.interfaces;
// import routeSanitizer from "./routeConfig/routeSanitizer.js";

import {
    ROUTE_CHANGE,
    FETCH_REQUEST,
    FETCH_COMPLETE,
    FETCH_SUCCESS,
    FETCH_FAILURE,
    ROUTE_CHANGE_END
} from "./actionTypes/actionTypes.js";

export const routeChange = (routeDetail) => {
    // let sanitizer = routeSanitizer[routeDetail.routeName];
    let query = routeDetail.query;
    // if (sanitizer) {
    //     query = sanitizer.urlToStore(query);
    // }   
    return {
        type: ROUTE_CHANGE,
        route: {...routeDetail,
            query
        }
    }
}

export const routeChangeEnd = (path, routeName, actionName) => {
    return {
        type: ROUTE_CHANGE_END,
        route: {
            path,
            routeName,
            actionName
        }
    }
}

export const fetchRequest = (payload) => {
    return {
        type: FETCH_REQUEST,
        payload
    }
}

export const fetchComplete = (payload) => {
    return {
        type: FETCH_COMPLETE,
        payload
    }
}
export const fetchSuccess = (payload) => {
    return {
        type: FETCH_SUCCESS,
        payload
    }
}
export const fetchFailure = (payload) => {
    return {
        type: FETCH_FAILURE,
        payload
    }
}
