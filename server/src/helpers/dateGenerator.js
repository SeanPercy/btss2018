export default function* dateGenerator() {
  const startDate = new Date('2010-01-01');
  let index = 0;
  while (index < 100) {
    yield startDate;
    startDate.setMonth(startDate.getMonth() + 3);
    startDate.setDate(startDate.getDate() + 7);
    index += 1; // eslint friendly version of index++
  }
}
