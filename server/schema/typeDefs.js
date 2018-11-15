export const typeDefs =`

    scalar CustomDate
    scalar Date
    
    interface Node {
     _id: ID!
    }
    type User implements Node {
        _id: ID!
        username: String!
        email: String!
        password: String!
        role: Role!
    }
    enum Role {
        ADMIN
        VIEWER
    }
    type AuthPayload {
        user: User!
        token: String!
    }
    input UserSignUpInput {
        username: String!,
        email: String!,
        password: String!
        role: Role!
    }
    input UserLoginInput {
        email: String!,
        password: String!
    }
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
    type Author implements Node & Person {
        _id: ID!
        firstName: String!
        lastName: String!
        fullName: String!
        age: Int!
        sex: Sex!
        retired: Boolean!
        books: [Book!]    
    }
    type Book implements Node {
        _id: ID!
        title: String!
        author: Author
        genre: Genre
        releaseDate: Date
        inSeconds: CustomDate
    }
    enum Genre {
        COOKING
        PROGRAMMING
        NOVEL
    }
    type BookFeed {
	    cursor: String!
        books: [Book]!
    }
    type Query {
        allAuthors: [Author!]
        allBooks: [Book!]
        allMessages(filter: MessageFilterInput, skip: Int, first: Int): [Message!]!
        allPersons: [Person!]
        allStaff: [Staff!]!
        allUsers: [User!]
        authorById(_id: ID!): Author
        authorByName(name: String!): [Author]
        bookById(_id: ID!): Book
        books(filter: BookFilterInput, skip: Int, first: Int): [Book!]!
        bookFeed(cursor: String): BookFeed
        me: User
        messages: [Message!]
        messageSearch(filter: String!): [Message!]
        messageFeed(cursor: String): MessageFeed
        staffById(_id: ID!): Staff
    }
    type Mutation {
        addMessage(message: MessageInput!): Message
        deleteAllMessages: Boolean
        login(credentials: UserLoginInput): AuthPayload
        signup(credentials: UserSignUpInput): AuthPayload
    }
    type Subscription {
        messageCreated: Message
        bookCreated: Book
    }
    type Message implements Node {
       _id: ID!
       content: String!
       info: String!
    }
    input MessageInput {
       content: String!,
       info: String!
    }
    type MessageFeed {
	  cursor: String!
	  messages: [Message]!
	}
	input BookFilterInput {
	  OR: [BookFilterInput!]
	  title_contains: String
	  genre_contains: String
	}
	input MessageFilterInput {
	  OR: [MessageFilterInput!]
	  content_contains: String
	  info_contains: String
	}
`;