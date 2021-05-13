// arranging positions
export const arrangePositions = (levels, setXById) => {
    levels.forEach((levelItems, levelIndex) => {
        if (document.getElementById(`level-${levelIndex}`)) {
            let leftSum = 0;
            let lastParentIndex = -1;
            levelItems.forEach((nodes) => {
                const leftNode = document.getElementById(`node-${nodes[0].id}`);
                const rightNode = document.getElementById(`node-${nodes[nodes.length - 1].id}`);
                const parentNode = document.getElementById(`node-${nodes[0].parent}`);
                const scene = document.getElementById('scene');
                if (leftNode && rightNode && parentNode && scene) {
                    const leftNodeBounds = leftNode.getBoundingClientRect();
                    const rightNodeBounds = rightNode.getBoundingClientRect();
                    const parentNodeBounds = parentNode.getBoundingClientRect();
                    if (setXById[`node-${nodes[0].parent}`]) {
                        setXById[`node-${nodes[0].parent}`](
                            (leftNodeBounds.left)
                            + scene.scrollLeft
                            + ((rightNodeBounds.left + rightNodeBounds.width - leftNodeBounds.left) / 2)
                            - (leftSum)
                            - (parentNodeBounds.width / 2)
                        );
                        if (lastParentIndex !== nodes[0].parent) {
                            leftSum += parentNodeBounds.width;
                            lastParentIndex = nodes[0].parent;
                        }
                    }
                }
            });
        }
    })
};

// arranging lines
export const arrangeNodeLines = (levels,
    currentLevel = 0,
    currentCluster = 0,
    currentNode = 0) => {
    if(levels[currentLevel][currentCluster][currentNode].isLeaf === false) {
        let nextCluster = 0;
        for (let i = 0; i < currentCluster; i++)
            nextCluster += levels[currentLevel][i].length;
        nextCluster += currentNode;
        levels[currentLevel+1][nextCluster].forEach((node) => {
            const {id, parent, parentElement, side} = node;
            const end = document.querySelector(`#node-${id}`);
            const start = document.querySelector(`.node-${parent}-${parentElement}-${side}`);
            const line = document.querySelector(`.line-${parent}-${parentElement}-${side}`);
            if (start && end && line) {
                //first dot
                const aX = 0;
                const aY = 0;

                //last dot
                const bX =
                    end.getBoundingClientRect().x + (end.getBoundingClientRect().width / 2)
                    - start.getBoundingClientRect().x;
                const bY =
                    end.getBoundingClientRect().y - start.getBoundingClientRect().y;

                //find center points;
                const centerX = (aX + bX) / 2;
                const centerY = (aY + bY) / 2;

                //angle
                const angle = Math.atan2(aY - bY, aX - bX) * 180 / Math.PI;

                //distance
                const distance = Math.sqrt(Math.pow((bX - aX), 2) + Math.pow((bY - aY), 2));

                //bring all the work together
                line.style.width = `${distance}px`;
                line.style.transform = `rotate(${angle}deg)`;
                line.style.top = `${centerY - (line.offsetHeight / 2)}px`;
                line.style.left = `${centerX - (line.offsetWidth / 2)}px`;
            }
        });
    }
};