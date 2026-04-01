import AccreditationForm from "@/components/accreditation/AccreditationForm";
import { getRiders } from "@/lib/data/riders";
import { getEvents } from "@/lib/data/events";
import { cookies } from "next/headers";


export const metadata = { title: "New Accreditation — BSV" };

export default async function NewAccreditationPage() {
  cookies();
  const [ridersRes, eventsRes] = await Promise.all([

    getRiders({ page: 1, pageSize: 200 }),
    getEvents(),
  ]);

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold mb-6">Issue Accreditation</h1>
      <AccreditationForm riders={ridersRes.data} events={eventsRes.data} />
    </div>
  );
}