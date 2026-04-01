import { notFound } from "next/navigation";
import { getRiderById } from "@/lib/data/riders";
import RiderProfile from "@/components/riders/RiderProfile";

interface Props { params: { id: string } }

export default async function RiderDetailPage({ params }: Props) {
  const rider = await getRiderById(params.id);
  if (!rider) notFound();
  return <RiderProfile rider={rider} />;
}