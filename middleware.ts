export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/inbox/:path*", "/email/:path*", "/calendar/:path*", "/assistant/:path*", "/settings/:path*"]
};
