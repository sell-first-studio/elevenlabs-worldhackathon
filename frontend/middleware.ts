import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/org-selection'])

// Admin-only routes within organizations
const isOrgAdminRoute = createRouteMatcher([
  '/dashboard/settings(.*)',
  '/dashboard/members(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  // Allow public routes without authentication
  if (isPublicRoute(request)) {
    return
  }

  const { userId, orgId } = await auth()

  // Require authentication for all non-public routes
  if (!userId) {
    await auth.protect()
    return
  }

  // Require active organization for dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard') && !orgId) {
    const url = new URL('/org-selection', request.url)
    return Response.redirect(url)
  }

  // Admin routes require org:manage permission
  if (isOrgAdminRoute(request) && orgId) {
    const authResult = await auth()
    const hasPermission = authResult.has?.({ permission: 'org:manage' })
    if (!hasPermission) {
      const url = new URL('/dashboard', request.url)
      return Response.redirect(url)
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
