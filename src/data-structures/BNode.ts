import Element from './Element';

class BNode<T = string | number> {
    public isLeaf: boolean;
    public parent: BNode<T> | null;
    public elements: Element<T>[];

    constructor() {
        this.isLeaf = true;
        this.parent = null;
        this.elements = [];
    }
    // checks if the elements are empty
    empty(): boolean {
        return this.elements.length === 0;
    }

    // gets quantity of bNode elements
    size(): number {
        return this.elements.length;
    }

    // gets element at index
    at(index: number): Element<T> | null{
        if (this.empty())
            return null;

        return this.elements[index];
    }

    // gets the first element
    first(): Element<T> | null{
        return this.at(0);
    }

    // gets the last element
    last(): Element<T> | null {
        return this.at(this.size() - 1);
    }

    // checks if bNode has a parent
    hasParent(): boolean {
        return this.parent !== null;
    }

    // checks if the first element of bNode has a left child
    hasLeftmostChild(): boolean {
        const first = this.first();

        if (first === null)
            return false;

        return first.hasLeftChild();
    }

    // checks if the last element of bNode has a right child
    hasRightmostChild(): boolean {
        const last = this.last();

        if (last == null)
            return false;

        return last.hasRightChild();
    }

    // gets value of the first element
    firstValue(): T | null {
        const first = this.first();

        if(first === null)
            return null;

        return first.value;
    }

    // gets left child of the first element
    firstLeftChild(): BNode<T> | null{
        const first = this.first();

        if(first === null)
            return null;

        return first.leftChild;
    }

    // gets right child of the first element
    firstRightChild(): BNode<T> | null{
        const first = this.first();

        if(first === null)
            return null;

        return first.rightChild;
    }

    // gets value of the last element
    lastValue(): T | null {
        const last = this.last();

        if(last === null)
            return null;

        return last.value;
    }

    // gets value of the element at index
    valueAt(index: number): T | null {
        const at = this.at(index);

        if(at == null){
            return null;
        }

        return at.value;
    }

    // gets a left child of the element at index
    leftChildAt(index: number): BNode<T> | null{
        const at = this.at(index);

        if(at == null){
            return null;
        }

        return at.leftChild;
    }

    // gets a right child of the element at index
    rightChildAt(index: number): BNode<T> | null{
        const at = this.at(index);

        if(at == null){
            return null;
        }

        return at.rightChild;
    }

    // checks if element at index has a left child
    hasLeftChildAt(index: number): boolean {
        if (index > this.size() || index < 0 || this.empty()) {
            return false;
        }

        return this.at(index)!.hasLeftChild();
    }

    // checks if element at index has a right child
    hasRightChildAt(index: number): boolean {
        if (index >= this.size() || index < 0 || this.empty()) {
            return false;
        }

        return this.at(index)!.hasRightChild();
    }

    // gets the right child of the last element of b-Node
    getRightmostChild(): null | BNode<T> {
        if (this.empty())
            return null;

        return this.last()!.rightChild;
    }

    // gets the left child of the first element of b-Node
    getLeftmostChild(): null | BNode<T> {
        if (this.empty())
            return null;

        return this.first()!.leftChild;
    }

    // adds an element at the first position
    addFirst(elem: Element<T>): void {
        this.elements.unshift(elem);
    }

    // adds an element at the last position
    addLast(elem: Element<T>): void {
        this.elements.push(elem);
    }

    // adds the element at index
    addAt(index: number, elem: Element<T>): void {
        if (index === this.size()) {
            this.addLast(elem);
        }
        else this.elements.splice(index, 0, elem);
    }

    // pops an element at the first position
    popFirst(): Element<T> | undefined {
        return this.elements.shift();
    }

    // pops an element at the last position
    popLast(): Element<T> | undefined {
        return this.elements.pop();
    }

    // pops an element at index
    popAt(index: number): Element<T> {
        return this.elements.splice(index, 1)[0];
    }

    // adds new element automatically
    add(elem: Element<T>, idx: number, side: boolean): void {
        if (this.empty() || (idx === this.size() - 1 && side === true)) {
            this.addLast(elem);
        }
        else {
            if (this.hasLeftChildAt(idx))
                this.at(idx)!.leftChild = elem.rightChild;
            if (this.hasRightChildAt(idx - 1))
                this.at(idx - 1)!.rightChild = elem.leftChild;
            this.addAt(idx, elem);
        }
    }
}

export default BNode;