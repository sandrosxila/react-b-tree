import React, { FC } from 'react';
import TreeNode from './TreeNode';

type Props = {
    levels: Levels,
    themeIndex: number,
    level: number,
    nodes: Levels[number][number],
    setXById: { [key in string]?: (x: number) => void },
    cluster: number,
    levelX: number,
    levelWidth: number
}

const Cluster: FC<Props> = ({ levels, themeIndex, level, nodes, setXById, cluster, levelX, levelWidth }) => {
    const clusterStyle: React.CSSProperties = {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
    };

    return (
        <div style={ clusterStyle }>
            {
                nodes.map((node, key) => (
                    <TreeNode
                        key={ key }
                        levels={ levels }
                        themeIndex={ themeIndex }
                        setXById={ setXById }
                        level={ level }
                        cluster={ cluster }
                        index={ key }
                        id={ node.id }
                        isLeaf={ node.isLeaf }
                        elements={ node.elements }
                        levelX={ levelX }
                        levelWidth={ levelWidth }
                    />
                ))
            }
        </div>
    );
};

export default React.memo(Cluster);
