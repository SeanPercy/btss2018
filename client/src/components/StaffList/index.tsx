import React from "react";
import { Query } from "react-apollo";
import {DocumentNode} from "apollo-link";

const staffListQuery: DocumentNode = require("../../graphql/queries/staff-list.graphql");
const staffCreatedSubscription: DocumentNode = require("../../graphql/subscriptions/staff-created.graphql");

class StaffList extends React.Component<{},{}> {

    public render(): JSX.Element {
        return (
            <Query query={staffListQuery}>
                {({ loading, error, data : { allStaff }, subscribeToMore }) => {
                    if (loading) return <div>Fetching</div>;
                    if (error) return <div>Error</div>;

                    this._subscribeToNewStaff(subscribeToMore);

                    return (
                        <ol>
                            {allStaff.map(staff => <li key={staff._id}>{staff.fullName}</li>)}
                        </ol>
                    )
                }}
            </Query>
        )
    }

    private _subscribeToNewStaff = subscribeToMore => {
        subscribeToMore({
            document: staffCreatedSubscription,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data.staffCreated) return prev;
                const newStaff = subscriptionData.data.staffCreated;

                return Object.assign({}, prev, {
                    allStaff: [newStaff, ...prev.allStaff]
                });
            }
        })
    }

}

export default StaffList;
