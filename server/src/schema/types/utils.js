import { PubSub } from 'apollo-server-express';

// / AUTH
export { getUser, APP_SECRET } from '../../helpers/utils';

// / SUBSCRIPTIONS
export const pubsub = new PubSub();
export const AUTHOR_CREATED = 'AUTHOR_CREATED';
export const AUTHOR_UPDATED = 'AUTHOR_UPDATED';
export const BOOK_CREATED = 'BOOK_CREATED';
export const STAFF_CREATED = 'STAFF_CREATED';

// / FILTERS
export const buildFilters = ({ OR = [], contentContains, infoContains }) => {
  const filter = contentContains || infoContains ? {} : null;
  if (contentContains) {
    filter.content = { $regex: `.*${contentContains}.*` };
  }
  if (infoContains) {
    filter.info = { $regex: `.*${infoContains}.*` };
  }

  let filters = filter ? [filter] : [];
  for (let i = 0; i < OR.length; i++) {
    filters = filters.concat(buildFilters(OR[i]));
  }
  return filters;
};

export const notAuthorized = () => new Error('Not Authorized');
