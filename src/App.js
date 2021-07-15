import React, {useState} from "react";
import Scene from "./components/Scene";
import Header from "./components/layout/Header";
import './App.css';
import Footer from "./components/layout/Footer";
import useWindowSize from "@rooks/use-window-size";

function App() {
    const [headerHeight, setHeaderHeight] = useState(0);

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
