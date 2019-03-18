import { compose, graphql } from 'react-apollo';

import { StaffList } from 'components/StaffList';
import STAFF_LIST_QUERY from 'graphql/queries/staff-list.graphql';
import STAFF_CREATED_SUB from 'graphql/subscriptions/staff-created.graphql';
import {
  _subscribeToNewItems,
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
      STAFF_CREATED_SUB,
      'staffCreated',
      collection
    );
    return {
      ...data,
      [collection]: data[collection] ? data[collection] : [],
      subscribeToNewItems
    };
  }
});

export default compose(
  graphql(STAFF_LIST_QUERY, getOptionsAndProps('allStaff')),
  renderWhileLoading(),
  renderForError()
)(StaffList);
