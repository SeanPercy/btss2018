import React from "react";
import { compose, graphql } from "react-apollo";

import AUTHOR_LIST_QUERY from "graphql/queries/author-list.graphql";
import AUTHOR_CREATED_SUB from "graphql/subscriptions/author-created.graphql";
import AUTHOR_UPDATED_SUB from "graphql/subscriptions/author-updated.graphql";
import {_subscribeToNewItems, _subscribeToUpdatedItems, renderForError, renderWhileLoading} from "helpers";

export interface IAuthorListPropsInterface {
    allAuthors: Array<{_id: string, fullName: string, age: number}>
    subscribeToNewItems: () => void,
    subscribeToUpdatedItems: () => void
}

class AuthorList extends React.Component<IAuthorListPropsInterface, {    allAuthors: Array<{_id: string, fullName: string, age: number}>
}> {
    public constructor(props){
        super(props);
        this.state={
            allAuthors: []
        }
    }

    public componentDidMount() {
        this.setState({allAuthors: this.props.allAuthors})
        this.props.subscribeToNewItems();
        this.props.subscribeToUpdatedItems();
    }

    public render(): JSX.Element {
        return (
            <ol>
                {this.props.allAuthors.map(author => <li key={author._id}>{author.fullName}</li>)}
            </ol>
        )
    }
/*
    public static getDerivedStateFromProps(props, state) {
        console.log('DERIVED');
        function removeDuplicates(myArr, prop) {
            return myArr.filter((obj, pos, arr) => {
                return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
            });
        }

        const authors = removeDuplicates(props.allAuthors, '_id');

            return {
                allAuthors: authors,
            }

    }*/

}

const getOptionsAndProps = (collection: string) => {

    return {
        options:{
            pollInterval: 30000,
        },
        props: ({ data }: any) => {
            const subscribeToNewItems = _subscribeToNewItems(data, AUTHOR_CREATED_SUB, 'authorCreated', collection);
            const subscribeToUpdatedItems = _subscribeToUpdatedItems(data, AUTHOR_UPDATED_SUB, 'authorUpdated', collection);
            return ({
                ...data,
                [collection]: data[collection] ? data[collection] : [],
                subscribeToNewItems,
                subscribeToUpdatedItems
            })
        }

    };
};


export default compose(
    graphql(
        AUTHOR_LIST_QUERY,
        getOptionsAndProps('allAuthors')
    ),
    renderWhileLoading(),
    renderForError()
)(AuthorList);


/*
export default compose(
    graphql(authorListQuery, {
        props: props => {
            console.log('PROPS ', props);
            return ({
                allAuthors: props.data.allAuthors ? props.data.allAuthors : [],
                subscribeToNewItems: params => {
                    props.data.subscribeToMore({
                        document: authorCreatedSubscription,
                        updateQuery: (prev, { subscriptionData }) => {
                            console.log('SUB ',subscriptionData);

                            if (!subscriptionData.data) return prev;
                            return {
                                allAuthors: [
                                    subscriptionData.data.authorCreated,
                                    ...prev.allAuthors
                                ],
                            };
                        },
                    })
                }})
        }
    })
)(AuthorList)
*/