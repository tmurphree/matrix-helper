# Whether to use keep the app layout even when there is only one page

Status: approved

# Decision

Keep the app layout even when there is only one page.  The amount of work to maintain the layout is negligible, and it keeps the door open for future pages.

# Context

Previously, I had multiple pages with different functions (homepage, inverse, reduced row echelon form).  I decided that the homepage was the only page that was needed, so I removed the other pages.  Now, I need to decide whether to keep the app layout (app.vue with a NuxtPage component) even when there is only one page.

# Solutions Considered

## Keep the app layout
Pro: It works, leaving the layout keeps the door open for future pages.
Con: It's unnecessary complexity (YANGI).

## Remove the app layout
Pro: It's less work to maintain.
Con: It's not as easy to add future pages.

# Consequences

## Good
It works, leaving the layout keeps the door open for future pages

## Bad
It's unnecessary complexity (YANGI).
