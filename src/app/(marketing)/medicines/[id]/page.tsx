"use client";

import dynamic from "next/dynamic";

const MedicineDetailPage = dynamic(() => import("./medicine-detail-page"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Loading medicine details...</p>
      </div>
    </div>
  ),
});

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <MedicineDetailPage params={params} />;
}
