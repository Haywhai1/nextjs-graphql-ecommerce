import { ApolloServer } from "@apollo/server";
import { typeDefs } from "@/app/graphql/schema/typeDef";
import { resolvers } from "@/app/graphql/schema/resolvers";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

//start the server and create a nexjs api route

const handler = startServerAndCreateNextHandler(apolloServer);

export { handler as GET, handler as POST };
