/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "@/app/graphql/schema/typeDef";
import { resolvers } from "@/app/graphql/schema/resolvers";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(apolloServer);

export async function GET(request: Request, context: any) {
  return handler(request);
}

export async function POST(request: Request, context: any) {
  return handler(request);
}
