import { JobFilters } from "@/components/common/JobFilters"
import JobListings from "@/components/common/JobListings"

export default function Home() {
  return (
    <div className="grid grid-cols-3 gap-8">
      <JobFilters />

      <div className="col-span-2 flex flex-col gap-6">
        <JobListings currentPage={1} jobTypes={[]} location="" />
      </div>
    </div>
  )
}
