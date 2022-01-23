import BTree from '../data-structures/BTree';
let tree = new BTree(5);

export type ITree = Levels;

type Initialize = {
    type: 'INITIALIZE',
    payload: string
}

type Insert = {
    type: 'INSERT',
    payload: string
}

type Erase = {
    type: 'ERASE',
    payload: string
}

type Undo = {
    type: 'UNDO'
}

type Redo = {
    type: 'REDO'
}


type TreeAction = Initialize | Insert | Erase | Undo | Redo;

const treeReducer = (state: ITree = [], action: TreeAction) => {

    switch (action.type) {
        case 'INITIALIZE': {
            if(!isNaN(Number(action.payload)))
                tree = new BTree(parseFloat(action.payload));
            return [];
        }
        case 'INSERT': {
            tree.insert(isNaN(Number(action.payload)) ? action.payload : parseFloat(action.payload));
            return tree.bfs();
        }
        case 'ERASE': {
            tree.erase(isNaN(Number(action.payload)) ? action.payload : parseFloat(action.payload));
            return tree.bfs();
        }
        case 'UNDO': {
            tree.undo();
            return tree.bfs();
        }
        case 'REDO': {
            tree.redo();
            return tree.bfs();
        }
        default:
            return state;
    }
};
export default treeReducer;