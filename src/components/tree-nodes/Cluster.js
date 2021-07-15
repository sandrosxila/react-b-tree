import React from "react";
import TreeNode from "./TreeNode";

const Cluster = ({ levels, themeIndex, level, nodes, boundsById, setXById, cluster, levelX, levelWidth }) => {
    const clusterStyle = {
        display: "flex",
        flexWrap: "no-wrap",
        alignItems: "center",
    };

    return (
        <div style={clusterStyle}>
            {
                nodes.map((node, key) => (
                    <TreeNode
                        key={key}
                        levels={levels}
                        themeIndex={themeIndex}
                        setXById={setXById}
                        boundsById={boundsById}
                        level={level}
                        cluster={cluster}
                        index={key}
                        id={node.id}
                        isLeaf={node.isLeaf}
                        elements={node.elements}
                        levelX={levelX}
                    />
                ))
            }
        </div>
    );
};

export default React.memo(Cluster);
