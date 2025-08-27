import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const publicPaths = ["/login", "/register", "/api/auth", "/404"];

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const { pathname } = request.nextUrl;
    const isAuthenticated = !!request.nextauth.token;

    if (
      publicPaths.some((path) => pathname.startsWith(path)) &&
      isAuthenticated
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (
      !publicPaths.some((path) => pathname.startsWith(path)) &&
      !isAuthenticated
    ) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (publicPaths.some((path) => pathname.startsWith(path))) {
          return true;
        }

        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
