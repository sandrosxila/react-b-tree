import Element from "./Element";
import BNode from "./BNode";

class BTree {

    constructor(base) {
        this.base = base;
        this.root = new BNode();
        this.minElements = Math.floor((base + 1) / 2) - 1;
        this.size = 0;
        this.recentNode = null;
        this.callStack = [];
        this.previous = [];
        this.forward = [];
        this.clearForwardOnAction = true;
    }

    addAtLastIndexOfCallStack(item) {
        this.callStack[this.callStack.length - 1].push(
            item
        );
    }

//    split the b-Node and return new node
    split(node) {
        let newNode = new BNode();
        let newNodeIsLeafOldValue = newNode.isLeaf;
        newNode.isLeaf = node.isLeaf;
        this.addAtLastIndexOfCallStack(
            () => {
                newNode.isLeaf = newNodeIsLeafOldValue;
            }
        );
        while (node.size() > Math.floor(this.base / 2)) {
            let nodePopLastElement = node.popLast();
            this.addAtLastIndexOfCallStack(
                this.undoPopLast.bind(this, nodePopLastElement, node)
            );
            newNode.addFirst(nodePopLastElement);
            this.addAtLastIndexOfCallStack(
                this.undoAddFirst.bind(this, newNode)
            );
            if (newNode.first().hasLeftChild()) {
                let newNodeFirstLeftChildParentOldValue = newNode.first().leftChild.parent;
                newNode.first().leftChild.parent = newNode;
                this.addAtLastIndexOfCallStack(() => {
                    newNode.first().leftChild.parent = newNodeFirstLeftChildParentOldValue;
                });
            }
            if (newNode.first().hasRightChild()) {
                let newNodeFirstRightChildParentOldValue = newNode.first().rightChild.parent;
                newNode.first().rightChild.parent = newNode;
                this.addAtLastIndexOfCallStack(() => {
                    newNode.first().rightChild.parent = newNodeFirstRightChildParentOldValue
                });
            }
        }
        return newNode;
    }

//    split up node and increase height of b-tree
    liftUp(node, parentIndex, side) {
        let parentElement = node.popAt(Math.floor(this.base / 2));
        this.addAtLastIndexOfCallStack(
            this.undoPopAt.bind(this, parentElement, node, Math.floor(this.base / 2))
        );
        let newNode = this.split(node);

        if (!node.hasParent()) {
            node.parent = new BNode();
            let nodeParentIsLeafOldValue = node.parent.isLeaf;
            node.parent.isLeaf = false;
            this.addAtLastIndexOfCallStack(() => {
                node.parent.isLeaf = nodeParentIsLeafOldValue;
            });
        }

        if (this.root === node) {
            let rootOldValue = this.root;
            this.root = node.parent;
            this.addAtLastIndexOfCallStack(() => {
                this.root = rootOldValue
            });
        }

        let newNodeParentOldValue = newNode.parent;
        newNode.parent = node.parent;
        this.addAtLastIndexOfCallStack(() => {
            newNode.parent = newNodeParentOldValue;
        });

        let parentElementLeftChildOldValue = parentElement.leftChild;
        parentElement.leftChild = node;
        this.addAtLastIndexOfCallStack(() => {
            parentElement.leftChild = parentElementLeftChildOldValue
        });

        let parentElementRightChildOldValue = parentElement.rightChild;
        parentElement.rightChild = newNode;
        this.addAtLastIndexOfCallStack(() => {
            parentElement.rightChild = parentElementRightChildOldValue;
        });

        if (node.parent.empty() || (parentIndex === node.parent.size() - 1 && side === true)) {
            node.parent.addLast(parentElement);
            this.addAtLastIndexOfCallStack(
                this.undoAddLast.bind(this, node.parent)
            );
        } else {
            if (node.parent.hasLeftChildAt(parentIndex)) {
                let nodeParentAtLeftChildOldValue = node.parent.at(parentIndex).leftChild;
                node.parent.at(parentIndex).leftChild = parentElement.rightChild;
                this.addAtLastIndexOfCallStack(() => {
                    node.parent.at(parentIndex).leftChild = nodeParentAtLeftChildOldValue;
                });
            }

            if (node.parent.hasRightChildAt(parentIndex - 1)) {
                let nodeParentAtRightChildOldValue = node.parent.at(parentIndex - 1).rightChild;
                node.parent.at(parentIndex - 1).rightChild = parentElement.leftChild;
                this.addAtLastIndexOfCallStack(() => {
                    node.parent.at(parentIndex - 1).rightChild = nodeParentAtRightChildOldValue;
                });
            }

            node.parent.addAt(parentIndex, parentElement);
            this.addAtLastIndexOfCallStack(
                this.undoAddAt.bind(this, node.parent, parentIndex)
            );
        }

        let nodeParentIsLeafOldValue = node.parent.isLeaf;
        node.parent.isLeaf = false;
        this.addAtLastIndexOfCallStack(() => {
            node.parent.isLeaf = nodeParentIsLeafOldValue;
        })
    }

//    insert an element in b-tree
    insert(elem, current = this.root, parentIndex = -1, side = false) {
        if (current.empty()) {
            this.callStack.push([]);
            current.addFirst(new Element(elem));
            this.addAtLastIndexOfCallStack(
                this.undoAddFirst.bind(this, current)
            );
            this.size++;
            this.addAtLastIndexOfCallStack(()=>{
                this.size--;
            });
            this.previous.push({action:"insert", data: elem});
            if(this.clearForwardOnAction)
                this.forward = [];
        } else if (elem >= current.last().value) {
            if (current.hasRightmostChild()) {
                this.insert(elem, current.getRightmostChild(), current.size() - 1, true);
            } else {
                this.callStack.push([]);
                current.addLast(new Element(elem));
                this.addAtLastIndexOfCallStack(
                    this.undoAddLast.bind(this, current)
                );
                this.size++;
                this.addAtLastIndexOfCallStack(
                    () => {
                        this.size--;
                    }
                );
                this.previous.push({action:"insert", data: elem});
                if(this.clearForwardOnAction)
                    this.forward = [];
            }
        } else {
            for (let idx = 0; idx < current.size(); idx++) {
                if (elem < current.valueAt(idx)) {
                    if (current.hasLeftChildAt(idx)) {
                        this.insert(elem, current.leftChildAt(idx), idx, false);
                        break;
                    } else {
                        this.callStack.push([]);
                        current.addAt(idx, new Element(elem));
                        this.addAtLastIndexOfCallStack(
                            this.undoAddAt.bind(this, current, idx)
                        );
                        this.size++;
                        this.addAtLastIndexOfCallStack(
                            () => {
                                this.size--;
                            }
                        );
                        this.previous.push({action:"insert", data: elem});
                        if(this.clearForwardOnAction)
                            this.forward = [];
                        break;
                    }
                }
            }
        }
        if (current.size() === this.base) {
            this.liftUp(current, parentIndex, side);
        }
    }

//    get right sibling node
    getRightSibling(node, side, parentPos) {
        if (node.hasParent()) {
            if (node.parent.hasRightChildAt(side ? parentPos + 1 : parentPos))
                return node.parent.at(side ? parentPos + 1 : parentPos).rightChild;
        }
        return null;
    }

//    get left sibling node
    getLeftSibling(node, side, parentPos) {
        if (node.hasParent()) {
            if (node.parent.hasLeftChildAt(side ? parentPos : parentPos - 1))
                return node.parent.at(side ? parentPos : parentPos - 1).leftChild;
        }
        return null;
    }

//    merge elements from right sibling to left sibling
    mergeToLeft(leftNode, rightNode) {
        if (!rightNode.empty()) {
            let leftNodeLastRightChildOldValue = leftNode.last().rightChild;
            leftNode.last().rightChild = rightNode.getLeftmostChild();
            this.addAtLastIndexOfCallStack(
                () => {
                    leftNode.last().rightChild = leftNodeLastRightChildOldValue;
                }
            )
            if (leftNode.hasRightmostChild()) {
                let leftNodeLastRightChildParentOldValue = leftNode.last().rightChild.parent;
                leftNode.last().rightChild.parent = leftNode;
                this.addAtLastIndexOfCallStack(
                    () => {
                        leftNode.last().rightChild.parent = leftNodeLastRightChildParentOldValue;
                    }
                );
            }
            while (!rightNode.empty()) {
                let rightNodeElement = rightNode.popFirst();
                this.addAtLastIndexOfCallStack(
                    this.undoPopFirst.bind(this, rightNodeElement, rightNode)
                );
                leftNode.addLast(rightNodeElement);
                this.addAtLastIndexOfCallStack(
                    this.undoAddLast.bind(this, leftNode)
                )
                if (leftNode.last().leftChild != null) {
                    let leftNodeLastLeftChildParentOldValue = leftNode.last().leftChild.parent;
                    leftNode.last().leftChild.parent = leftNode;
                    this.addAtLastIndexOfCallStack(
                        () => {
                            leftNode.last().leftChild.parent = leftNodeLastLeftChildParentOldValue;
                        }
                    )
                }
                if (leftNode.last().rightChild != null) {
                    let leftNodeLastRightChildParentOldValue = leftNode.last().rightChild.parent;
                    leftNode.last().rightChild.parent = leftNode;
                    this.addAtLastIndexOfCallStack(
                        () => {
                            leftNode.last().rightChild.parent = leftNodeLastRightChildParentOldValue
                        }
                    );
                }
            }
        }

        let rightNodeParentOldValue = rightNode.parent;
        rightNode.parent = null;
        this.addAtLastIndexOfCallStack(
            () => {
                rightNode.parent = rightNodeParentOldValue;
            }
        );

        let rightNodeOldValue = rightNode;
        rightNode = null;
        this.addAtLastIndexOfCallStack(
            () => {
                rightNode = rightNodeOldValue;
            }
        );
    }

//    merge elements from left sibling to right sibling
    mergeToRight(leftNode, rightNode) {
        if (!leftNode.empty()) {

            let rightNodeFirstLeftChildOldValue = rightNode.first().leftChild;
            rightNode.first().leftChild = leftNode.getRightmostChild();
            this.addAtLastIndexOfCallStack(
                () => {
                    rightNode.first().leftChild = rightNodeFirstLeftChildOldValue;
                }
            );

            if (rightNode.hasLeftmostChild()) {
                let rightNodeFirstLeftChildParentOldValue = rightNode.first().leftChild.parent;
                rightNode.first().leftChild.parent = rightNode;
                this.addAtLastIndexOfCallStack(
                    () => {
                        rightNode.first().leftChild.parent = rightNodeFirstLeftChildParentOldValue;
                    }
                );
            }
            while (!leftNode.empty()) {
                let leftNodeElement = leftNode.popLast();
                this.addAtLastIndexOfCallStack(
                    this.undoPopLast.bind(this, leftNodeElement, leftNode)
                );

                rightNode.addFirst(leftNodeElement);
                this.addAtLastIndexOfCallStack(
                    this.undoAddFirst.bind(this, rightNode)
                );

                if (rightNode.first().leftChild !== null) {
                    let rightNodeFirstLeftChildParentOldValue = rightNode.first().leftChild.parent;
                    rightNode.first().leftChild.parent = rightNode;
                    this.addAtLastIndexOfCallStack(
                        () => {
                            rightNode.first().leftChild.parent = rightNodeFirstLeftChildParentOldValue;
                        }
                    );
                }
                if (rightNode.first().rightChild !== null) {
                    let rightNodeFirstRightChildParentOldValue = rightNode.first().rightChild.parent;
                    rightNode.first().rightChild.parent = rightNode;
                    this.addAtLastIndexOfCallStack(
                        () => {
                            rightNode.first().rightChild.parent = rightNodeFirstRightChildParentOldValue;
                        }
                    );
                }
            }
        }

        let leftNodeParentOldValue = leftNode.parent;
        leftNode.parent = null;
        this.addAtLastIndexOfCallStack(
            () => {
                leftNode.parent = leftNodeParentOldValue;
            }
        )

        let leftNodeOldValue = leftNode;
        leftNode = null;
        this.addAtLastIndexOfCallStack(
            () => {
                leftNode = leftNodeOldValue;
            }
        );

    }

//    shift one element from left child to parent and from parent to right child
    propagateFromLeftSibling(node, parentPos, leftSibling) {
        let nodeElement = node.parent.popAt(parentPos);
        this.addAtLastIndexOfCallStack(
            this.undoPopAt.bind(this, nodeElement, node.parent, parentPos)
        );

        let oldLeftChildValue = nodeElement.leftChild;
        nodeElement.leftChild = leftSibling.getRightmostChild();
        this.addAtLastIndexOfCallStack(
            () => {
                nodeElement.leftChild = oldLeftChildValue;
            }
        );

        let oldRightChildValue = nodeElement.rightChild;
        nodeElement.rightChild = node.hasLeftmostChild() ? node.getLeftmostChild() : this.recentNode;
        this.addAtLastIndexOfCallStack(
            () => {
                nodeElement.rightChild = oldRightChildValue;
            }
        );

        if (nodeElement.hasLeftChild()) {
            let oldLeftChildParentValue = nodeElement.leftChild.parent;
            nodeElement.leftChild.parent = node;
            this.addAtLastIndexOfCallStack(
                () => {
                    nodeElement.leftChild.parent = oldLeftChildParentValue
                }
            );
        }

        if (nodeElement.hasRightChild()) {
            let oldRightChildParentValue = nodeElement.rightChild.parent;
            nodeElement.rightChild.parent = node;
            this.addAtLastIndexOfCallStack(
                () => {
                    nodeElement.rightChild.parent = oldRightChildParentValue
                }
            );
        }

        node.addFirst(nodeElement);
        this.addAtLastIndexOfCallStack(
            this.undoAddFirst.bind(this, node)
        );

        let parentElement = leftSibling.popLast();
        this.addAtLastIndexOfCallStack(
            this.undoPopLast.bind(this, parentElement, leftSibling)
        );

        let parentElementLeftChildOldValue = parentElement.leftChild;
        parentElement.leftChild = leftSibling;
        this.addAtLastIndexOfCallStack(
            () => {
                parentElement.leftChild = parentElementLeftChildOldValue;
            }
        );

        let parentElementRightChildOldValue = parentElement.rightChild;
        parentElement.rightChild = node;
        this.addAtLastIndexOfCallStack(
            () => {
                parentElement.rightChild = parentElementRightChildOldValue
            }
        );

        node.parent.addAt(parentPos, parentElement);
        this.addAtLastIndexOfCallStack(
            this.undoAddAt.bind(this, node.parent, parentPos)
        );
    }

//    shift one element from right child to parent and from parent to left child
    propagateFromRightSibling(node, parentPos, rightSibling) {
        let nodeElement = node.parent.popAt(parentPos);
        this.addAtLastIndexOfCallStack(
            this.undoPopAt.bind(this, nodeElement, node.parent, parentPos)
        );

        let nodeElementLeftChildOldValue = nodeElement.leftChild;
        nodeElement.leftChild = node.hasRightmostChild() ? node.getRightmostChild() : this.recentNode;
        this.addAtLastIndexOfCallStack(
            () => {
                nodeElement.leftChild = nodeElementLeftChildOldValue;
            }
        );

        let nodeElementRightChildOldValue = nodeElement.rightChild;
        nodeElement.rightChild = rightSibling.getLeftmostChild();
        this.addAtLastIndexOfCallStack(
            () => {
                nodeElement.rightChild = nodeElementRightChildOldValue;
            }
        );

        if (nodeElement.hasLeftChild()) {
            let nodeElementLeftChildParentOldValue = nodeElement.leftChild.parent;
            nodeElement.leftChild.parent = node;
            this.addAtLastIndexOfCallStack(
                () => {
                    nodeElement.leftChild.parent = nodeElementLeftChildParentOldValue;
                }
            );
        }

        if (nodeElement.hasRightChild()) {
            let nodeElementRightChildParent = nodeElement.rightChild.parent;
            nodeElement.rightChild.parent = node;
            this.addAtLastIndexOfCallStack(
                () => {
                    nodeElement.rightChild.parent = nodeElementRightChildParent;
                }
            );
        }

        node.addLast(nodeElement);
        this.addAtLastIndexOfCallStack(
            this.undoAddLast.bind(this, node)
        );

        let parentElement = rightSibling.popFirst();
        this.addAtLastIndexOfCallStack(
            this.undoPopFirst.bind(this, parentElement, rightSibling)
        );

        let parentElementLeftChildOldValue = parentElement.leftChild;
        parentElement.leftChild = node;
        this.addAtLastIndexOfCallStack(
            () => {
                parentElement.leftChild = parentElementLeftChildOldValue;
            }
        );

        let parentElementRightChildOldValue = parentElement.rightChild;
        parentElement.rightChild = rightSibling;
        this.addAtLastIndexOfCallStack(
            () => {
                parentElement.rightChild = parentElementRightChildOldValue;
            }
        );

        node.parent.addAt(parentPos, parentElement);
        this.addAtLastIndexOfCallStack(
            this.undoAddAt.bind(this, node.parent, parentPos)
        );
    }

//    push down parent node element to it's right child and then merge the children
    propagateDownFromLeft(node, parentPos, leftSibling) {
        let parentElement = node.parent.popAt(parentPos);
        this.addAtLastIndexOfCallStack(
            this.undoPopAt.bind(this, parentElement, node.parent, parentPos)
        );
        if (node.parent.hasRightChildAt(parentPos - 1)) {
            let nodeParentAtRightChildOldValue = node.parent.at(parentPos - 1).rightChild;
            node.parent.at(parentPos - 1).rightChild = node;
            this.addAtLastIndexOfCallStack(
                () => {
                    node.parent.at(parentPos - 1).rightChild = nodeParentAtRightChildOldValue;
                }
            );
        }
        let parentElementLeftChildOldValue = parentElement.leftChild;
        parentElement.leftChild = null;
        this.addAtLastIndexOfCallStack(
            () => {
                parentElement.leftChild = parentElementLeftChildOldValue;
            }
        )

        let parentElementRightChildOldValue = parentElement.rightChild;
        parentElement.rightChild = node.hasLeftmostChild() ? node.getLeftmostChild() : this.recentNode;
        this.addAtLastIndexOfCallStack(
            () => {
                parentElement.rightChild = parentElementRightChildOldValue;
            }
        )

        node.addFirst(parentElement);
        this.addAtLastIndexOfCallStack(
            this.undoAddFirst.bind(this, node)
        );

        let nodeIsLeafOldValue = node.isLeaf;
        node.isLeaf = node.isLeaf && leftSibling.isLeaf;
        this.addAtLastIndexOfCallStack(
            () => {
                node.isLeaf = nodeIsLeafOldValue;
            }
        );

        this.mergeToRight(leftSibling, node);
        if (node.parent === this.root && this.root.size() === 0) {
            let rootOldValue = this.root;
            this.root = node;
            this.addAtLastIndexOfCallStack(
                () => {
                    this.root = rootOldValue;
                }
            );

            let nodeParentOldValue = node.parent;
            node.parent = null;
            this.addAtLastIndexOfCallStack(
                () => {
                    node.parent = nodeParentOldValue;
                }
            )
        }
    }

//    push down parent node element to it's left child and then merge the children
    propagateDownFromRight(node, parentPos, rightSibling) {
        let parentElement = node.parent.popAt(parentPos);
        this.addAtLastIndexOfCallStack(
            this.undoPopAt.bind(this, parentElement, node.parent, parentPos)
        );

        if (node.parent.hasLeftChildAt(parentPos)) {
            let nodeParentAtLeftChildOldValue = node.parent.at(parentPos).leftChild;
            node.parent.at(parentPos).leftChild = node;
            this.addAtLastIndexOfCallStack(
                () => {
                    node.parent.at(parentPos).leftChild = nodeParentAtLeftChildOldValue;
                }
            )
        }

        let parentElementLeftChildOldValue = parentElement.leftChild;
        parentElement.leftChild = node.hasRightmostChild() ? node.getRightmostChild() : this.recentNode;
        this.addAtLastIndexOfCallStack(
            () => {
                parentElement.leftChild = parentElementLeftChildOldValue;
            }
        );

        let parentElementRightChildOldValue = parentElement.rightChild;
        parentElement.rightChild = null;
        this.addAtLastIndexOfCallStack(
            () => {
                parentElement.rightChild = parentElementRightChildOldValue;
            }
        );

        node.addLast(parentElement);
        this.addAtLastIndexOfCallStack(
            this.undoAddLast.bind(this, node)
        );

        let nodeIsLeafOldValue = node.isLeaf;
        node.isLeaf = node.isLeaf && rightSibling.isLeaf;
        this.addAtLastIndexOfCallStack(
            () => {
                node.isLeaf = nodeIsLeafOldValue;
            }
        );

        this.mergeToLeft(node, rightSibling);


        if (node.parent === this.root && this.root.size() === 0) {
            let rootOldValue = this.root;
            this.root = node;
            this.addAtLastIndexOfCallStack(
                () => {
                    this.root = rootOldValue;
                }
            )

            let nodeParentOldValue = node.parent;
            node.parent = null;
            this.addAtLastIndexOfCallStack(
                () => {
                    node.parent = nodeParentOldValue;
                }
            );
        }
    }

//    restore minimum number of elements in node
    balance(node, parentPosition, side) {
        let leftSibling = this.getLeftSibling(node, side, parentPosition);
        let rightSibling = this.getRightSibling(node, side, parentPosition);

//        case 3: when a node has minimum number of elements and left-sibling with more than minimum number of elements
        if (leftSibling != null && leftSibling.size() > this.minElements)
            this.propagateFromLeftSibling(node, side ? parentPosition : parentPosition - 1, leftSibling);
//        case 4: when a node has minimum number of elements and right-sibling with more than minimum number of elements
        else if (rightSibling != null && rightSibling.size() > this.minElements)
            this.propagateFromRightSibling(node, side ? parentPosition + 1 : parentPosition, rightSibling);
//        case 5: when a node has minimum number of elements and left-sibling with minimum number of elements
        else if (leftSibling != null && leftSibling.size() <= this.minElements)
            this.propagateDownFromLeft(node, side ? parentPosition : parentPosition - 1, leftSibling);
//        case 6: when a node has minimum number of elements and right-sibling with minimum number of elements
        else if (rightSibling != null && rightSibling.size() <= this.minElements)
            this.propagateDownFromRight(node, side ? parentPosition + 1 : parentPosition, rightSibling);
        this.recentNode = node;
    }

//    take inorder predecessor and balance affected nodes excluding the root node of sub-tree
    takeInorderPredecessor(current, parentPosition, side, top = true) {
        let inorderPredecessor;
        if (current.hasRightmostChild()) {
            inorderPredecessor =
                this.takeInorderPredecessor(current.getRightmostChild(), current.size() - 1, true, false)
        } else {
            let currentLastElement = current.popLast();
            this.addAtLastIndexOfCallStack(
                this.undoPopLast.bind(this, currentLastElement, current)
            );
            inorderPredecessor = currentLastElement;
        }
        if (!top && current.size() < this.minElements)
            this.balance(current, parentPosition, side);
        return inorderPredecessor;
    }

//    take inorder successor and balance affected nodes excluding the root node of sub-tree
    takeInorderSuccessor(current, parentPosition, side, top = true) {
        let inorderSuccessor;
        if (current.hasLeftmostChild()) {
            inorderSuccessor = this.takeInorderSuccessor(current.getLeftmostChild(), 0, false, false);
        } else {
            let currentFirstElement = current.popFirst();
            this.addAtLastIndexOfCallStack(
                this.undoPopFirst.bind(this, currentFirstElement, current)
            )
            inorderSuccessor = currentFirstElement;
        }
        if (!top && current.size() < this.minElements)
            this.balance(current, parentPosition, side);
        return inorderSuccessor;
    }

//    different cases of deletion are implemented here
    eraseDispatch(node, position, parentPosition, side) {
        if (node.isLeaf) {
//            case 1: when leaf-node has more than minimum number of elements
            if (node.size() > this.minElements) {
                let erasedElement = node.popAt(position);
                this.addAtLastIndexOfCallStack(
                    this.undoPopAt.bind(this, erasedElement, node, position)
                );
            }
//            case 2: when leaf-node does not have more than minimum number of elements
            else {
                let erasedElement = node.popAt(position);
                this.addAtLastIndexOfCallStack(
                    this.undoPopAt.bind(this, erasedElement, node, position)
                )
                this.balance(node, parentPosition, side);
            }
        } else {
//            case 7: when internal node has a left child
            if (node.hasLeftChildAt(position)) {
                let elem = node.at(position);

                let inorderPredecessor = this.takeInorderPredecessor(elem.leftChild, position, false);

                let inorderPredecessorOldValue = inorderPredecessor.leftChild;
                inorderPredecessor.leftChild = elem.leftChild;
                this.addAtLastIndexOfCallStack(
                    () => {
                        inorderPredecessor.leftChild = inorderPredecessorOldValue;
                    }
                );

                let inorderPredecessorRightChildOldValue = inorderPredecessor.rightChild;
                inorderPredecessor.rightChild = elem.rightChild;
                this.addAtLastIndexOfCallStack(
                    () => {
                        inorderPredecessor.rightChild = inorderPredecessorRightChildOldValue;
                    }
                );


                let nodeElement = node.popAt(position);
                this.addAtLastIndexOfCallStack(
                    this.undoPopAt.bind(this, nodeElement, node, position)
                );

                node.addAt(position, inorderPredecessor);
                this.addAtLastIndexOfCallStack(
                    this.undoAddAt.bind(this, node, position)
                );

                if (node.leftChildAt(position).size() < this.minElements)
                    this.balance(node.leftChildAt(position), position, false);
            }
//            case 8: when internal node has a right child
            else if (node.hasRightChildAt(position)) {
                let elem = node.at(position);
                let inorderSuccessor = this.takeInorderSuccessor(elem.rightChild, position, true);

                let inorderSuccessorLeftChildOldValue = inorderSuccessor.leftChild;
                inorderSuccessor.leftChild = elem.leftChild;
                this.addAtLastIndexOfCallStack(
                    () => {
                        inorderSuccessor.leftChild = inorderSuccessorLeftChildOldValue
                    }
                )

                let inorderSuccessorRightChildOldValue = inorderSuccessor.rightChild;
                inorderSuccessor.rightChild = elem.rightChild;
                this.addAtLastIndexOfCallStack(
                    () => {
                        inorderSuccessor.rightChild = inorderSuccessorRightChildOldValue;
                    }
                );

                let nodeElement = node.popAt(position);
                this.addAtLastIndexOfCallStack(
                    this.undoPopAt.bind(this, nodeElement, node, position)
                );

                node.addAt(position, inorderSuccessor);
                this.addAtLastIndexOfCallStack(
                    this.undoAddAt.bind(this, node, position)
                );

                if (node.rightChildAt(position).size() < this.minElements)
                    this.balance(node.rightChildAt(position), position, true);
            }
        }
    }

//    deletion of element
    erase(elem, current = this.root, parentIndex = -1, side = false, isRoot = true) {
        this.recentNode = null;
        if (current.empty()) {
            return;
        } else if (elem > current.last().value) {
            if (current.hasRightmostChild()) {
                this.erase(elem, current.getRightmostChild(), current.size() - 1, true, false);
            } else {
                return;
            }
        } else {
            for (let idx = 0; idx < current.size(); idx++) {
                if (elem === current.valueAt(idx)) {
                    this.callStack.push([]);
                    this.eraseDispatch(current, idx, parentIndex, side);
                    this.size--;
                    this.addAtLastIndexOfCallStack(
                        () => {
                            this.size++;
                        }
                    );
                    this.previous.push({action:"erase", data: elem});
                    if(this.clearForwardOnAction)
                        this.forward = [];
                    break;
                } else if (elem < current.valueAt(idx)) {
                    if (current.hasLeftChildAt(idx)) {
                        this.erase(elem, current.leftChildAt(idx), idx, false, false);
                        break;
                    } else {
                        return;
                    }
                }
            }
        }
        if (!isRoot && current.size() < this.minElements) {
            this.balance(current, parentIndex, side);
        }
        this.recentNode = current;
    }

