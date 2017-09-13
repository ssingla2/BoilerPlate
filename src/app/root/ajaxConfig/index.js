import * as ajaxStoreActions from "./actionCreator.js";
import * as  rootActions from "../actionCreators.js";
// import { appOnline, appOffline } from "../actionCreators.js";
import pendingRequestManager from "./pendingRequestManager.js";
import { SHOW_TOAST, FETCH_FAILURE, /*SET_CUSTOM_LOGIN_TITLE*/ } from "./../actionTypes/actionTypes.js";
// import { USER_LOGGEDOUT } from "../../loginFlow/actionTypes.js";
// import loginFlowActions from "../../loginFlow/actionCreator.js";
import { authDependentApiRegexp } from "../../config.js";

let { page, Redux, batchActions } = window.interfaces;
let { bindActionCreators } = Redux;
let authId;
let route = "";
let pendingReqMgr = null;
let bindedActions, bindedRootActions, bindedLoginActions;
let routeObj = {};

/*let forcedLogout = ({ dispatch, customLoginTitle }) => {
    window.forcedLogoutCount = (window.forcedLogoutCount) ? (window.forcedLogoutCount + 1) : 1;
    dispatch({
        type: USER_LOGGEDOUT
    });
    // if (customLoginTitle) {
    //     dispatch({
    //         type: SET_CUSTOM_LOGIN_TITLE,
    //         payload: {
    //             customLoginTitle: customLoginTitle // will be unset after login
    //         }
    //     });
    // }
    // page("/mnj/logout?errorMsg=Please login to proceed");
};*/

let isApiAuthDependent = (url) => {
    var matches = url.match(authDependentApiRegexp);
    return (matches && matches.length) ? true : false;
}

// const refreshAccessTokens = ({ params, dispatch, resolve, reject, failedXhr, resolveType }) => {
//     return $.ajax({
//             url: config.loginUrl,
//             method: "GET"
//         })
//         .then((data) => {
//             if (data && data.access_token) { // successfully refreshed

//                 $.ajax(params).then((data, textStatus, jqXHR) => { //success of prev ajax
//                     // resolve(data, textStatus, jqXHR);
//                     (resolveType === 'obj') ? resolve({ data, textStatus, jqXHR }): resolve(data, textStatus, jqXHR);
//                 }, (jqXHR, textStatus, errorThrown) => { // failure of prev ajax
//                     // reject(jqXHR, textStatus, errorThrown);
//                     (resolveType === 'obj') ? reject({ jqXHR, textStatus, errorThrown }): reject(jqXHR, textStatus, errorThrown);
//                 });

//             } else { // failed
//                 // if (isApiAuthDependent(params.url)) {
//                 //     forcedLogout({ dispatch });
//                 // } else {
//                     (resolveType === 'obj') ? reject({ failedXhr }): reject(failedXhr);
//                 // }
//             }

//         }, (d) => { // failed
//             if (isApiAuthDependent(params.url)) {
//                 forcedLogout({ dispatch });
//             } else {
//                 (resolveType === 'obj') ? reject({ failedXhr }): reject(failedXhr);
//             }
//         });
// };

const reLoginCallback = ({ reAttemptOnReLogin, params, dispatch, resolve, reject, path, resolveType }) => {

    // After reLogin, always redirect to last path
    // But reAttempt only if required

    path = (path.indexOf('/mnj/login') >= 0) ? '/mnj/dashboard' : path;
    page.redirect(path);

    if (reAttemptOnReLogin) {
        $.ajax(params).then((data, textStatus, jqXHR) => { //success of prev ajax
            (resolveType === 'obj') ? resolve({ data, textStatus, jqXHR }): resolve(data, textStatus, jqXHR);
        }, (jqXHR, textStatus, errorThrown) => { // failure of prev ajax
            (resolveType === 'obj') ? reject({ jqXHR, textStatus, errorThrown }): reject(jqXHR, textStatus, errorThrown);
        });
    }
};

