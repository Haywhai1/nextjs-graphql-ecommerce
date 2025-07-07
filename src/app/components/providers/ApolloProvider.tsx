"use client";
import client from "@/lib/apollo-client";
import { ApolloProvider as Provider } from "@apollo/client";
import { ReactNode } from "react";

export default function ApolloProvider({ children }: { children: ReactNode }) {
  return <Provider client={client}>{children}</Provider>;
}
