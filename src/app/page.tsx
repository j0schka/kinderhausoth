"use client";

import { useState } from "react";
import StepStart from "@/components/StepStart";
import StepInterval from "@/components/StepInterval";
import StepPersonal from "@/components/StepPersonal";
import StepPayment from "@/components/StepPayment";
import StepSummary from "@/components/StepSummary";
import StepSuccess from "@/components/StepSuccess";
import ProgressBar from "@/components/ProgressBar";

export type Interval = "einmalig" | "monatlich" | "jaehrlich";
export type PaymentMethod = "sepa" | "dauerauftrag";

export interface FormData {
  amount: number;
  customAmount: string;
  interval: Interval;
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  houseNumber: string;
  zip: string;
  city: string;
  receiptWanted: boolean;
  paymentMethod: PaymentMethod;
  iban: string;
  accountHolder: string;
  sepaConfirmed: boolean;
  message: string;
  privacyAccepted: boolean;
}

const defaultFormData: FormData = {
  amount: 100,
  customAmount: "",
  interval: "monatlich",
  salutation: "",
  firstName: "",
  lastName: "",
  email: "",
  street: "",
  houseNumber: "",
  zip: "",
  city: "",
  receiptWanted: false,
  paymentMethod: "sepa",
  iban: "",
  accountHolder: "",
  sepaConfirmed: false,
  message: "",
  privacyAccepted: false,
};

const STEPS = ["start", "interval", "personal", "payment", "summary", "success"] as const;
type Step = (typeof STEPS)[number];

export default function Home() {
  const [step, setStep] = useState<Step>("start");
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  const update = (patch: Partial<FormData>) =>
    setFormData((d) => ({ ...d, ...patch }));

  const stepIndex = STEPS.indexOf(step);
  const totalSteps = 5;
  const progressStep = Math.max(0, Math.min(stepIndex - 1, totalSteps));

  const next = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };
  const back = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const showProgress = step !== "start" && step !== "success";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(160deg, #FFF9EE 0%, #FFF0C8 100%)" }}
    >
      {/* Header */}
      <header className="w-full px-4 pt-5 pb-3 flex items-center justify-between mx-auto max-w-lg">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🏡</span>
          <div>
            <p className="font-black text-sm leading-tight" style={{ color: "#2D3436" }}>
              Kindertagesstätte Onkel-Toms-Hütte e.V.
            </p>
            <p className="text-xs font-semibold" style={{ color: "#8B5E3C" }}>
              Förderantrag
            </p>
          </div>
        </div>
        {showProgress && (
          <div className="text-sm font-bold" style={{ color: "#8B5E3C" }}>
            Schritt {progressStep} / {totalSteps}
          </div>
        )}
      </header>

      {/* Progress bar */}
      {showProgress && (
        <div className="px-4 max-w-lg mx-auto w-full mb-4">
          <ProgressBar current={progressStep} total={totalSteps} />
        </div>
      )}

      {/* Content */}
      <main className="flex-1 px-4 pb-10 max-w-lg mx-auto w-full">
        {step === "start" && <StepStart onNext={next} />}
        {step === "interval" && (
          <StepInterval formData={formData} update={update} onNext={next} onBack={back} />
        )}
        {step === "personal" && (
          <StepPersonal formData={formData} update={update} onNext={next} onBack={back} />
        )}
        {step === "payment" && (
          <StepPayment formData={formData} update={update} onNext={next} onBack={back} />
        )}
        {step === "summary" && (
          <StepSummary formData={formData} onNext={next} onBack={back} />
        )}
        {step === "success" && <StepSuccess formData={formData} />}
      </main>
    </div>
  );
}
