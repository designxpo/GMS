import RiderForm from "@/components/riders/RiderForm";

export const metadata = { title: "Add Rider — BSV" };

export default function NewRiderPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold mb-6">Add New Rider</h1>
      <RiderForm />
    </div>
  );
}