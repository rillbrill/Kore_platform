import { NextResponse, type NextRequest } from "next/server";

const separatedConsoleRoutes = new Set(["/agent", "/compliance", "/settlement", "/testbed"]);

export function middleware(request: NextRequest) {
  if (separatedConsoleRoutes.has(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/investor";
    url.searchParams.set("separated", "role-console");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/agent", "/compliance", "/settlement", "/testbed"],
};
