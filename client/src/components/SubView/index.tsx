import React from "react";

import * as logo from "./GraphQL_Logo.png";
import "./style.scss";

export interface ISubviewPropsInterface {
    counter: number;
}

const SubView: React.FC<ISubviewPropsInterface> = ({ counter }) => (
    <>
        <div className="alert alert-info">
            This is a subview created when the counter was {counter}
        </div>
        <p className="stub">It serves as an example for Dynamic Imports</p>
        <img src={logo}/>
    </>
);
export default SubView;
