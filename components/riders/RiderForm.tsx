"use client";
import { useFormState, useFormStatus } from "react-dom";
import { createRider } from "@/app/actions/riders";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Gender } from "@/types";

const genderOptions: { value: Gender; label: string }[] = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="px-4 py-2 bg-[#1a6b4a] text-white rounded-lg text-sm font-medium disabled:opacity-60">
      {pending ? "Saving…" : "Create Rider"}
    </button>
  );
}

export default function RiderForm() {
  const [state, action] = useFormState(createRider, null);

  return (
    <form action={action} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input name="firstName" label="First Name *" error={state?.error?.firstName?.[0]} />
        <Input name="lastName" label="Last Name *" error={state?.error?.lastName?.[0]} />
      </div>
      <Input name="licenseNumber" label="License Number *" placeholder="FEI-IN-XXXX" error={state?.error?.licenseNumber?.[0]} />
      <Input name="email" label="Email *" type="email" error={state?.error?.email?.[0]} />
      <Input name="phone" label="Phone" type="tel" />
      <div className="grid grid-cols-2 gap-4">
        <Select name="gender" label="Gender" options={genderOptions} placeholder="Select gender…" />
        <Input name="dateOfBirth" label="Date of Birth" type="date" />
      </div>
      <Input name="clubName" label="Club / Stable" />
      <Input name="feiId" label="FEI ID" placeholder="Optional" />
      <div className="grid grid-cols-2 gap-4">
        <Input name="emergencyContact" label="Emergency Contact Name" />
        <Input name="emergencyPhone" label="Emergency Phone" type="tel" />
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" name="consentGiven" value="true" className="rounded" />
        Rider has given consent for data processing (DPDP Act 2023) *
      </label>
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <button type="button" className="px-4 py-2 text-sm border border-gray-200 rounded-lg">Cancel</button>
        <SubmitButton />
      </div>
    </form>
  );
}
