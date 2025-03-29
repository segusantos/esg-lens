import { ReportDetail } from "@/components/report-detail"

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6">
      <ReportDetail id={params.id} />
    </div>
  )
}