const errorHandler = (jqXHR, textStatus, errorThrown, dispatch) => {
    console.log(jqXHR, textStatus, errorThrown)
    if (jqXHR.status == 0) {
        //Move in pending request manager
        /*dispatch(appOffline());*/
    } else if (jqXHR.status == 500) {
        dispatch({
            type: SHOW_TOAST,
            payload: {
                message: "Oops! something went wrong",
                type: "error"
            }
        });
    } else if ( /*jqXHR.status == 0 || */ textStatus == "timeout") {
        dispatch({
            type: SHOW_TOAST,
            payload: {
                message: "Please check your internet connection and refresh",
                type: "error"
            }
        });
    } else {
        if (process.env.NODE_ENV == "dev") {
            let errObj = jqXHR.responseJSON && jqXHR.responseJSON.error;
            let errDetails = errObj && errObj.validationErrorDetails && errObj.validationErrorDetails[0];
            let msg = errDetails && errDetails['qm,qx'] && ', ' + errDetails['qm,qx'].message || ''
            dispatch({
                type: SHOW_TOAST,
                payload: {
                    message: jqXHR.statusText + msg,
                    type: "error"
                }
            });
        }
    }
    dispatch({
        type: FETCH_FAILURE
    });
}

const successHandler = ({ data, textStatus, jqXHR, url, dispatch }) => {
    let actionList = [];
    //Moved it to pending request manager
    /*actionList.push(appOnline());*/
    if (data) {
        //Specifically for JD
        let seo = data.seo || (data.job && data.job.seo) /*|| { htmlTags: { name: "abcd" } }*/ ;
        if (seo) {
            let metaTags = seo.htmlTags;
            //bindedRootActions.addMetaTags(metaTags);
            //actionList.push(rootActions.addMetaTags(metaTags));
        }
    }
    dispatch(batchActions(actionList));
}

const overrideAjax = (dispatch) => {
    let orignalAJax = $.ajax;

    //Override orignal AJAX
    $.ajax = (params) => {
        let promise = new Promise((resolve, reject) => {
            params.method = params.method ? params.method : "GET";
            orignalAJax(params).then((data, textStatus, jqXHR) => {
                if (data && data.error) {
                    let modifiedjqXHR = {...jqXHR, status: data.error.status };
                    reject(modifiedjqXHR);
                } else {
                    resolve(data, textStatus, jqXHR, params.method);
                }
            }, (jqXHR, textStatus, errorThrown) => {
                if (jqXHR.status == 401 && isApiAuthDependent(params.url)) {

                    var path = window.location.pathname;
                    var customLoginTitle = params.customLoginTitle || '';
                    // if (params.reAttemptOnReLogin) {}
                    bindedLoginActions.loginCallbacksSet({
                        success: () => {
                            reLoginCallback({ reAttemptOnReLogin: params.reAttemptOnReLogin, params, dispatch, resolve, reject, path, resolveType: '' });
                        }
                    });
                    //forcedLogout({ dispatch, customLoginTitle });
                } else if (jqXHR.status == 403) {
                   // refreshAccessTokens({ params, dispatch, resolve, reject, failedXhr: jqXHR, resolveType: '' }); // dont reject, and try to re-authenticate and resend this ajax
                } else if (jqXHR.status == 201) {
                    //Custom handling for save job api in old codebase
                    resolve("", textStatus, jqXHR, params.method);
                } else {
                    reject(jqXHR, textStatus, errorThrown, params.method);
                }

            });
        });
        promise.then((data, textStatus, jqXHR) => {
            successHandler({
                data,
                textStatus,
                jqXHR,
                url: params.url,
                dispatch
            })
        }, (jqXHR, textStatus, errorThrown) => {
            errorHandler(jqXHR, textStatus, errorThrown, dispatch);
        })
        return promise;
    };

    $.ajaxPromise = (params) => {
        let promise = new Promise((resolve, reject) => {
            orignalAJax(params).then((data, textStatus, jqXHR) => {
                if (data && data.error) {
                    let modifiedjqXHR = {...jqXHR, status: data.error.status };
                    reject(modifiedjqXHR);
                } else {
                    resolve({ data, textStatus, jqXHR });
                }
            }, (jqXHR, textStatus, errorThrown) => {
                if (jqXHR.status == 401 && isApiAuthDependent(params.url)) {
                    var path = window.location.pathname;
                    var customLoginTitle = params.customLoginTitle || '';
                    bindedLoginActions.loginCallbacksSet({
                        success: () => {
                            reLoginCallback({ reAttemptOnReLogin: params.reAttemptOnReLogin, params, dispatch, resolve, reject, path, resolveType: 'obj' });
                        }
                    });
                    //forcedLogout({ dispatch, customLoginTitle });
                }
                if (jqXHR.status == 403) {
                   // refreshAccessTokens({ params, dispatch, resolve, reject, failedXhr: jqXHR, resolveType: 'obj' }); // dont reject, and try to re-authenticate and resend this ajax
                } else if (jqXHR.status == 201) {
                    //Custom handling for save job api in old codebase
                    resolve({ data: "", textStatus, jqXHR });
                } else {
                    reject({ jqXHR, textStatus, errorThrown });
                }

            });
        });
        promise.then(({ data, textStatus, jqXHR }) => {
            successHandler({
                data,
                textStatus,
                jqXHR,
                url: params.url,
                dispatch
            });
        }, ({ jqXHR, textStatus, errorThrown }) => {
            errorHandler(jqXHR, textStatus, errorThrown, dispatch);
        });
        return promise;
    };

}


