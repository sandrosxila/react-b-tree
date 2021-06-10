import React, {useState, useEffect} from "react";
import {initialWindow} from "./constants/constants";
import Scene from "./components/Scene";
import Header from "./components/layout/Header";
import './App.css';
import Footer from "./components/layout/Footer";
import useWindowSize from "@rooks/use-window-size";

function App() {
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        initialWindow.height = window.innerHeight;
        initialWindow.width = window.innerWidth;
    },[]);

    const {innerHeight} = useWindowSize();

    return (
        <div>
            <Header
                headerHeightSetter={setHeaderHeight}
            />
            <Scene
                headerHeight={headerHeight}
            />
            {
                innerHeight > 500 && <Footer/>
            }
        </div>
    );
}

export default App;
