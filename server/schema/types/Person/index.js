export const Person =`
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

export const personResolvers = {
	__resolveType(person){
		if(person.books){
			return 'Author';
		}
		if(person.department){
			return 'Staff';
		}
		return null;
	},
};