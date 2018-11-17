import DataLoader from "dataloader/index";

async function batch (collection, keys) {
	return await collection.find({_id: {$in: keys}}).toArray();
}

export default function({db, collection}) {
	return new DataLoader(
		keys => batch(db.collection(collection), keys),
		{cacheKeyFn: key => key.toString()},
	);
}
/*
module.exports = (db) =>({
	authorLoader: new DataLoader(
		keys => batch(db.collection('authors'), keys),
		{cacheKeyFn: key => key.toString()},
	),
	superiorLoader: new DataLoader(
		keys => batch(db.collection('staff'), keys),
		{cacheKeyFn: key => key.toString()},
	),
});*/