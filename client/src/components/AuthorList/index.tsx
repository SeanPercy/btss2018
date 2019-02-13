import gql from "graphql-tag";
import React from "react";
import { Query } from 'react-apollo';

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
                {({ loading, error, data, subscribeToMore }) => {
                    if (loading) return <div>Fetching</div>;
                    if (error) return <div>Error</div>;

                    this._subscribeToNewMessages(subscribeToMore);

                    const authorsToRender = data.allAuthors;
                    return (
                        <>
                            <div>Here is the list</div>
                            <ol>
                                {authorsToRender.map(author => <li key={author._id}>{author.fullName}</li>)}
                            </ol>
                        </>
                    )
                }}
            </Query>
        )
    }

    private _subscribeToNewMessages = subscribeToMore => {
        subscribeToMore({
            document: AUTHOR_CREATED,
            updateQuery: (prev, { subscriptionData }) => {
                console.log(prev);
                console.log(subscriptionData.data.authorCreated);
                if (!subscriptionData.data.authorCreated) return prev;
                const newAuthor = subscriptionData.data.authorCreated;
                console.log(newAuthor);
                return Object.assign({}, prev, {
                    allAuthors: [newAuthor, ...prev.allAuthors]
                });
            }
        })
    }

}

export default AuthorList;
