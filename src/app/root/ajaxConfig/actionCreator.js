import {
    REQUEST_ABORT_ALL,
    REQUEST_ADD,
    REQUEST_REMOVE
} from "../actionTypes/actionTypes.js";

export const addRequest = ({ request, method }) => {
    return {
        type: REQUEST_ADD,
        payload: { request, method }
    }
}

export const removeRequest = ({ request, method }) => {
    return {
        type: REQUEST_REMOVE,
        payload: { request, method }
    }
}

export const abortAllRequest = (request) => {
    return {
        type: REQUEST_ABORT_ALL
    }
}
