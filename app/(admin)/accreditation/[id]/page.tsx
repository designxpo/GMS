import { notFound } from "next/navigation";
import { getAccreditationById } from "@/lib/data/accreditation";
import AccreditationBadge from "@/components/accreditation/AccreditationBadge";

export default async function AccreditationDetailPage({ params }: { params: { id: string } }) {
  const accreditation = await getAccreditationById(params.id);
  if (!accreditation) notFound();
  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-xl font-bold">Accreditation Badge</h1>
      <AccreditationBadge accreditation={accreditation} />
    </div>
  );
}