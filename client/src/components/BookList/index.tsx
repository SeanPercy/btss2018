import React from 'react';

export interface IBookListPropsInterface {
  books: Array<{ _id: string; title: string }>;
  subscribeToNewItems: () => void;
  loadMoreBooks: () => void;
}

export class BookList extends React.Component<IBookListPropsInterface, {}> {
  public componentDidMount() {
    this.props.subscribeToNewItems();
  }

  public render(): JSX.Element {
    return (
      <>
        <ol>
          {this.props.books.map(book => (
            <li key={book._id}>{book.title}</li>
          ))}
        </ol>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => this.props.loadMoreBooks()}
        >
          Load More Books
        </button>
      </>
    );
  }
}
