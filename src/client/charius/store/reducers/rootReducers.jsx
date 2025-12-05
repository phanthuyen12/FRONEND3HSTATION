import {combineReducers} from 'redux'
import productReducer from "./products.jsx";
import {cartReducer} from "./cart.jsx";
import {wishListReducer} from "./wishList.jsx";
import compareListReducer from "./compare.jsx";


const rootReducer = combineReducers({
    data: productReducer,
    cartList: cartReducer,
    wishList: wishListReducer,
    compareList: compareListReducer
});

export default rootReducer;