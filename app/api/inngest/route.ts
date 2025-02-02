import { serve } from "inngest/next"

import { inngest } from "@/app/utils/innjest"
import { handleJobExpiration, sendPeriodicJobListings } from "./functions"

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    handleJobExpiration,
    sendPeriodicJobListings
  ]
})
