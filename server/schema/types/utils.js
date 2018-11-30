import { PubSub } from 'apollo-server-express';

/// AUTH
export { getUser, APP_SECRET } from '../../utils';

/// SUBSCRIPTIONS
export const pubsub = new PubSub();
export const MESSAGE_CREATED = 'MESSAGE_CREATED';
export const BOOK_CREATED = 'BOOK_CREATED';

/// FILTERS
export const buildFilters = ({OR = [], content_contains, info_contains})=> {
	const filter = (content_contains || info_contains) ? {} : null;
	if (content_contains) {
		filter.content = {$regex: `.*${content_contains}.*`};
	}
	if (info_contains) {
		filter.info = {$regex: `.*${info_contains}.*`};
	}
	
	let filters = filter ? [filter] : [];
	for (let i = 0; i < OR.length; i++) {
		filters = filters.concat(buildFilters(OR[i]));
	}
	return filters;
};