    print_all(current = this.root) {
        current.elements.forEach(
            i => {
                if (i.hasLeftChild())
                    this.print_all(i.leftChild);
                process.stdout.write(`${i.value} `);
            }
        )


        if (current.hasRightmostChild())
            this.print_all(current.last().rightChild);
    }

    bfs(root = this.root) {
        if(this.size === 0)
            return [];
        let nodes = [];
        let queue = [{
            id: 0,
            level: 0,
            node: root,
            parent: -1,
            parentElement: 0,
            side: 'left'
        }];
        let lastParent = -2;
        for (let i = 0; queue.length !== 0;) {
            const {id, level, node, parent, parentElement, side} = queue.shift();
            node.elements.forEach(
                (element, index) => {
                    if (element.hasLeftChild()) {
                        i++;
                        queue.push({
                            id: i,
                            level: level + 1,
                            node: element.leftChild,
                            parent: id,
                            parentElement: index,
                            side: 'left'
                        });
                    }
                }
            )
            if (node.hasRightmostChild()) {
                i++;
                queue.push({
                    id: i,
                    level: level + 1,
                    node: node.last().rightChild,
                    parent: id,
                    parentElement: node.size() - 1,
                    side: 'right'
                });
            }

            if (typeof nodes[level] === 'undefined') {
                nodes.push([]);
            }

            if (lastParent !== parent) {
                nodes[level].push([]);
                lastParent = parent;
            }
            nodes[level][nodes[level].length - 1].push({
                id,
                elements: [...node.elements.map(element => element.value)],
                level,
                parent,
                isLeaf: node.isLeaf,
                parentElement,
                side
            });
        }
        return nodes;
    }

    undo() {
        if (this.callStack.length > 0) {
            let lastOperations = this.callStack.pop();
            while (lastOperations.length > 0) {
                let lastOperation = lastOperations.pop();
                lastOperation();
            }
            this.forward.push(this.previous.pop());
        }
    }

    undoPopAt(element, node, position) {
        node.addAt(position, element);
    }

    undoAddAt(node, position) {
        node.popAt(position);
    }

    undoAddFirst(node) {
        node.popFirst();
    }

    undoAddLast(node) {
        node.popLast();
    }

    undoPopFirst(element, node) {
        node.addFirst(element);
    }

    undoPopLast(element, node) {
        node.addLast(element);
    }

    redo(){
        if(this.forward.length > 0){
            let lastOperation = this.forward.pop();
            this.clearForwardOnAction = false;
            if(lastOperation.action === "insert"){
                this.insert(lastOperation.data);
            }
            else if(lastOperation.action === "erase"){
                this.erase(lastOperation.data);
            }
            this.clearForwardOnAction = true;
        }
    }

}

export default BTree;