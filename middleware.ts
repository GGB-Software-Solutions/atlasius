import { getToken } from "next-auth/jwt";
import withAuth from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async authorized({ req }) {
      const token = await getToken({
        req,
        raw: true,
      });
      return Boolean(token);
      // `/admin` requires admin role
      if (req.nextUrl.pathname === "/admin") {
        return token?.userRole === "admin";
      }
      // `/me` only requires the user to be logged in
      return !!token;
    },
  },
});
