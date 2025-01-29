import { createRouteHandler } from "uploadthing/next"

import { appFileRouter } from "./core"

export const { GET, POST } = createRouteHandler({
  router: appFileRouter,

  // Apply an (optional) custom config:
  // config: { ... },
})
