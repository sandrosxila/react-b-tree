export const insert = (element: string) => {
    return {
        type: 'INSERT',
        payload: element
    };
};

export const erase = (element: string) => {
    return {
        type: 'ERASE',
        payload: element
    };
};

export const initialize = (degree: string) => {
    return {
        type: 'INITIALIZE',
        payload: degree
    };
};

export const undo = () => {
    return {
        type: 'UNDO'
    };
};

export const redo = () => {
    return {
        type: 'REDO'
    };
};

export const change = (index: number) => {
    return {
        type: 'CHANGE',
        payload: index
    };
};