import React from "react";
import { compose, graphql } from "react-apollo";

import STAFF_LIST_QUERY from "graphql/queries/staff-list.graphql";
import STAFF_CREATED_SUB from "graphql/subscriptions/staff-created.graphql";
import { getPropsAndOptions, renderForError, renderWhileLoading } from "helpers";


export interface IStaffListPropsInterface {
    allStaff: Array<{_id: string, fullName: string, age: number}>
    subscribeToNewItems: () => void,
}

class StaffList extends React.Component<IStaffListPropsInterface,{}> {
    public componentDidMount() {
        this.props.subscribeToNewItems();
    }

    public render(): JSX.Element {
        return (
            <ol>
                {this.props.allStaff.map(staff => <li key={staff._id}>{staff.fullName}</li>)}
            </ol>
        )
    }
}

export default compose(
    graphql(
        STAFF_LIST_QUERY,
        getPropsAndOptions(STAFF_CREATED_SUB, 'staffCreated', 'allStaff')
    ),
    renderWhileLoading(),
    renderForError()
)(StaffList);
