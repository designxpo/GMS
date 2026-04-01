"use client";
import { useState } from "react";
import Step1BasicInfo from "@/components/events/wizard/Step1BasicInfo";
import Step2Venue from "@/components/events/wizard/Step2Venue";
import Step3Activities from "@/components/events/wizard/Step3Activities";
import Step4Fees from "@/components/events/wizard/Step4Fees";
import Step5Review from "@/components/events/wizard/Step5Review";
import { EventWizardDraft } from "@/types";
import { saveDraft } from "@/app/actions/events";

const STEPS = ["Basic Info", "Venue", "Activities", "Fees", "Review"];

export default function NewEventPage() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<EventWizardDraft>({ step: 0 });

  const updateDraft = async (patch: Partial<EventWizardDraft>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    await saveDraft(next); // server-side persistence — survives refresh
  };

  const stepProps = { draft, updateDraft, onNext: () => setStep((s) => s + 1), onBack: () => setStep((s) => s - 1) };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-bold">Create New Event</h1>

      {/* Step indicator */}
      <div className="flex gap-2">
        {STEPS.map((s, i) => (
          <button
            key={s}
            onClick={() => i < step && setStep(i)}
            className={[
              "flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors",
              i === step  ? "bg-[#1a6b4a] text-white border-[#1a6b4a]" :
              i < step    ? "bg-[#e8f5ef] text-[#1a6b4a] border-[#1a6b4a]" :
                            "bg-gray-50 text-gray-400 border-gray-200 cursor-default"
            ].join(" ")}
          >{i + 1}. {s}</button>
        ))}
      </div>

      {step === 0 && <Step1BasicInfo {...stepProps} />}
      {step === 1 && <Step2Venue {...stepProps} />}
      {step === 2 && <Step3Activities {...stepProps} />}
      {step === 3 && <Step4Fees {...stepProps} />}
      {step === 4 && <Step5Review {...stepProps} />}
    </div>
  );
}