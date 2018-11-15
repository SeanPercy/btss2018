import DataLoader from "dataloader/index";

async function batchBooks (Books, keys) {
	return await keys.map( author => {
		return author.map( bookId => {
			return Books.findOne( {_id: bookId} );
		})
	});
}

export const BooksLoader = (Books) => {
	return new DataLoader(
		keys => batchBooks(Books, keys),
		{cacheKeyFn: key => key.toString()},
	);
};