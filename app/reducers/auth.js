
import { LOGIN_SUCCESS } from "@constants";
const initialState = {
    user: {},
};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return { ...state, user: action.data };
        default:
            return state;
    }
};
