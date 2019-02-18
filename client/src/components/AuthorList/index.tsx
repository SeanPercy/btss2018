import gql from "graphql-tag";
import React from "react";
import { Query } from "react-apollo";

export interface IAuthorListPropsInterface {}
export interface IAuthorListStateInterface {}

const AUTHORS_QUERY = gql`
   query {
        allAuthors {
            _id
            fullName
            age
        }
    }`;

const AUTHOR_CREATED = gql`
    subscription {
        authorCreated {
            _id
            firstName
            lastName
            fullName
            age
            sex
            retired
        }
    }
`;

class AuthorList extends React.Component<IAuthorListPropsInterface, IAuthorListStateInterface> {

    public render(): JSX.Element {
        return (
            <Query query={AUTHORS_QUERY}>
                {({ loading, error, data : { allAuthors }, subscribeToMore }) => {
                    if (loading) return <div>Fetching</div>;
                    if (error) return <div>Error</div>;

                    this._subscribeToNewAuthors(subscribeToMore);

                    return (
                        <>
                            <div>Here is the list</div>
                            <ol>
                                {allAuthors.map(author => <li key={author._id}>{author.fullName}</li>)}
                            </ol>
                        </>
                    )
                }}
            </Query>
        )
    }

    private _subscribeToNewAuthors = subscribeToMore => {
        subscribeToMore({
            document: AUTHOR_CREATED,
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
