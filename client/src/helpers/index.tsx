import React from 'react';
import { branch, renderComponent } from 'recompose';

const LoadingComponent = () => <div>... LOADING ...</div>;
export const renderWhileLoading = () =>
  branch(({ loading }) => loading, renderComponent(LoadingComponent));

const ErrorComponent = error => <div>{error.message}</div>;
export const renderForError = () =>
  branch(
    ({ error }) => error,
    renderComponent(({ error }) => ErrorComponent(error))
  );

export const _subscribeToNewItems = (
  data: any,
  SUBSCRIPTION_QUERY: string,
  event: string,
  collection: string
) => () => {
  data.subscribeToMore({
    document: SUBSCRIPTION_QUERY,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) {
        return prev;
      }
      return {
        [collection]: [...prev[collection], subscriptionData.data[event]]
      };
    }
  });
};

export const _subscribeToUpdatedItems = (data: any, SUBSCRIPTION_QUERY: string, event: string, collection: string
) => () => {
  data.subscribeToMore({
    document: SUBSCRIPTION_QUERY,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) {
        return prev;
      }
      const updatedItem = subscriptionData.data[event];
      const items = prev[collection];

      // check if the updated item is currently part of the view
      const index = items.findIndex(item => item._id !== updatedItem._id);

      // if it is part of the view, update the corresponding item, before eventually returning the
      if (index) {
        items[index] = updatedItem;
      }
      return {
        [collection]: items
      };
    }
  });
};

/*
For further abstraction

export const getPropsAndOptions = (subscription: string, itemCreated: string, collection: string) => ({
    props: (props) => {
        const { data } = props;
        const subscribeToNewItems = _subscribeToNewItems(data, subscription, itemCreated, collection);

        return ({
            ...data,
            [collection]: data[collection] ? data[collection] : [],
            subscribeToNewItems,
        })
    }
});

*/
