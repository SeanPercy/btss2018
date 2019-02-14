// tslint:disable:no-console
import gql from "graphql-tag";
import React from "react";
import { hot } from "react-hot-loader";
import {Query} from "react-apollo";

export interface IAppPropsInterface {}
export interface IAppStateInterface {
    counter: number;
    subView: JSX.Element | null;
}

const BOOKS_QUERY = gql`
    query {
        allBooks {
            title
        }
    }`;

class App extends React.Component<IAppPropsInterface, IAppStateInterface> {
    public state = {
        counter: 0,
        subView: null,
    };

    public render(): JSX.Element {
        return (
            <Query query={BOOKS_QUERY}>
                {({ loading, error, data }) => {
                    if (loading) return <div>Fetching</div>;
                    if (error) return <div>Error</div>;

                    const booksToRender = data.allBooks;
                    return (
                        <>
                            <div>Here are the Books</div>
                            <ol>
                                {booksToRender.map(book => <li key={book._id}>{book.title}</li>)}
                            </ol>
                            <div className="container">I am a container!</div>
                            Counter: {this.state.counter}
                            <br />
                            <button type="button" className="btn btn-primary" onClick={this.incrementCounter}>
                                add
                            </button>
                            <br />
                            <button type="button" className="btn btn-secondary" onClick={this.addSubView}>
                                add sub view
                            </button>
                            {this.state.subView}
                        </>
                    )
                }}
            </Query>
        )
    }
    /*
    public render(): JSX.Element {
        return (
            <div>
                <div className="container">I am a container!</div>
                Counter: {this.state.counter}
                <br />
                <button type="button" className="btn btn-primary" onClick={this.incrementCounter}>
                    add
                </button>
                <br />
                <button type="button" className="btn btn-secondary" onClick={this.addSubView}>
                    add sub view
                </button>
                {this.state.subView}
            </div>
        );
    }*/

    private incrementCounter = (): void => {
        this.setState({ counter: this.state.counter + 1 });
    }
    // , webpackPrefetch: true
    private addSubView = (): void => {
        import(/* webpackChunkName: "SubView" */ "../SubView/index")
            .then((module) => {
                const Component = module.default;
                this.setState({
                    subView: <Component counter={this.state.counter} />,
                });
            })
            .catch((error) => console.error(error));
    }
}

export default hot(module)(App);
