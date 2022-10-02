import { getToken } from "next-auth/jwt";
import withAuth from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async authorized({ req, token }) {
      const token1 = await getToken({
        req,
        raw: true,
      });
      console.log("token1:", token1);
      return Boolean(token1);
      // `/admin` requires admin role
      if (req.nextUrl.pathname === "/admin") {
        return token?.userRole === "admin";
      }
      // `/me` only requires the user to be logged in
      return !!token;
    },
  },
});

// import { NextResponse, NextRequest } from "next/server";
// export async function middleware(req: NextRequest, ev) {
//   const { pathname } = req.nextUrl;
//   if (pathname === "/auth/login") {
//     return NextResponse.redirect("/");
//   }
//   return NextResponse.next();
// }
