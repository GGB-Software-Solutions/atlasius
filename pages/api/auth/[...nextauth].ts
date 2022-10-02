import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jsonFetch } from "../../../src/utils/fetch";

export default NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {},
      async authorize(credentials, req) {
        const url = "login?username=asd&password=asd";
        try {
          const data = await jsonFetch(url, {
            method: "POST",
            body: JSON.stringify(credentials),
          });
          if (data) return data;
          // Return null if user data could not be retrieved
          return null;
        } catch (e) {
          console.log("Err:", e);
          return null;
        }
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
      if (user) {
        token.accessToken = user.access_token;
        token.user = user.user;
      }
      return token;
    },
    session: async ({ session, token, user }) => {
      if (token) {
        session.accessToken = token.accessToken;
        session.user = token.user;
      }
      return session;
    },
  },
});
