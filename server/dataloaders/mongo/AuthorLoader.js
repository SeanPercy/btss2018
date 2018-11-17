import DataLoader from "dataloader/index";
import config from "../../../config";
import mongo from "then-mongo/index";

async function batchAuthors(authors, keys) {
	console.log('B');
	console.log(keys);
	return authors.find( {_id: {$in: keys}} ).toArray();
}

export const AuthorLoader = (Authors) => {
	console.log('D');
	return new DataLoader(
		keys => batchAuthors(Authors, keys),
		{cacheKeyFn: key => key.toString()},
	);
};