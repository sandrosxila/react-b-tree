import React from 'react';
import TreeNode from "./TreeNode";

const Cluster = ({levels, themeIndex, level, nodes, boundsById, setXById, cluster}) => {
    return (
        <div className="col-auto">
            <div className="row flex-nowrap align-items-center">
                {
                    nodes.map((node, key) => (
                            <TreeNode
                                key={key}
                                levels = {levels}
                                themeIndex = {themeIndex}
                                setXById={setXById}
                                boundsById={boundsById}
                                level={level}
                                cluster={cluster}
                                index={key}
                                id={node.id}
                                isLeaf={node.isLeaf}
                                elements={node.elements}
                            />
                        )
                    )
                }
            </div>
        </div>
    );
};

export default React.memo(Cluster);
