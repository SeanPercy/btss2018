import { compose, graphql } from 'react-apollo';

import { AuthorList } from 'components/AuthorList';
import AUTHOR_LIST_QUERY from 'graphql/queries/author-list.graphql';
import AUTHOR_CREATED_SUB from 'graphql/subscriptions/author-created.graphql';
import AUTHOR_UPDATED_SUB from 'graphql/subscriptions/author-updated.graphql';
import {
  _subscribeToNewItems,
  _subscribeToUpdatedItems,
  renderForError,
  renderWhileLoading
} from 'helpers';

const getOptionsAndProps = (collection: string) => ({
  options: {
    pollInterval: 30000
  },
  props: ({ data }: any) => {
    const subscribeToNewItems = _subscribeToNewItems(
      data,
      AUTHOR_CREATED_SUB,
      'authorCreated',
      collection
    );
    const subscribeToUpdatedItems = _subscribeToUpdatedItems(
      data,
      AUTHOR_UPDATED_SUB,
      'authorUpdated',
      collection
    );
    return {
      ...data,
      [collection]: data[collection] ? data[collection] : [],
      subscribeToNewItems,
      subscribeToUpdatedItems
    };
  }
});

export default compose(
  graphql(AUTHOR_LIST_QUERY, getOptionsAndProps('allAuthors')),
  renderWhileLoading(),
  renderForError()
)(AuthorList);
