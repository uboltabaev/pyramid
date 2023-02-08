import { createStore, combineReducers } from "redux"
import mainReducer from '../reducers/main_reducer'
import userReducer from "../reducers/user_reducer"

const reducers = combineReducers({
    main: mainReducer,
    user: userReducer
});

const store = createStore(reducers);

export default store;