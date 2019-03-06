// tslint:disable:no-console
import React from "react";
import { hot } from "react-hot-loader";
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import AuthorList from "components/AuthorList";
import BookList from "components/BookList";
import Header from "components/Header";
import Home from "components/Home";
import Login from "components/Login";
import StaffList from "components/StaffList";


class App extends React.Component<{}, {}> {

    public render(): JSX.Element {
        return (
            <BrowserRouter>
            <>
                <Header />
                <Switch>
                    <Route exact={true} path="/" component={Home} />
                    <Route exact={true} path="/authors" component={AuthorList} />
                    <Route exact={true} path="/books" component={BookList} />
                    <Route exact={true} path="/staff" component={StaffList} />
                    <Route exact={true} path="/login" component={Login} />
                </Switch>
            </>
            </BrowserRouter>
        )
    }
}

export default hot(module)(App);
