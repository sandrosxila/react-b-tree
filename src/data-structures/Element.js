class Element {
    constructor(value, leftChild = null, rightChild = null) {
        this.value = value;
        this.leftChild = leftChild;
        this.rightChild = rightChild;
    }

    hasRightChild(){
        return this.rightChild !== null;
    }

    hasLeftChild(){
        return this.leftChild !== null;
    }
}

export default Element;
