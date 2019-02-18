import React from "react";

import AuthorList from "components/AuthorList";

import * as logo from "./GraphQL_Logo.png";
import "./style.scss";

export interface IPropsInterface {
    counter: number;
}
const SubView: React.FC<{counter: number}> = ({ counter }) => (
    <>
        <div className="alert alert-info">
            This is a subview created when the counter was {counter}
        </div>
        <AuthorList/>
        <p className="stub">This is just a stub for now</p>
        <img src={logo}/>
    </>
);
export default SubView;
