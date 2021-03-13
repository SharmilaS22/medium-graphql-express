const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList } = require('graphql')

const app = express();

const subscribersList = [
    { id: 1, name: "Ron", email: "john@mail.com", country: "US" },
    { id: 2, name: "George", email: "george@mail.com", country: "NZ" },
    { id: 3, name: "Fred", email: "fred@mail.com", country: "UK" }
];

const SubscriberObject = new GraphQLObjectType({
    name: 'subscriber',
    description: 'A single Subscriber object',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        country: { type: GraphQLNonNull(GraphQLString) }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'rootquery',
    description: 'Root Query',
    fields: () => ({
        subscribers: {
            type: GraphQLList(SubscriberObject),
            description: 'List of all Subscribers',
            resolve: () => subscribersList
        }
    })
});

const RootMutation = new GraphQLObjectType({
    name: 'RootMutation',
    description: 'Root Mutation',
    fields: () => ({
        addSubscriber: {
            type: SubscriberObject,
            description: 'Add a new subscriber',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                country: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                const aSubscriber = {
                    id: subscribersList.length + 1,
                    name : args.name,
                    email: args.email,
                    country: args.country
                }
                subscribersList.push(aSubscriber)
                return aSubscriber;
            }
        },

    })
});

const subscriberSchema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
});

app.use("/graphql", graphqlHTTP({
    graphiql: true,
    schema: subscriberSchema
}));

app.listen(3000, () => console.log("Server running at port 3000"));