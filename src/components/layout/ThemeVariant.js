import React, {useState} from 'react';
import {useSpring, animated, config} from "react-spring";
import {change} from "../../actions/index";
import {useDispatch} from "react-redux";

const ThemeVariant = ({
                          color,
                          defaultWidth,
                          maximalWidth,
                          index,
                          priority,
                          toggle,
                          setToggle,
                          clickedOnce,
                          setClickedOnce,
                          actualIndex
                      }) => {

    const dispatch = useDispatch();

    const [mustDisappear, setMustDisappear] = useState(false);

    const {o} = useSpring({
        from: {o: 0},
        o: 1,
        config: {duration: 500, ...config.molasses},
        reverse: !toggle,
        onFrame() {
            setMustDisappear(o.value === 0 && priority !== 0);
        }
    });

    const themeVariantStyle = {
        height: '1.2rem',
        background: color,
        width: `${defaultWidth}rem`,
        transform: clickedOnce ? o.interpolate({range: [0, 1], output: [0, maximalWidth]})
            .interpolate(o => `translate(-${o * priority}rem,0) rotateZ(-${o * 270}deg)`) : '',
        position: 'absolute',
        gridColumn: '1 / 1',
        gridRow: '1 / 1',
        zIndex: index,
        borderRadius: '100%',
        display: mustDisappear ? 'none ' : 'block'
    };

    const onThemeVariantClick = () => {
        setToggle(!toggle);
        setClickedOnce(true);
        dispatch(change(actualIndex));
    };

    return (
        <animated.div style={themeVariantStyle} onClick={onThemeVariantClick}>

        </animated.div>
    );
};

export default ThemeVariant;