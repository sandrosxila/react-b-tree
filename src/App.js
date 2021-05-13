import React, {useState, useEffect} from "react";
import {initialWindow} from "./constants/constants";
import Scene from "./components/Scene";
import Header from "./components/layout/Header";
import './App.css';

function App() {
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        initialWindow.height = window.innerHeight;
        initialWindow.width = window.innerWidth;
    },[]);

    return (
        <div>
            <Header
                headerHeightSetter={setHeaderHeight}
            />
            <Scene
                headerHeight={headerHeight}
            />
        </div>
    );
}

export default App;
