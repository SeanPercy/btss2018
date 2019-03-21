import { renderForError } from './ErrorComponent';
import { renderWhileLoading } from './LoadingComponent';
import { _subscribeToNewItems } from './subscribeToNewItems';
import { _subscribeToUpdatedItems } from './subscribeToUpdatedItems';
import { AUTH_TOKEN, dataIdFromObject } from './utils';

export {
  AUTH_TOKEN,
  dataIdFromObject,
  renderForError,
  renderWhileLoading,
  _subscribeToNewItems,
  _subscribeToUpdatedItems
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
