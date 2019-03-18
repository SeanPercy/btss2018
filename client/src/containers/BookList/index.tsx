import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

import { BookList } from 'components/BookList';
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

const BOOK_LIST_QUERY = gql`
  query($skip: Int, $limit: Int) {
    books(skip: $skip, limit: $limit) {
      _id
      title
    }
  }
`;

export default compose(
  graphql(BOOK_LIST_QUERY, getOptionsAndProps('books')),
  renderWhileLoading(),
  renderForError()
)(BookList);
