export const typeDefs =`
    interface Person {
        firstName: String!
        lastName: String!
        fullName: String!
        age: Int!
        sex: Sex!
    }
    enum Sex {
        FEMALE
        MALE
        OTHER
    }
`;

export const resolvers = {
	__resolveType(person, _,context, info){
		if(person.books){
			return 'Author';
		}
		if(person.department){
			return 'Staff';
		}
		return null;
	},
};