/// <reference types="react-scripts" />
type Levels = {
    id: number;
    elements: (string | number)[];
    level: number;
    parent: number;
    isLeaf: boolean;
    parentElement: number;
    side: 'left' | 'right';
}[][][]