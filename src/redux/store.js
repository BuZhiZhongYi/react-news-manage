import { createStore, combineReducers } from "redux";
import { CollapsedReducer } from "./reducer/CollapsedReducer";
import { LoadingReducer } from "./reducer/LoadingReducer"

const reducer = combineReducers({
    CollapsedReducer,
    LoadingReducer
})

const store = createStore(reducer)

export default store