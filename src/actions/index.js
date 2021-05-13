export const insert = (element) => {
    return {
        type: "INSERT",
        payload: element
    };
};

export const erase = (element) => {
    return {
        type: "ERASE",
        payload: element
    };
};

export const initialize = (degree) => {
    return {
        type: "INITIALIZE",
        payload: degree
    };
};

export const undo = () => {
    return {
        type: "UNDO"
    };
};

export const redo = () => {
    return {
        type: "REDO"
    };
};

export const change = (index) => {
    return {
        type: "CHANGE",
        payload: index
    };
};