import React from "react";
import { Query } from "react-apollo";
import {DocumentNode} from "apollo-link";

const bookListQuery: DocumentNode = require("../../graphql/queries/book-list.graphql");
const bookCreatedSubscription: DocumentNode = require("../../graphql/subscriptions/book-created.graphql");

export interface IBooksListPropsInterface {}
export interface IBookListStateInterface {}

class BookList extends React.Component<IBooksListPropsInterface, IBookListStateInterface> {

    public render(): JSX.Element {
        return (
            <Query query={bookListQuery}>
                {({ loading, error, data : { allBooks }, subscribeToMore }) => {
            if (loading) return <div>Fetching</div>;
            if (error) return <div>Error</div>;

            this._subscribeToNewBooks(subscribeToMore);

            return (
                <ol>
                    {allBooks.map(book => <li key={book._id}>{book.title}</li>)}
                </ol>
            )
                }}
            </Query>
    )
    }

    private _subscribeToNewBooks = subscribeToMore => {
        subscribeToMore({
            document: bookCreatedSubscription,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data.bookCreated) return prev;
                const newBook = subscriptionData.data.bookCreated;

                return Object.assign({}, prev, {
                    allBooks: [newBook, ...prev.allBooks]
                });
            }
        })
    }

}

export default BookList;