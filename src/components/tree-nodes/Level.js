import React, {useState, useEffect} from 'react';
import useMeasure from 'react-use-measure';
import {animated, useSpring} from 'react-spring';
import Cluster from "./Cluster";
import useWindowSize from '@rooks/use-window-size';

function Level({levels, themeIndex, level, clusters, isLeaf, boundsById, setXById}) {

    const [ref, bounds] = useMeasure();

    const {innerWidth, innerHeight} = useWindowSize();

    const [x, setX] = useState(innerWidth / 2);
    const y = 5 + level * (innerHeight / 8);

    const treeLevelProps = useSpring(
        {
            opacity: 1,
            position: 'absolute',
            transform: `translate3d(${isLeaf ? Math.max(0, x) : 0}px,${y}px,0)`,
            lineHeight: `${innerHeight / 2 / 7.5 / 1.5}px`,
            height: `${innerHeight / 15}px`,
            display:"flex",
            flexWrap:"nowrap",
            config: {duration: isLeaf ? 735 : 0},
            from: {
                opacity: 0,
            }
        }
    );

    useEffect(() => {
        if (isLeaf) {
            setX(Math.max(bounds.width / 2, innerWidth / 2));
        }
        setX((innerWidth / 2) - (bounds.width / 2));
    }, [bounds, isLeaf, level, innerWidth]);


    return (
        <animated.div id={`level-${level}`} ref={ref} style={treeLevelProps}>
            {
                clusters.map((cluster, key) => 
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
                        levelX = {x}
                        levelWidth = {bounds.width}
                    />
                )
            }
        </animated.div>
    );
}

export default React.memo(Level);