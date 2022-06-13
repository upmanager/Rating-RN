
import { FACILITIES, QUESTIONS } from "@constants";
const initialState = {
    facilities: [],
    questions: []
};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case FACILITIES:
            return { ...state, facilities: action.data };
        case QUESTIONS:
            return { ...state, questions: action.data };

        default:
            return state;
    }
};
