import BNode from './BNode';

class Element<T = number | string> {

    public value: T;
    public leftChild: BNode<T> | null;
    public rightChild: BNode<T> | null;

    constructor(value: T, leftChild: BNode<T> | null = null, rightChild: BNode<T> | null = null) {
        this.value = value;
        this.leftChild = leftChild;
        this.rightChild = rightChild;
    }

    hasRightChild(): boolean{
        return this.rightChild !== null;
    }

    hasLeftChild(): boolean{
        return this.leftChild !== null;
    }
}

export default Element;
