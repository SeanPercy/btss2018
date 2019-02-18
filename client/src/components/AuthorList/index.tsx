import React from "react";
import { Query } from "react-apollo";
import {DocumentNode} from "apollo-link";

const authorListQuery: DocumentNode = require("../../graphql/queries/author-list.graphql");
const authorCreatedSubscription: DocumentNode = require("../../graphql/subscriptions/author-created.graphql");

export interface IAuthorListPropsInterface {}
export interface IAuthorListStateInterface {}

class AuthorList extends React.Component<IAuthorListPropsInterface, IAuthorListStateInterface> {

    public render(): JSX.Element {
        return (
            <Query query={authorListQuery}>
                {({ loading, error, data : { allAuthors }, subscribeToMore }) => {
                    if (loading) return <div>Fetching</div>;
                    if (error) return <div>Error</div>;

                    this._subscribeToNewAuthors(subscribeToMore);

                    return (
                        <ol>
                            {allAuthors.map(author => <li key={author._id}>{author.fullName}</li>)}
                        </ol>
                    )
                }}
            </Query>
        )
    }

    private _subscribeToNewAuthors = subscribeToMore => {
        subscribeToMore({
            document: authorCreatedSubscription,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data.authorCreated) return prev;
                const newAuthor = subscriptionData.data.authorCreated;

                return Object.assign({}, prev, {
                    allAuthors: [newAuthor, ...prev.allAuthors]
                });
            }
        })
    }

}

export default AuthorList;
