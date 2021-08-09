
import { BRANCHES, OPTIONS, ALLUSERS, RATINGS, VIOLATION } from "@constants";
import * as firebase from './firebase';
export const getBranches = () => dispatch => {
    firebase.onBranch(res => {
        if (!res) return dispatch({ type: BRANCHES, data: [] })
        let branches = Object.entries(res).map((item) => {
            return { key: item[0], name: item[1].Name }
        });

        dispatch({ type: BRANCHES, data: branches })
    });
}
export const getOptions = () => dispatch => {
    firebase.onOptions(res => {
        if (!res) return dispatch({ type: OPTIONS, data: [] })
        let options = Object.entries(res).map((item) => {
            return { key: item[0], name: item[1].Name }
        });

        dispatch({ type: OPTIONS, data: options })
    });
}
export const getUsers = () => dispatch => {
    firebase.onUsers(res => {
        if (!res) return dispatch({ type: ALLUSERS, data: [] })
        let users = Object.entries(res).map((item) => {
            return { key: item[0], name: item[1].Name }
        });
        dispatch({ type: ALLUSERS, data: users })
    });

}
export const getRatings = () => dispatch => {
    firebase.onRatings(res => {
        if (!res) return dispatch({ type: RATINGS, data: [] });
        let ratings = Object.entries(res).map((item, index) => {
            return { key: item[0], ...item[1], }
        });
        dispatch({ type: RATINGS, data: ratings })
    });
}
export const getViolation = () => async dispatch => {
    firebase.onViolation(res => {
        if (!res) return dispatch({ type: VIOLATION, data: [] });
        let violation = Object.entries(res).map((item, index) => {
            return { key: item[0], ...item[1] }
        });
        dispatch({ type: VIOLATION, data: violation })
    });
}