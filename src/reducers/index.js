import {combineReducers} from "redux";
import treeReducer from "./tree";
import themeReducer from "./theme";

const allReducers = combineReducers({
    tree : treeReducer,
    theme : themeReducer
});

export default allReducers;