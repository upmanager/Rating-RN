
import { BRANCHES, CURBRANCH } from "@constants";
const initialState = {
    cur_branch: '',
};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case CURBRANCH:
            return { ...state, cur_branch: action.data };
        default:
            return state;
    }
};
