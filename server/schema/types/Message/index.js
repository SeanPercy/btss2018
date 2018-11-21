export const Message =`
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

	input MessageFilterInput {
	  OR: [MessageFilterInput!]
	  content_contains: String
	  info_contains: String
	}
`;
