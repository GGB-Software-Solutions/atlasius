import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jsonFetch } from "../../../src/utils/fetch";

export default NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {},
      async authorize(credentials, req) {
        return {
          access_token: "123",
          refresh_token: "12345",
          id: 25,
          username: "gosho",
        };
        // const url = "/login";
        // const data = await jsonFetch(url, {
        //   method: "POST",
        //   body: JSON.stringify(credentials),
        // });
        // if (data) return data;
        // // Return null if user data could not be retrieved
        // return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT:", token, user);
      if (user) {
        token.accessToken = user.access_token;
        token.refreshToken = user.refresh_token;
      }
      return token;
    },
    session: async ({ session, token }) => {
      console.log("SESSION:", session, token);
      if (token) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
});
