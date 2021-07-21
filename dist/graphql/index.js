"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_azure_functions_1 = require("apollo-server-azure-functions");
const uuidv4_1 = require("uuidv4");
const database = { [uuidv4_1.uuid()]: { "author": "dina", "content": "good morning" } };
const typeDefs = apollo_server_azure_functions_1.gql `
    input MessageInput {
        content: String
        author: String
    }

    type Message {
        id: ID!
        content: String
        author: String
    }

    type Query {
        getMessage(id: ID!): Message,
        getMessages:[Message]
    }

    type Mutation {
        createMessage(input: MessageInput): Message
        updateMessage(id: ID!, input: MessageInput): Message
    }
`;
class Message {
    constructor(id, { content, author }) {
        this.id = id;
        this.content = content;
        this.author = author;
    }
}
const resolvers = {
    Mutation: {
        createMessage: (_, { input }) => {
            const id = uuidv4_1.uuid();
            database[id] = input;
            return new Message(id, input);
        },
        updateMessage: (_, { id, input }) => {
            if (!database[id]) {
                throw new Error('no message exists with id ' + id);
            }
            database[id] = input;
            return new Message(id, input);
        },
    },
    Query: {
        getMessage: (_, { id }) => {
            if (!database[id]) {
                throw new Error('no message exists with id ' + id);
            }
            return new Message(id, database[id]);
        },
        getMessages: (_) => {
            let arr = [];
            for (var key in database) {
                if (database.hasOwnProperty(key)) {
                    arr.push({
                        id: key,
                        author: database[key].author,
                        content: database[key].content
                    });
                }
            }
            return arr;
        },
    }
};
// @ts-ignore
const server = new apollo_server_azure_functions_1.ApolloServer({ typeDefs, resolvers, playground: true });
exports.default = server.createHandler({
    cors: {
        origin: '*'
    },
});
/*
Example playground queries:

// get all messages
{getMessages{id, author, content}}

// add a message
mutation{
  createMessage(input:{
    author: "John Doe",
    content: "Oh happy day"
  }){id}
}

// add a message response
{
  "data": {
    "createMessage": {
      "id": "79e4c338-162d-4c1e-a6f0-320bd78a7817"
    }
  }
}

// update a message
mutation{
  updateMessage (
    id: "79e4c338-162d-4c1e-a6f0-320bd78a7817",
    input:{
      author: "John Doe",
      content: "Oh happy day"
    }
  ){id, content, author}
}

// update a message response
{
  "data": {
    "updateMessage": {
      "id": "79e4c338-162d-4c1e-a6f0-320bd78a7817",
      "content": "Oh happy day",
      "author": "John Doe"
    }
  }
}

// get specific message
{
    getMessage(id: "79e4c338-162d-4c1e-a6f0-320bd78a7817"){
        id, content, author
    }
}


// get specific message - response
{
  "data": {
    "getMessage": {
      "id": "79e4c338-162d-4c1e-a6f0-320bd78a7817",
      "content": "Oh happy day",
      "author": "John Doe"
    }
  }
}

*/ 
//# sourceMappingURL=index.js.map