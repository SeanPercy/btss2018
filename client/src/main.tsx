import React from "react";
import ReactDom from "react-dom";
import App from "./App";
import registerServiceWorker from './registerServiceWorker';

import "./styles/app.scss";

let root = document.getElementById("root");
if (!root) {
    root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
}

ReactDom.render(<App />, root);

registerServiceWorker();
