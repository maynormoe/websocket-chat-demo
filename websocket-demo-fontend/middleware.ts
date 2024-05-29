import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
const whiteList = ["/login"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = request.cookies.get("username")?.value;

  if (!whiteList.includes(pathname) && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  } else if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    // "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/",
    "/login",
  ],
};
