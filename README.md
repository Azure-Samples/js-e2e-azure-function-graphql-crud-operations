---
page_type: sample
languages:
- javascript
- typescript
- nodejs
name: "Azure Function GraphQL TypeScript CRUD operations"
description: "A simple CRUD operations example using GraphQL TypeScript using Apollo server."
products:
- azure
- azure-functions
- vs-code
---

# GraphQL TypeScript CRUD operations

A simple CRUD operations example using GraphQL TypeScript using Apollo server to an in-memory database.

```
const database = { [uuid()] :{"author": "dina", "content": "good morning"} };
```

## Getting Started

### Installation and start function

- `npm install && npm start`

This quickstart works with `apollo-server-azure-functions` v2 only.

## Reading and writing Apollo GraphQL with queries and mutations

In GraphQL, we perform read operations against data using _queries_ and write operations, such as inserts and updates, using _mutations_.

## Get all with a Apollo GraphQL API query

Suppose you have a data source that contains messages with an ID, author, and content of each message. 

To query for all messages, your GraphQL query looks like:

```graphql
{
  getMessages {
    id
    content
    author
  }
}
```

Your API endpoint may look like: `/api/graphql` and the cURL request may look like:

```bash
curl -X POST 'http://localhost:7071/api/graphql' \
     -H 'content-type: application/json' \
     --data-raw '{"query":"{ getMessages { id content author } }"}'
```

The API response looks like:

```json
{
    "data": {
        "getMessages": [
            {
                "id": "d8732ed5-26d8-4975-98a5-8923e320a77f",
                "author": "dina",
                "content": "good morning"
            },
            {
                "id": "33febdf6-e618-4884-ae4d-90827280d2b2",
                "author": "john",
                "content": "oh happy day"
            }
        ]
    }
}
```

## Returning a subset of the data with the client query

While the previous example returned every message and every field within a message, there may be times when the client knows it only wants certain fields. This doesn't require any new code for the API, but does require a new query from the client, describing the schema of the expected response:

Here's a query that will get all messages, but only the `id` and `author` fields of a message, telling the GraphQL server to not send the values for `content` to the client:

```graphql
{
  getMessages {
    id
    author
  }
}

```

Your API endpoint may look like: `/api/graphql` and the cURL request may look like:

```bash
curl -X POST 'http://localhost:7071/api/graphql' \
     -H 'content-type: application/json' \
     --data-raw '{"query":"{ getMessages { id author } }"}'
```

The API response looks like:

```json
{
    "data": {
        "getMessages": [
            {
                "id": "d8732ed5-26d8-4975-98a5-8923e320a77f",
                "author": "dina"
            },
            {
                "id": "33febdf6-e618-4884-ae4d-90827280d2b2",
                "author": "john"
            }
        ]
    }
}
```

## Change the data with a mutation

To change the data, use a mutation that defines the change, _and_ defines what data to return from the change. Suppose you have a data source that contains messages with an ID, author, and content of each message and you want to add a new message. 

### Apollo GraphQL syntax

To add a new message, your GraphQL mutation looks like:

```graphql
mutation {
  createMessage(input: { author: "John Doe", content: "Oh happy day" }) {
    id
  }
}
```

Notice that the last curly brace section, `{ id }`, describes the schema the client wants in the response.

### HTTP cURL request

Your API endpoint may look like: `/api/graphql` and the cURL request may look like:

```bash
curl 'http://localhost:7071/api/graphql' \
    -X POST \
    -H 'Content-Type: application/json' \
    --data-raw '{"query": "mutation{ createMessage(input: { author: \"John Doe\", content: \"Oh happy day\" }){ id } }"}'
```

### HTTP response

The API response looks like:

```json
{
    "data": {
        "createMessage": {
            "id":"7f1413ec-4ffa-45bc-bce2-583072745d84"
        }
    }
}
```

## Change the data with variables for an Apollo mutation

The preceding query hard-coded the values of the `author` and `content`. That preceding example isn't a recommended method but used to illustrate where the values are expected on the request. Now, we can change the same mutation request to allow variables, and allow the client making the request to inject the appropriate values. 

### HTTP cURL request body

To pass variables, you need to send them in the `variables` property, and describe them in the mutation params with the `$` and a type that matches what the _mutation_ expects, such as `String!`, then pass them assign them to the mutation arguments as required.

```json
{
  "variables": { "author": "jimbob", "content": "sunny in the `ham" },
  "query": "mutation ($author: String!, $content: String!) { createMessage(input: { author: $author, content: $content }){ id }}"
}
```

### cURL request

The following request body, `--data-raw` value, is stripped of all formatting.

```bash
curl 'http://localhost:7071/api/graphql' \
    -X POST \
    -H 'Content-Type: application/json' \
    --data-raw '{"variables": { "author": "jimbob", "content": "sunny in the `ham" },"query": "mutation ($author: String!, $content: String!){ createMessage(input: { author: $author, content: $content }){ id } }"}'
```

### Deploy to Azure

1. In VS Code, create the Azure Function resource.
2. Deploy the root folder to your resource. Do not select the `/dist` folder. It will be created as part of the build process.

### MacOS M1 in a container

* See azure-functions-core-tools issue [2834](https://github.com/Azure/azure-functions-core-tools/issues/2834)