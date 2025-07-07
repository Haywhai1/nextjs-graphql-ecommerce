import "./globals.css";

import ApolloProvider from "./components/providers/ApolloProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <ApolloProvider>{children}</ApolloProvider>
      </body>
    </html>
  );
}
