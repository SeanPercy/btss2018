import DataLoader from "dataloader/index";

async function batchSuperiors (Staff, keys) {
	return await Staff.find( {_id: {$in: keys}} ).toArray();
}

export const SuperiorLoader = (Staff) => {
	return new DataLoader(
		keys => batchSuperiors(Staff, keys),
		{cacheKeyFn: key => key.toString()},
	);
};