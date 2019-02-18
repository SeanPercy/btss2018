// tslint:disable:no-console
import { DocumentNode } from "apollo-link";
import React from "react";
import { Query } from "react-apollo";
import { hot } from "react-hot-loader";

const bookListQuery: DocumentNode = require("../../graphql/queries/book-list.graphql");

export interface IAppPropsInterface {}
export interface IAppStateInterface {
    counter: number;
    subView: JSX.Element | null;
}

class App extends React.Component<IAppPropsInterface, IAppStateInterface> {
    public state = {
        counter: 0,
        subView: null,
    };

    public render(): JSX.Element {
        return (
            <Query query={bookListQuery}>
                {({ loading, error, data : { allBooks} }) => {
                    if (loading) return <div>Fetching</div>;
                    if (error) return <div>Error</div>;

                    return (
                        <>
                            <div>Here are the Books</div>
                            <ol>
                                {allBooks.map(book => <li key={book._id}>{book.title}</li>)}
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

    private incrementCounter = (): void => {
        this.setState({ counter: this.state.counter + 1 });
    };
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
