export default function* dateGenerator() {
	let startDate = new Date("2010-01-01");
	let index = 0;
	while(index < 100){
		yield startDate;
		startDate.setMonth(startDate.getMonth() + 3);
		startDate.setDate(startDate.getDate() + 7);
		index++;
	}
}
