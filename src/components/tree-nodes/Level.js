import React, {useState, useEffect} from 'react';
import useMeasure from 'react-use-measure';
import {animated, useSpring} from 'react-spring';
import Cluster from "./Cluster";
import {initialWindow} from "../../constants/constants";

function Level({levels, themeIndex, level, clusters, isLeaf, boundsById, setXById}) {

    const [ref, bounds] = useMeasure();

    const [x, setX] = useState(initialWindow.width / 2);
    const y = 5 + level * (initialWindow.height / 8);

    const treeLevelProps = useSpring(
        {
            opacity: 1,
            position: 'absolute',
            transform: `translate3d(${isLeaf ? Math.max(0, x) : 0}px,${y}px,0)`,
            lineHeight: `${initialWindow.height / 2 / 7.5 / 1.5}px`,
            height: `${initialWindow.height / 15}px`,
            config: {duration: isLeaf ? 735 : 0},
            from: {
                opacity: 0,
            }
        }
    );

    useEffect(() => {
        if (isLeaf) {
            setX(Math.max(bounds.width / 2, initialWindow.width / 2));
        }
        setX((initialWindow.width / 2) - (bounds.width / 2));
    }, [bounds, isLeaf, level]);


    return (
        <animated.div className="row flex-nowrap" id={`level-${level}`} ref={ref} style={treeLevelProps}>
            {
                clusters.map((cluster, key) => (
                    <Cluster
                        key={key}
                        levels={levels}
                        themeIndex={themeIndex}
                        setXById={setXById}
                        boundsById={boundsById}
                        level={level}
                        cluster={key}
                        nodes={cluster}
                        isLeaf={isLeaf}
                    />
                ))
            }
        </animated.div>
    );
}

export default React.memo(Level);