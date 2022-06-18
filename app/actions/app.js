
import {
    LOGIN_SUCCESS,
    FACILITIES, QUESTIONS
} from "@constants";
import { BaseConfig } from "@config";
import { store } from "@store";

export const _TOKEN = () => {
    try {
        const token = store?.getState()?.auth?.token;
        if (token) {
            return { 'Authorization': `Bearer ${token}` };
        }
    } catch (error) {
        console.log("token error", error)
    };
    return {};
}
export const _USERID = () => {
    try {
        const userid = store?.getState()?.auth?.user.id;
        console.log(userid);
        return `${userid}1`;
    } catch (error) {
        console.log("token error", error)
    };
    return 0;
}

const _REQUEST2SERVER = (url, method = "get", params = null, isFormdata = false) => {
    return new Promise(function (resolve, reject) {
        fetch(`${BaseConfig.SERVER_HOST}/api/${url}`, {
            method: method?.toUpperCase?.() || "GET",
            headers: {
                'content-type': isFormdata ? 'multipart/form-data' : 'application/json',
                ..._TOKEN()
            },
            body: isFormdata ? params : params ? JSON.stringify(params) : ''
        })
            .then(res => res.json())
            .then(res => resolve(res))
            .catch(err => {
                console.log("Request error: ", JSON.stringify({ url, method, params, isFormdata, err }));
                reject(err);
            });
    });
}
const loginSuccess = (user, dispatch) => {
    dispatch({ type: LOGIN_SUCCESS, data: user })
}
export const logoutAction = () => dispatch => {
    dispatch({ type: LOGIN_SUCCESS, data: {} })
}

export const login = (email, password, callback) => dispatch => {
    _REQUEST2SERVER('login', 'POST', { email, password })
        .then(res => {
            if (res.success) {
                loginSuccess({ ...res.data.user, token: res.data.token }, dispatch);
            } else {
                dispatch({ type: LOGIN_SUCCESS, data: {} })
            }
            callback(res)
        })
        .catch(err => {
            dispatch({ type: LOGIN_SUCCESS, data: {} })
        })
}
export const register = (email, password, name, phonenumber, role, callback) => dispatch => {
    _REQUEST2SERVER('register', 'POST', { email, password, name, phonenumber, role })
        .then(callback)
        .catch(callback)
}

export const getFacility = () => dispatch => {
    const userid = _USERID();
    _REQUEST2SERVER(`facilities?userid=${userid}`)
        .then(res => {
            if (res.success) {
                dispatch({ type: FACILITIES, data: res.data })
            } else {
                dispatch({ type: FACILITIES, data: [] })
            }
        })
        .catch(err => {
            dispatch({ type: FACILITIES, data: [] })
        })
}
export const getQuestions = () => dispatch => {
    const userid = _USERID();
    _REQUEST2SERVER(`questions?userid=${userid}`)
        .then(res => {
            if (res.success) {
                dispatch({ type: QUESTIONS, data: res.data })
            } else {
                dispatch({ type: QUESTIONS, data: [] })
            }
        })
        .catch(err => {
            dispatch({ type: QUESTIONS, data: [] })
        })
}
export const addRating = (workerid, facilityid, location, ratings, callback) => dispatch => {
    _REQUEST2SERVER('addRating', "post", { workerid, facilityid, location, ratings })
        .then(res => callback(res))
        .catch(err => {
            console.log(err)
            callback({ success: false, message: "Something went wrong" })
        })
}
export const uploadImages = (images, type, callback) => async dispatch => {
    var results = await (Promise.all(
        images.map((item, index) => {
            const formdata = new FormData();
            formdata.append("file", item);
            formdata.append("type", type);
            return _REQUEST2SERVER("upload", 'post', formdata, true);
        })
    ))
    const result = results.map(item => item.success ? item.path : null).filter(item => item)
    return result
}