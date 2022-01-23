export type ITheme = number;

type Change = {
    type: 'CHANGE',
    payload: number
}

type ThemeAction = Change;

const themeReducer = (state: ITheme = 4, action: ThemeAction) => {
    switch (action.type){
        case 'CHANGE':
            return action.payload;
        default:
            return state;
    }
};

export default themeReducer;