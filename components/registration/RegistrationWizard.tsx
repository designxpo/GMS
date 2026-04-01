"use client";
import { useState } from "react";
import { createRegistration, submitRegistration } from "@/app/actions/registration";
import { EquiEvent, Rider, Horse } from "@/types";

type Step = "event" | "rider" | "horse" | "activity" | "docs" | "payment" | "confirm";
const STEPS: Step[] = ["event", "rider", "horse", "activity", "docs", "payment", "confirm"];

interface Props {
  events: EquiEvent[];
  preselectedEventId?: string;
}

export default function RegistrationWizard({ events, preselectedEventId }: Props) {
  const [step, setStep] = useState<Step>(preselectedEventId ? "rider" : "event");
  const [formData, setFormData] = useState({
    eventId: preselectedEventId ?? "",
    riderId: "",
    horseId: "",
    activityId: "",
    termsAccepted: false,
  });

  const stepIndex = STEPS.indexOf(step);
  const labels = ["Event", "Rider", "Horse", "Activity", "Documents", "Payment", "Confirm"];

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-1">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 flex flex-col items-center gap-1">
            <div className={["w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
              i < stepIndex  ? "bg-[#1a6b4a] text-white" :
              i === stepIndex ? "bg-[#1a6b4a] text-white ring-2 ring-[#1a6b4a]/30" :
                               "bg-gray-100 text-gray-400"].join(" ")}>
              {i < stepIndex ? "✓" : i + 1}
            </div>
            <span className={["text-xs", i === stepIndex ? "text-[#1a6b4a] font-semibold" : "text-gray-400"].join(" ")}>
              {labels[i]}
            </span>
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        {/* ...existing code from user... */}
      </div>

      {/* Nav buttons */}
      {step !== "confirm" && (
        <div className="flex justify-between">
          <button onClick={() => setStep(STEPS[stepIndex - 1])} disabled={stepIndex === 0}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40">
            ← Back
          </button>
          <button onClick={() => setStep(STEPS[stepIndex + 1])}
            disabled={step === "event" && !formData.eventId}
            className="px-4 py-2 text-sm bg-[#1a6b4a] text-white rounded-lg disabled:opacity-40">
            {step === "payment" ? "Confirm & Pay" : "Continue →"}
          </button>
        </div>
      )}
    </div>
  );
}
