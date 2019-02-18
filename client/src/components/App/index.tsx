// tslint:disable:no-console
import React from "react";
import { hot } from "react-hot-loader";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AuthorList from "components/AuthorList";
import BookList from "components/BookList";
import Header from "components/Header";
import Home from "components/Home";
import StaffList from "components/StaffList";

export interface IAppPropsInterface {}
export interface IAppStateInterface {}

class Index extends React.Component<IAppPropsInterface, IAppStateInterface> {

    public render(): JSX.Element {
        return (
            <BrowserRouter>
            <>
                <Header />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/authors" component={AuthorList} />
                    <Route exact path="/books" component={BookList} />
                    <Route exact path="/staff" component={StaffList} />
                </Switch>
            </>
            </BrowserRouter>
        )
    }
}

export default hot(module)(Index);
