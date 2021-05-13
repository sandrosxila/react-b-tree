import React, {useState} from 'react';
import ThemeVariant from "./ThemeVariant";
import {grads} from '../../constants/constants'
import {useSelector} from "react-redux";

function ThemePicker(props) {
    const [toggle, setToggle] = useState(false);
    const [clickedOnce, setClickedOnce] = useState(false);
    const themeIndex = useSelector(state => state.theme);

    return (
        <div style={{
            display: 'grid',
            gridTemplate: '1fr / 1fr',
            placeItems: 'center',
            height: '1.2rem',
            width: '1.2rem'
        }}>
            {
                [...grads.slice(0, themeIndex), ...grads.slice(themeIndex + 1), grads[themeIndex]].map((color, idx) => {
                    return (
                        <ThemeVariant
                            key={idx}
                            color={color}
                            defaultWidth={1.2}
                            maximalWidth={1.5}
                            index={idx}
                            priority={grads.length - 1 - idx}
                            toggle={toggle}
                            setToggle={setToggle}
                            clickedOnce={clickedOnce}
                            setClickedOnce={setClickedOnce}
                            actualIndex={idx === grads.length - 1 ? themeIndex : idx < themeIndex ? idx : idx + 1}
                        />
                    )
                })
            }
        </div>
    );
}

export default ThemePicker;