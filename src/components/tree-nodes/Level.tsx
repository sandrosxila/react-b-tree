import React, { useState, useEffect, FC, useMemo } from 'react';
import useMeasure from 'react-use-measure';
import { animated, useSpring } from 'react-spring';
import Cluster from './Cluster';
import useWindowSize from '@rooks/use-window-size';

type Props = {
    levels: Levels,
    themeIndex: number,
    level: number,
    clusters: Levels[number],
    isLeaf: boolean,
    setXById: { [key in string]?: (x: number) => void } 
}

const Level: FC<Props> = ({ levels, themeIndex, level, clusters, isLeaf, setXById }) => {

    const [ref, bounds] = useMeasure();

    const { innerWidth, innerHeight } = useWindowSize();

    const [x, setX] = useState(0);

    useEffect(() => {
        if(innerWidth){
            setX(innerWidth / 2);
        }
    }, [innerWidth]);

    const y = useMemo(() => {
        if(innerHeight)
            return 5 + level * (innerHeight / 8);
        return 5;
    }, [innerHeight, level]);

    const treeLevelProps = useSpring(
        {
            opacity: 1,
            position: 'absolute',
            transform: `translate3d(${isLeaf ? Math.max(0, x) : 0}px,${y}px,0)`,
            lineHeight: `${innerHeight !== null ? innerHeight / 2 / 7.5 / 1.5 : 0}px`,
            height: `${innerHeight !== null ? innerHeight / 15 : 0}px`,
            display:'flex',
            flexWrap:'nowrap',
            config: { duration: isLeaf ? 735 : 0 },
            from: {
                opacity: 0,
            }
        } as React.CSSProperties
    );

    useEffect(() => {
        if (isLeaf && innerWidth) {
            setX(Math.max(bounds.width / 2, innerWidth / 2));
        }
        if(innerWidth)
            setX((innerWidth / 2) - (bounds.width / 2));
    }, [bounds, isLeaf, level, innerWidth]);


    return (
        <animated.div id={ `level-${level}` } ref={ ref } style={ treeLevelProps }>
            {
                clusters.map((cluster, key) => (
                    <Cluster
                        key={ key }
                        levels={ levels }
                        themeIndex={ themeIndex }
                        setXById={ setXById }
                        level={ level }
                        cluster={ key }
                        nodes={ cluster }
                        levelX = { x }
                        levelWidth = { bounds.width }
                    />
                )
                )
            }
        </animated.div>
    );
};

export default React.memo(Level);