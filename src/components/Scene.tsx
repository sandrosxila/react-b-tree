import React, { useState, useEffect, FC } from 'react';
import { useSelector } from 'react-redux';
import Level from './tree-nodes/Level';
import { themeParams, setXById } from '../constants/constants';
import useWindowSize from '@rooks/use-window-size';
import { RootState } from '..';

type Props = {
    headerHeight: number
}

const Scene: FC<Props> = ({ headerHeight }) => {
    const levels = useSelector((state: RootState) => state.tree);
    const themeIndex = useSelector((state: RootState) => state.theme);
    const { sceneBackgroundClass } = themeParams[themeIndex];
    const { innerHeight } = useWindowSize();
    const [sceneHeight, setSceneHeight] = useState(0);

    const sceneStyle: React.CSSProperties = {
        position: 'relative',
        height: `${sceneHeight}px`,
        overflowX: 'auto'
    };

    useEffect(() => {
        if(innerHeight)
            setSceneHeight(innerHeight - headerHeight);
    }, [innerHeight, headerHeight]);

    return (
        <div className={ sceneBackgroundClass } style={ sceneStyle } id="scene">
            {
                levels.map((level, key) => (
                    <Level
                        key={ key }
                        levels={ levels }
                        themeIndex={ themeIndex }
                        clusters={ level }
                        level={ key }
                        isLeaf={ levels.length - 1 === key }
                        setXById={ setXById }
                    />
                ))
            }

        </div>
    );
};

export default Scene;