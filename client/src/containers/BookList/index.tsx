import { compose, graphql } from 'react-apollo';

import { BookList } from 'components/BookList';
import BOOK_LIST_QUERY from 'graphql/queries/books.graphql';
import BOOK_CREATED_SUB from 'graphql/subscriptions/book-created.graphql';
import {
  _subscribeToNewItems,
  renderForError,
  renderWhileLoading
} from 'helpers';

const getOptionsAndProps = (collection: string) => ({
  options: {
    variables: {
      limit: 10,
      skip: 0
    }
  },
  props: props => {
    const { data } = props;
    const subscribeToNewItems = _subscribeToNewItems(
      data,
      BOOK_CREATED_SUB,
      'bookCreated',
      collection
    );
    return {
      ...data,
      [collection]: data[collection] ? data[collection] : [],
      loadMoreBooks: () =>
        data.fetchMore({
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return {
              [collection]: [
                ...prev[collection],
                ...fetchMoreResult[collection]
              ]
            };
          },
          variables: {
            skip: data[collection].length
          }
        }),
      subscribeToNewItems
    };
  }
});

export default compose(
  graphql(BOOK_LIST_QUERY, getOptionsAndProps('books')),
  renderWhileLoading(),
  renderForError()
)(BookList);
