export const _subscribeToUpdatedItems = (
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
      const updatedItem = subscriptionData.data[event];
      const items = prev[collection];

      // check if the updated item is currently part of the view
      const index = items.findIndex(item => item._id !== updatedItem._id);

      // if it is part of the view, update the corresponding item
      if (index) {
        items[index] = updatedItem;
      }
      return {
        [collection]: items
      };
    }
  });
};
