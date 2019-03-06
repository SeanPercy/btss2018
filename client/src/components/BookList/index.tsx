import React from "react";
import { compose, graphql } from "react-apollo";

// import BOOK_LIST_QUERY from "graphql/queries/book-list.graphql";
import gql from "graphql-tag";
import BOOK_CREATED_SUB from "graphql/subscriptions/book-created.graphql";
import { _subscribeToNewItems, renderForError, renderWhileLoading } from "helpers";


export interface IBookListPropsInterface {
    books: Array<{_id: string, title: string}>
    subscribeToNewItems: () => void,
    loadMoreBooks: () => void
}

class BookList extends React.Component<IBookListPropsInterface, {}> {
    public componentDidMount() {
        this.props.subscribeToNewItems();
    }

    public render(): JSX.Element {
        return (
            <>
                <ol>
                    {this.props.books.map(book => <li key={book._id}>{book.title}</li>)}
                </ol>
                <button type="button" className="btn btn-secondary" onClick={() => this.props.loadMoreBooks()}>
                    Load More Books
                </button>
            </>
        )
    }
}

const getOptionsAndProps = (collection: string) => {

    return {
        options:{
            variables: {
                limit: 10,
                skip: 0,
            }
        },
        props: (props) => {
            const {data} = props;
            const subscribeToNewItems = _subscribeToNewItems(data, BOOK_CREATED_SUB, 'bookCreated', collection);
            return ({
                ...data,
                [collection]: data[collection] ? data[collection] : [],
                loadMoreBooks:() =>
                    data.fetchMore({
                        updateQuery: (prev, { fetchMoreResult }) => {
                            if (!fetchMoreResult) return prev;
                            return {
                                [collection]: [
                                    ...prev[collection],
                                    ...fetchMoreResult[collection]
                                ],
                            };
                        },
                        variables: {
                            skip: data[collection].length
                        },
                    }),
                subscribeToNewItems,
            })
        }

    };
};

const BOOK_LIST_QUERY = gql`
    query($skip: Int, $limit: Int){
    books(skip: $skip, limit:$limit) {
        _id
        title
    }
}`

export default compose(
    graphql(
        BOOK_LIST_QUERY,
        getOptionsAndProps('books')
    ),
    renderWhileLoading(),
    renderForError()
)(BookList);

