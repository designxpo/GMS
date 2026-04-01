import { getPublicEvents } from "@/lib/data/events";
import RegistrationWizard from "@/components/registration/RegistrationWizard";
import { BSV } from "@/types/company";

interface Props { searchParams: { event?: string } }

export default async function RegistrationPage({ searchParams }: Props) {
  const events = await getPublicEvents();
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">🐎 Event Registration</h1>
        <p className="text-gray-500 mt-1">Register your horse and rider for an upcoming event</p>
      </div>
      <RegistrationWizard events={events.data} preselectedEventId={searchParams.event} />
    </div>
  );
}