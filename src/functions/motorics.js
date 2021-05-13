// finds element in b-tree
export const findElement =
    (element,
     levels,
     currentLevel = 0,
     currentCluster = 0,
     currentNode = 0,
     idx = 0) => {
        const node = levels[currentLevel][currentCluster][currentNode];
        if (!node || idx >= node.elements.length)
            return;

        const nextCluster = () => {
            let leftIndex = 0;
            for (let i = 0; i < currentCluster; i++) {
                leftIndex += levels[currentLevel][i].length;
            }
            return leftIndex + currentNode;
        }
        const getDomElement = (id, index) => document.getElementById(`element-${id}-${index}`);
        const getLeftLine = (id, index) => document.querySelector(`.line-${id}-${index}-left`);
        const getRightLine = (id, index) => document.querySelector(`.line-${id}-${index}-right`);
        const nodeElement = node.elements[idx];

        console.log(currentLevel, currentCluster, currentNode, idx, nodeElement);
        console.log(document.getElementById(`element-${node.id}-${idx}`));

        getDomElement(node.id, idx).classList.add('flash-it');
        if (element === nodeElement) {
            setTimeout(() => {
                getDomElement(node.id, idx).classList.remove('flash-it');
            }, 1500);
            return;
        }
        if (element < nodeElement) {
            getLeftLine(node.id, idx).classList.add('flash-it');
            if (idx > 0) {
                getDomElement(node.id, idx).classList.remove('flash-it');
                getLeftLine(node.id, idx).classList.remove('flash-it');
                if (!node.isLeaf)
                    findElement(element, levels, currentLevel + 1, nextCluster(), idx, 0);
            } else {
                setTimeout(() => {
                    getDomElement(node.id, idx).classList.remove('flash-it');
                    getLeftLine(node.id, idx).classList.remove('flash-it');
                    if (!node.isLeaf)
                        findElement(element, levels, currentLevel + 1, nextCluster(), idx, 0);
                }, 1500);
            }
            return;
        }
        if (idx + 1 < node.elements.length) {
            setTimeout(() => {
                getDomElement(node.id, idx).classList.remove('flash-it');
                findElement(element, levels, currentLevel, currentCluster, currentNode, idx + 1);
            }, 1500);
            return;
        }

        if (idx === node.elements.length - 1 && element > node.elements[idx]) {
            getRightLine(node.id, idx).classList.add('flash-it');
            setTimeout(() => {
                getDomElement(node.id, idx).classList.remove('flash-it');
                getRightLine(node.id, idx).classList.remove('flash-it');
                if (!node.isLeaf)
                    findElement(element, levels, currentLevel + 1, nextCluster(), node.elements.length, 0);
            }, 1500);
        }
    };
