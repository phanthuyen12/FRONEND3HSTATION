import {
    RECEIVE_PRODUCTS
} from "../actions/type.jsx";


const initialState = {
    products: [],
    symbol: '$',
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_PRODUCTS:
            return {
                ...state,
                products: action.products
            };
        default:
            return state;
    }
};
export default productReducer;