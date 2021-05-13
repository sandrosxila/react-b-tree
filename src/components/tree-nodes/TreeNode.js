import React, {useEffect, useState} from 'react';
import {animated, config, useSpring, useTransition} from 'react-spring';
import {arrangePositions,arrangeNodeLines} from "../../functions/drawers";
import {nodeParams, elementParams, grads, initialWindow} from "../../constants/constants";

function TreeNode({levels, themeIndex, elements, isLeaf, id, setXById, level, cluster, index}) {
    const {nodeBorderRadius} = nodeParams[themeIndex];

    const [x, setX] = useState(0);

    const treeNodeProps = useSpring({
        height: `${initialWindow.height / 15}px`,
        position: 'relative',
        transform: `translate3d(${x + 15}px,${0}px,0)`,
        onFrame: () => {
            if(!isLeaf)
                arrangeNodeLines(levels, level, cluster,index);
        },
        onRest: () => {
            if (isLeaf && x) {
                setX(0);
            }
            arrangePositions(levels, setXById);
        }
    });

    const elementTransitions = useTransition(elements, item => item, {
        config: {duration: 1000, ...config.gentle},
        from: {
            opacity: 0,
            maxWidth: '0px',
        },
        enter: {
            opacity: 0.8,
            height: `${initialWindow.height / 15 / 1.5}px`,
            textAlign: "center",
            lineHeight: `${initialWindow.height / 15 / 1.5}px`,
            maxWidth: '2000px'
        },
        leave: {
            display: 'none',
        }
    });

    const treeLineStyle = {
        background: grads[themeIndex],
        height: "0.2rem",
        borderRadius: "0.1rem",
        position: "absolute",
        left: "0%",
        top: "0%"
    };

    const nodeRightLineStyle = {
        position: "absolute",
        left: "100%",
        top: "50%"
    }

    const nodeLeftLineStyle = {
        position: "absolute",
        right: "100%",
        top: "50%"
    }

    const elementStyle = {
        ...elementParams[themeIndex]
    }

    const treeNodeStyle = {
        background: grads[themeIndex],
        height: `${initialWindow.height / 15}px`,
        borderRadius : nodeBorderRadius
    }

    useEffect(() => {
        setXById[`node-${id}`] = setX;
        return () => {
            setXById[`node-${id}`] = undefined;
        }
    }, [id, setXById, setX]);


    return (
        <animated.div id={`node-${id}`} className={isLeaf ? "col-auto mr-1" : "col-auto"} style={treeNodeProps}>
            <div className="row p-1 align-items-center" style={treeNodeStyle}>
                {
                    elementTransitions.map((({item, key, props}, idx) => (
                            <animated.div className="col mx-1" key={idx} style={
                                props
                            }>
                                {
                                    idx === 0
                                    &&
                                    <div style={isLeaf ? {display: 'none'} : nodeLeftLineStyle}
                                         className={`mr-1 node-${id}-${idx}-left`}>
                                        <div style={treeLineStyle}
                                             className={`line-${id}-${idx}-left`}>
                                        </div>
                                    </div>
                                }
                                <div style={elementStyle} id={`element-${id}-${idx}`} className={`row h-100`}>
                                    <div className={`col-sm-12 text-center align-self-center my-auto`}>
                                        {item}
                                    </div>
                                </div>
                                <div style={isLeaf ? {display: 'none'} : nodeRightLineStyle}
                                     className={`ml-1 node-${id}-${idx}-right node-${id}-${idx + 1}-left`}
                                >
                                    <div style={treeLineStyle}
                                         className={`line-${id}-${idx}-right line-${id}-${idx + 1}-left`}>
                                    </div>
                                </div>
                            </animated.div>
                        )
                    ))
                }
            </div>
        </animated.div>
    );
}

export default React.memo(TreeNode);