const addAjaxPrefilters = () => {
    $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
        //options.timeout = 10000;
        //options.dataType = "json";
        //Handlign DELETE request
        if (options.method == "DELETE") {
            options.method = "POST";
            options.type = "POST";
            options.headers = {...options.headers, "X-HTTP-Method-Override": "DELETE" }
        }

        // Setting tracking header for all except ncuploader apis

        // Other exceptions can be added here too
        if (!options.url.match(/(\/saveFile.php|\/saveUrlFile.php|\/nLogger\/)/gi)) {
            options.headers = {...options.headers, "clientId": "m0b5" }
        }

        //Add Authorization header if exist                                
        if (authId && process.env.NODE_ENV == "dev") {
            options.headers = {...options.headers,
                authorization: `NAUKRIAUTH id=${authId}`
            }
        }

        //Add Os header
        // if (!options.crossDomain) {
        //     options.headers = {...options.headers,
        //         "os": window.os.toLowerCase()
        //     };
        // }

        // if (authId && process.env.NODE_ENV != "dev") {
        //     options.headers = {...options.headers,
        //         'Access-Control-Allow-Credentials': true
        //     }
        // }
        if (options.abortOnRouteChange && !options.crossDomain) {
            //Log request with pendingReqMgr
            pendingReqMgr.add(jqXHR, options.method || "GET"); // if method is not available then we assume it is a kind of GET request
        }

    });
}

const addAjaxSetup = () => {
    $.ajaxSetup({
        abortOnRouteChange: true,
        timeout: 10000,
        dataType: "json",
        reAttemptOnReLogin: false,
        xhrFields: {
            withCredentials: true
        }
    });
}

export default (store) => {
    overrideAjax(store.dispatch);
    addAjaxSetup();
    addAjaxPrefilters();
    bindedRootActions = bindActionCreators({...rootActions,/* appOnline, appOffline*/ }, store.dispatch);
    bindedActions = bindActionCreators(ajaxStoreActions, store.dispatch);
    // bindedLoginActions = bindActionCreators(loginFlowActions, store.dispatch);
    pendingReqMgr = new pendingRequestManager(bindedActions, bindedRootActions,store.getState());

    store.subscribe(() => {
        let state = store.getState();
        routeObj = state.route;
        /*if (authId != state.userDetail.authId) {
            authId = state.userDetail.authId;
        }*/
        pendingReqMgr.onStoreUpdate(state, bindedRootActions);
    });


}
