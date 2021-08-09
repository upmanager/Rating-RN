
import { BRANCHES, OPTIONS, ALLUSERS, RATINGS, VIOLATION } from "@constants";
const initialState = {
    branches: [],
    options: [],
    users: [],
    ratings: [],
    violations: []
};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case BRANCHES:
            return { ...state, branches: action.data };
        case OPTIONS:
            return { ...state, options: action.data };
        case ALLUSERS:
            return { ...state, users: action.data };
        case RATINGS:
            return { ...state, ratings: action.data };
        case VIOLATION:
            return { ...state, violations: action.data };
        default:
            return state;
    }
};
