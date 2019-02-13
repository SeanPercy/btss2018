import React from "react";

import * as logo from "./GraphQL_Logo.png";
import "./style.scss";

export interface IPropsInterface {
    counter: number;
}
const SubView: React.FC<IPropsInterface> = ({ counter }) => (
    <>
        <div className="alert alert-info">
            This is a subview created when the counter was {counter}
        </div>
        <p className="stub">This is just a stub for now</p>
        <img src={logo}/>

    </>
);
export default SubView;
