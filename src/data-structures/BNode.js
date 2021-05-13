class BNode {
    constructor() {
        this.isLeaf = true;
        this.parent = null;
        this.elements = [];
    }
//    check if the elements are empty
    empty() {
        return this.elements.length === 0;
    }

//    get quantity of bNode elements
    size() {
        return this.elements.length;
    }

//    get element at index
    at(index) {
        if (this.empty())
            return null;
        return this.elements[index];
    }

//    get the first element
    first() {
        return this.at(0);
    }

//    get the last element
    last() {
        return this.at(this.size() - 1);
    }

//    check if bNode has a parent
    hasParent() {
        return this.parent !== null;
    }

//    check if the first element of bNode has a left child
    hasLeftmostChild() {
        if (this.first() === null)
            return false;
        return this.first().hasLeftChild();
    }

//    check if the last element of bNode has a right child
    hasRightmostChild() {
        if (this.last() == null)
            return false;
        return this.last().hasRightChild();
    }

//    get value of the first element
    firstValue() {
        return this.first().value;
    }

//    get left child of the first element
    firstLeftChild() {
        return this.first().leftChild;
    }

//    get right child of the first element
    firstRightChild() {
        return this.first().rightChild;
    }

//    get value of the last element
    lastValue() {
        return this.last().value;
    }

//    get value of the element at index
    valueAt(index) {
        return this.at(index).value;
    }

//    get a left child of the element at index
    leftChildAt(index) {
        return this.at(index).leftChild;
    }

//    get a right child of the element at index
    rightChildAt(index) {
        return this.at(index).rightChild;
    }

//    check if element at index has a left child
    hasLeftChildAt(index) {
        if (index > this.size() || index < 0 || this.empty()) {
            return false;
        }
        return this.at(index).hasLeftChild();
    }

//    check if element at index has a right child
    hasRightChildAt(index) {
        if (index >= this.size() || index < 0 || this.empty()) {
            return false;
        }
        return this.at(index).hasRightChild();
    }

//    get the right child of the last element of b-Node
    getRightmostChild() {
        if (this.empty())
            return null;
        return this.last().rightChild;
    }

//    get the left child of the first element of b-Node
    getLeftmostChild() {
        if (this.empty())
            return null;
        return this.first().leftChild;
    }

//    add an element at the first position
    addFirst(elem) {
        this.elements.unshift(elem);
    }

//    add an element at the last position
    addLast(elem) {
        this.elements.push(elem);
    }

//    add the element at index
    addAt(index, elem) {
        if (index === this.size()) {
            this.addLast(elem);
        } else this.elements.splice(index,0, elem);
    }

//    pop an element at the first position
    popFirst() {
        return this.elements.shift();
    }

//    pop an element at the last position
    popLast() {
        return this.elements.pop();
    }

//    pop an element at index
    popAt(index) {
        return this.elements.splice(index,1)[0];
    }

//    add new element automatically
    add(elem, idx, side) {
        if (this.empty() || (idx === this.size() - 1 && side === true)) {
            this.addLast(elem);
        }
        else {
            if (this.hasLeftChildAt(idx))
                this.at(idx).leftChild = elem.rightChild;
            if (this.hasRightChildAt(idx - 1))
                this.at(idx - 1).rightChild = elem.leftChild;
            this.addAt(idx, elem);
        }
    }
}

export default BNode;