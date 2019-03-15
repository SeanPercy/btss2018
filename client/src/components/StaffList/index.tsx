import React from 'react';
import { compose, graphql } from 'react-apollo';

import STAFF_LIST_QUERY from 'graphql/queries/staff-list.graphql';
import STAFF_CREATED_SUB from 'graphql/subscriptions/staff-created.graphql';
import {
  _subscribeToNewItems,
  renderForError,
  renderWhileLoading
} from 'helpers';

export interface IStaffListPropsInterface {
  allStaff: Array<{ _id: string; fullName: string; age: number }>;
  subscribeToNewItems: () => void;
}

class StaffList extends React.Component<IStaffListPropsInterface, {}> {
  public componentDidMount() {
    this.props.subscribeToNewItems();
  }

  public render(): JSX.Element {
    return (
      <ol>
        {this.props.allStaff.map(staff => (
          <li key={staff._id}>{staff.fullName}</li>
        ))}
      </ol>
    );
  }
}

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
