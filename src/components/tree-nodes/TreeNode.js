import React, { useEffect, useState } from "react";
import { animated, config, useSpring, useTransition } from "react-spring";
import { arrangePositions, arrangeNodeLines } from "../../functions/drawers";
import { nodeParams, elementParams, grads } from "../../constants/constants";
import useWindowSize from "@rooks/use-window-size";

function TreeNode({ levels, themeIndex, elements, isLeaf, id, setXById, level, cluster, index, levelX, levelWidth }) {
	const { nodeBorderRadius } = nodeParams[themeIndex];

	const [x, setX] = useState(0);

	const { innerWidth, innerHeight } = useWindowSize();

	const treeNodeProps = useSpring({
		height: `${innerHeight / 15}px`,
		position: "relative",
		transform: `translate3d(${x + 15}px,${0}px,0)`,
		marginRight: "0.25rem",
		onFrame: () => {
			if (!isLeaf) 
                arrangeNodeLines(levels, level, cluster, index);
		},
		onRest: () => {
			if (isLeaf && x)
				setX(0);
			arrangePositions(levels, setXById);
		},
	});

	useEffect(() => {
		if (!isLeaf) arrangeNodeLines(levels, level, cluster, index);
		arrangePositions(levels, setXById);
		// eslint-disable-next-line
	}, [levelX, levelWidth, innerWidth, innerHeight]);

	const elementTransitions = useTransition(elements, (item) => item, {
		config: { duration: 1000, ...config.gentle },
		from: {
			opacity: 0,
			maxWidth: "0px",
		},
		enter: {
			opacity: 0.8,
			textAlign: "center",
            position:'relative',
			maxWidth: "2000px",
		},
		leave: {
			display: "none",
		},
	});

	const treeLineStyle = {
		background: grads[themeIndex],
		height: "0.2rem",
		borderRadius: "0.1rem",
		position: "absolute",
		left: "0%",
		top: "0%",
	};

	const nodeRightLineStyle = {
		position: "absolute",
		left: "100%",
		top: "50%",
        marginLeft:"0.25rem"
	};

	const nodeLeftLineStyle = {
		position: "absolute",
		right: "100%",
		top: "50%",
        marginRight:"0.25rem"
	};

	const elementStyle = {
		...elementParams[themeIndex],
		padding: "0 15px",
	};

	const treeNodeStyle = {
		background: grads[themeIndex],
		height: `${innerHeight / 15}px`,
		borderRadius: nodeBorderRadius,
		display: "flex",
		alignItems: "center",
		padding: "0.5rem",
		gap: "0.5rem",
	};

	useEffect(() => {
		setXById[`node-${id}`] = setX;
		return () => {
			setXById[`node-${id}`] = undefined;
		};
	}, [id, setXById, setX]);

	return (
		<animated.div id={`node-${id}`} style={treeNodeProps}>
			<div style={treeNodeStyle}>
				{
                    elementTransitions.map(({ item, key, props }, idx) => (
                        <animated.div key={idx} style={props}>
                            {
                                idx === 0 && (
                                    <div
                                        style={
                                            isLeaf
                                                ? { display: "none" }
                                                : nodeLeftLineStyle
                                        }
                                        className={`node-${id}-${idx}-left`}
                                    >
                                        <div
                                            style={treeLineStyle}
                                            className={`line-${id}-${idx}-left`}
                                        ></div>
                                    </div>
                                )
                            }
                            <div style={elementStyle} id={`element-${id}-${idx}`}>
                                {item}
                            </div>
                            <div
                                style={
                                    isLeaf
                                        ? { display: "none" }
                                        : nodeRightLineStyle
                                }
                                className={`node-${id}-${idx}-right node-${id}-${idx + 1}-left`}
                            >
                                <div
                                    style={treeLineStyle}
                                    className={`line-${id}-${idx}-right line-${id}-${idx + 1}-left`}
                                ></div>
                            </div>
                        </animated.div>
                    ))
                }
			</div>
		</animated.div>
	);
}

export default React.memo(TreeNode);
