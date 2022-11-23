import React, { Component } from "react";
import "../styles/App.css";
import Header from "./Header";
import Forecast from "./Forecast";

class App extends Component {
    render() {
        return (
            <>
                <Header buttonName = {"Some button updated!!!"} />
                <Forecast />
            </>
            
        );
    }

}
export default App;