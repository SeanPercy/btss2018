export const Staff =`
    type Staff implements Node & Person {
        _id: ID!
        firstName: String!
        lastName: String!
        fullName: String!
        age: Int!
        sex: Sex!
        occupation: String!
        department: Department!
        onVacation: Boolean!
        superior: Staff
        subordinates: [Staff!]
    }
    enum Department {
        IT
        MANAGEMENT
        MARKETING
        SALES
        UNASSIGNED
    }
`;

export const staffResolvers = {
	fullName: (person, _, context) => {
		return `${person.firstName} ${person.lastName}`;
	},
	superior: (staff, _, context) => {
		if(!staff.superior) return null;
		return context.dataLoaders.mongo.staffLoader.load(staff.superior);
	},
	subordinates: (staff, _, context) => {
		if(!staff.subordinates) return null;
		return context.dataLoaders.mongo.staffLoader.loadMany(staff.subordinates);
	},
};
