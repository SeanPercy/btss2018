/*eslint no-console: "error"*/
import dateGen from './dateGenerator';

const seedDatabase = (database) => {

	return new Promise(async(resolve, reject) => {
		console.log('Start database seeding process');
		// DROP COLLECTIONS IN CASE APP RESTARTS
		console.log('Attempting to drop old collections from previous session.');
		Promise.all([
			database.collection('books').drop(),
			database.collection('authors').drop(),
			database.collection('staff').drop(),
			database.collection('users').drop()
		])
			.then(() => console.log('Successfully dropped old collections from previous session.'))
			.catch(() => console.log(
				'Failed to drop collections from previous session.' +
				'This is not necessarily an error, maybe there was no previous session to drop collections from.'
			));

		// RECREATE COLLECTIONS ON RESTART OF THE APP
		Promise.all([
			database.createCollection('authors'),
			database.createCollection('books'),
			database.createCollection('staff'),
			database.createCollection('users')
		])
			.then(([authors, books, staff]) => {
				console.log('Created new collections for current session.');
				createStaff(staff)
					.then(() => createAuthors(authors))
					.then(() => createBooks(authors, books))
					.then(() => resolve('Database seeding successful.'))
					.catch(e => reject(e));
			})
			.catch(e => reject(e));

		async function createStaff(staff) {
			//MANAGEMENT DEPARTMENT
			await staff.insertMany([{
				firstName: 'Vito',
				lastName: 'Corleone',
				age: 55,
				sex: 'MALE',
				occupation: 'CEO',
				department: 'MANAGEMENT',
				onVacation: false,
				superior: null,
				subordinates: [],
			}, {
				firstName: 'Jane',
				lastName: 'Doe',
				age: 36,
				sex: 'FEMALE',
				occupation: 'Secretary',
				department: 'MANAGEMENT',
				onVacation: false,
				superior: null,
				subordinates: [],
			}, {
				firstName: 'Lisa',
				lastName: 'Johnson',
				age: 32,
				sex: 'FEMALE',
				occupation: 'Accountant',
				department: 'MANAGEMENT',
				onVacation: false,
				superior: null,
				subordinates: [],
			}]);
			const vito = await staff.findOne({firstName: 'Vito'});
			const jane = await staff.findOne({firstName: 'Jane'});
			const lisa = await staff.findOne({firstName: 'Lisa'});

			Promise.all([
				staff.updateOne({_id: vito._id}, {$push: {'subordinates': {$each: [jane._id, lisa._id]}}}),
				staff.updateOne({_id: jane._id}, {$set: {'superior': vito._id}}),
				staff.updateOne({_id: lisa._id}, {$set: {'superior': vito._id}})
			]);

			// HEAD OF SALES and HEAD OF MARKETING
			await staff.insertMany([{
				firstName: 'Anna',
				lastName: 'Gonzalez',
				age: 34,
				sex: 'FEMALE',
				occupation: 'Head of Sales',
				department: 'SALES',
				onVacation: false,
				superior: vito._id,
				subordinates: [],
			}, {
				firstName: 'Ashley',
				lastName: 'Nguyen',
				age: 29,
				sex: 'FEMALE',
				occupation: 'Head of Marketing',
				department: 'MARKETING',
				onVacation: false,
				superior: vito._id,
				subordinates: [],
			},]);
			const anna = await staff.findOne({firstName: 'Anna'});
			const ashley = await staff.findOne({firstName: 'Ashley'});

			staff.updateOne({_id: vito._id}, {$push: {'subordinates': {$each: [anna._id, ashley._id]}}});

			// MEMBERS OF SALES DEPARTMENT
			await staff.insertMany([{
				firstName: 'Jim',
				lastName: 'Smith',
				age: 28,
				sex: 'MALE',
				occupation: 'Account Manager',
				department: 'SALES',
				onVacation: false,
				superior: anna._id,
				subordinates: null,
			}, {
				firstName: 'Harpal',
				lastName: 'Singh',
				age: 23,
				sex: 'MALE',
				occupation: 'Sales-Trainee',
				department: 'SALES',
				onVacation: false,
				superior: anna._id,
				subordinates: null,
			}]);
			const jim = await staff.findOne({firstName: 'Jim'});
			const harpal = await staff.findOne({firstName: 'Harpal'});

			staff.updateOne({_id: anna._id}, {$push: {'subordinates': {$each: [jim._id, harpal._id]}}});

			// MEMBERS OF MARKETING DEPARTMENT
			await staff.insertMany([{
				firstName: 'Nancy',
				lastName: 'Cohen',
				age: 28,
				sex: 'FEMALE',
				occupation: 'Content Marketing Manager',
				department: 'MARKETING',
				onVacation: false,
				superior: ashley._id,
				subordinates: null,
			},{
				firstName: 'Kendrick',
				lastName: 'Lamar',
				age: 28,
				sex: 'MALE',
				occupation: 'Account Manager',
				department: 'MARKETING',
				onVacation: false,
				superior: ashley._id,
				subordinates: [],
			},{
				firstName: 'Christine',
				lastName: 'Wang',
				age: 24,
				sex: 'FEMALE',
				occupation: 'Marketing-Trainee',
				department: 'MARKETING',
				onVacation: true,
				superior: null,
				subordinates: null,
			}]);
			const nancy = await staff.findOne({firstName: 'Nancy'});
			const kendrick = await staff.findOne({firstName: 'Kendrick'});
			const christine = await staff.findOne({firstName: 'Christine'});

			Promise.all([
				staff.updateOne({_id: ashley._id}, {$push: {'subordinates': {$each: [nancy._id, kendrick._id]}}}),
				staff.updateOne({_id: kendrick._id}, {$push: {'subordinates': christine._id}}),
				staff.updateOne({_id: christine._id}, {$set: {'superior': kendrick._id}})
			]);

			// HEAD OF IT DEPARTMENT
			await staff.insertMany([{
				firstName: 'Daniel',
				lastName: 'Oppenheimer',
				age: 35,
				sex: 'MALE',
				occupation: 'Head of IT',
				department: 'IT',
				onVacation: false,
				superior: vito._id,
				subordinates: [],
			}]);
			const daniel = await staff.findOne({firstName: 'Daniel'});


			// MEMBERS OF IT DEPARTMENT
			await staff.insertMany([{
				firstName: 'George',
				lastName: 'Cook',
				age: 38,
				sex: 'MALE',
				occupation: 'Fullstack Developer',
				department: 'IT',
				onVacation: false,
				superior: daniel._id,
				subordinates: [],
			},{
				firstName: 'Eric',
				lastName: 'Yamamoto',
				age: 27,
				sex: 'MALE',
				occupation: 'Frontend Developer',
				department: 'IT',
				onVacation: false,
				superior: daniel._id,
				subordinates: null,
			},{
				firstName: 'Alexander',
				lastName: 'Anderson',
				age: 28,
				sex: 'MALE',
				occupation: 'Backend Developer',
				department: 'IT',
				onVacation: true,
				superior: daniel._id,
				subordinates: null,
			}]);
			const george = await staff.findOne({firstName: 'George'});
			const eric = await staff.findOne({firstName: 'Eric'});
			const alexander = await staff.findOne({firstName: 'Alexander'});

			staff.updateOne({_id: daniel._id}, {$push: {'subordinates': {$each: [george._id, eric._id, alexander._id]}}});

			await staff.insertOne({
				firstName: 'Jacob',
				lastName: 'Garcia',
				age: 23,
				sex: 'MALE',
				occupation: 'IT-Trainee',
				department: 'IT',
				onVacation: false,
				superior: george._id,
				subordinates: null,
			});
			const jacob = await staff.findOne({firstName: 'Jacob'});

			staff.updateOne({_id: kendrick._id}, {$push: {'subordinates': jacob._id}});
		}

		async function createAuthors(authors) {
			await authors.insertMany([{
				firstName: 'Richard',
				lastName: 'Lewis',
				age: 44,
				sex: 'MALE',
				retired: false,
				books: [],
			},{
				firstName: 'Frank',
				lastName: 'Franklyn',
				age: 19,
				sex: 'MALE',
				retired: false,
				books: [],
			},{
				firstName: 'Olivia',
				lastName: 'Suarez',
				age: 23,
				sex: 'FEMALE',
				retired: false,
				books: [],
			},{
				firstName: 'Victoria',
				lastName: 'Nguyen',
				age: 41,
				sex: 'FEMALE',
				retired: false,
				books: [],
			},{
				firstName: 'Chris',
				lastName: 'Brown',
				age: 33,
				sex: 'OTHER',
				retired: false,
				books: [],
			},{
				firstName: 'Yael',
				lastName: 'Finkel',
				age: 37,
				sex: 'OTHER',
				retired: true,
				books: [],
			}]);
		}

		async function createBooks(authors, books) {

			const dateGenerator = dateGen();

			const richard = await authors.findOne({firstName: 'Richard'});
			const frank = await authors.findOne({firstName: 'Frank'});
			const olivia = await authors.findOne({firstName: 'Olivia'});
			const victoria = await authors.findOne({firstName: 'Victoria'});
			const chris = await authors.findOne({firstName: 'Chris'});
			const yael = await authors.findOne({firstName: 'Yael'});

			await books.insertMany([
				{
					title: 'How To Cook Humans',
					author: richard._id,
					genre: 'COOKING',
					releaseDate: new Date(dateGenerator.next().value),
				},{
					title: 'How To Cook For Humans',
					author: richard._id,
					genre: 'COOKING',
					releaseDate: new Date(dateGenerator.next().value),
				},{
					title: 'How To Cook Forty Humans',
					author: richard._id,
					genre: 'COOKING',
					releaseDate: new Date(dateGenerator.next().value),
				},{
					title: 'How To Cook For Forty Humans',
					author: richard._id,
					genre: 'COOKING',
					releaseDate: new Date(dateGenerator.next().value),
				},{
					title: 'Eating People Is Wrong',
					author: richard._id,
					genre: 'COOKING',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'Caffeine Killed My Family',
					author: olivia._id,
					genre: 'NOVEL',
					releaseDate: new Date(dateGenerator.next().value),
				},{
					title: 'How To Be Cool',
					author: olivia._id,
					genre: 'NOVEL',
					releaseDate: new Date(dateGenerator.next().value),
				},{
					title: 'Everything I Want To Do Is Illegal',
					author: olivia._id,
					genre: 'NOVEL',
					releaseDate: new Date(dateGenerator.next().value),
				},{
					title: 'Teach Your Wife To Be A Widow',
					author: olivia._id,
					genre: 'NOVEL',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'JavaScript The Good Parts',
					author: olivia._id,
					genre: 'PROGRAMMING',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'Love, Sex and Tractors',
					author: chris._id,
					genre: 'NOVEL',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'How To Avoid Huge Ships',
					author: chris._id,
					genre: 'NOVEL',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'The Manly Art Of Knitting',
					author: chris._id,
					genre: 'NOVEL',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'The Practical Pyromaniac',
					author: chris._id,
					genre: 'NOVEL',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'Flags Per Country',
					author: chris._id,
					genre: 'NOVEL',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'Building APIs With Node.js',
					author: frank._id,
					genre: 'PROGRAMMING',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'Node.JS Web Development',
					author: frank._id,
					genre: 'PROGRAMMING',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'Node.js Desgin Patterns',
					author: frank._id,
					genre: 'PROGRAMMING',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'Node.js The Right Way',
					author: frank._id,
					genre: 'PROGRAMMING',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'Fundamentals Of Node.js',
					author: frank._id,
					genre: 'PROGRAMMING',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'GraphQL and Relay',
					author: victoria._id,
					genre: 'PROGRAMMING',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'Getting Started With React Native',
					author: victoria._id,
					genre: 'PROGRAMMING',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'Learning React Native',
					author: victoria._id,
					genre: 'PROGRAMMING',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'Pro TypeScript',
					author: victoria._id,
					genre: 'PROGRAMMING',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'Introduction To Flow.Js',
					author: victoria._id,
					genre: 'PROGRAMMING',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'Angular 2 By Example',
					author: yael._id,
					genre: 'PROGRAMMING',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'Functional Programming',
					author: yael._id,
					genre: 'PROGRAMMING',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'Introduction To EcmaScript 6',
					author: yael._id,
					genre: 'PROGRAMMING',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'Pro React',
					author: yael._id,
					genre: 'PROGRAMMING',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'Pro Express.js',
					author: yael._id,
					genre: 'PROGRAMMING',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'React Quickly',
					author: richard._id,
					genre: 'PROGRAMMING',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'Getting MEAN',
					author: frank._id,
					genre: 'PROGRAMMING',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'Full Stack JavaScript',
					author: olivia._id,
					genre: 'PROGRAMMING',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'Learn Backbone.js',
					author: victoria._id,
					genre: 'PROGRAMMING',
					releaseDate: new Date(dateGenerator.next().value),
				},
				{
					title: 'Pro MERN Stack',
					author: chris._id ,
					genre: 'PROGRAMMING',
					releaseDate: new Date(dateGenerator.next().value),
				},
			]);

			const cookHumans = await books.findOne({title: 'How To Cook Humans'});
			const cookForHumans = await books.findOne({title: 'How To Cook For Humans'});
			const cookFortyHumans = await books.findOne({title: 'How To Cook Forty Humans'});
			const cookForFortyHumans = await books.findOne({title: 'How To Cook For Forty Humans'});
			const eatingPeopleIsWrong = await books.findOne({title: 'Eating People Is Wrong'});
			const caffeine = await books.findOne({title: 'Caffeine Killed My Family'});
			const howToBeCool = await books.findOne({title: 'How To Be Cool'});
			const everythingIllegal = await books.findOne({title: 'Everything I Want To Do Is Illegal'});
			const wifeWidow = await books.findOne({title: 'Teach Your Wife To Be A Widow'});
			const goodParts = await books.findOne({title: 'JavaScript The Good Parts'});
			const tractors = await books.findOne({title: 'Love, Sex and Tractors'});
			const avoidHugeShips = await books.findOne({title: 'How To Avoid Huge Ships'});
			const artOfKnitting = await books.findOne({title: 'The Manly Art Of Knitting'});
			const practicalPyromaniac = await books.findOne({title: 'The Practical Pyromaniac'});
			const flagsPerCountry = await books.findOne({title: 'Flags Per Country'});
			const buildingAPIs = await books.findOne({title: 'Building APIs With Node.js'});
			const nodeWebDev = await books.findOne({title: 'Node.JS Web Development'});
			const nodeDesignPatterns = await books.findOne({title: 'Node.js Desgin Patterns'});
			const nodeRightWay = await books.findOne({title: 'Node.js The Right Way'});
			const fundamentalsNode = await books.findOne({title: 'Fundamentals Of Node.js'});
			const graphqlRelay = await books.findOne({title: 'GraphQL and Relay'});
			const startReactNative = await books.findOne({title: 'Getting Started With React Native'});
			const learningReactNative = await books.findOne({title: 'Learning React Native'});
			const typeScript = await books.findOne({title: 'Pro TypeScript'});
			const flowJS = await books.findOne({title: 'Introduction To Flow.Js'});
			const angular2 = await books.findOne({title: 'Angular 2 By Example'});
			const functionalProgramming = await books.findOne({title: 'Functional Programming'});
			const ecmaScript6 = await books.findOne({title: 'Introduction To EcmaScript 6'});
			const reactJs = await books.findOne({title: 'Pro React'});
			const expressJs = await books.findOne({title: 'Pro Express.js'});
			const reactQuickly = await books.findOne({title: 'React Quickly'});
			const mean = await books.findOne({title: 'Getting MEAN'});
			const fullStackJavaScript = await books.findOne({title: 'Full Stack JavaScript'});
			const backbone = await books.findOne({title: 'Learn Backbone.js'});
			const mern = await books.findOne({title: 'Pro MERN Stack'});


			Promise.all([
				authors.updateOne({_id: richard._id}, {
					$push: {'books': {
						$each: [
							cookHumans._id,
							cookForHumans._id,
							cookFortyHumans._id,
							cookForFortyHumans._id,
							eatingPeopleIsWrong._id,
							reactQuickly._id,
							mean._id
						]
					}}
				}),
				authors.updateOne({_id: olivia._id}, {
					$push: {'books': {
						$each: [
							caffeine._id,
							howToBeCool._id,
							everythingIllegal._id,
							wifeWidow._id,
							goodParts._id,
							fullStackJavaScript._id
						]
					}}
				}),
				authors.updateOne({_id: chris._id}, {
					$push: {'books': {
						$each: [
							tractors._id,
							avoidHugeShips._id,
							artOfKnitting._id,
							practicalPyromaniac._id,
							flagsPerCountry._id,
							mern._id
						]
					}}
				}),
				authors.updateOne({_id: frank._id}, {
					$push: {'books': {
						$each: [
							buildingAPIs._id,
							nodeWebDev._id,
							fundamentalsNode._id,
							nodeDesignPatterns._id,
							nodeRightWay._id
						]
					}}
				}),
				authors.updateOne({_id: victoria._id}, {
					$push: {'books': {
						$each: [
							graphqlRelay._id,
							startReactNative._id,
							learningReactNative._id,
							typeScript._id,
							flowJS._id,
							backbone._id
						]
					}}
				}),
				authors.updateOne({_id: yael._id}, {
					$push: {'books': {
						$each: [
							angular2._id,
							functionalProgramming._id,
							ecmaScript6._id,
							reactJs._id,
							expressJs._id,
						]
					}}
				}),
			]);
		}
	});

};

export { seedDatabase };
