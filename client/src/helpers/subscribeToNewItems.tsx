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
