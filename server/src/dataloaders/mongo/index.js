import DataLoader from 'dataloader/index';

export default function({db, collection}) {
	return new DataLoader(
		keys => db
			.collection(collection)
			.find({_id: {$in: keys}})
			.toArray(),
		{ cacheKeyFn: key => key.toString() },
	);
}
