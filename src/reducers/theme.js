const themeReducer = (state = 4, action) => {
    switch (action.type){
        case "CHANGE":
            return action.payload
        default:
            return state;
    }
};

export default themeReducer;