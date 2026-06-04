import { FormData } from "@/app/page";
import BackButton from "./BackButton";

const PRESETS = [5, 10, 25, 50, 100, 200];

interface Props {
  formData: FormData;
  update: (p: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepAmount({ formData, update, onNext, onBack }: Props) {
  const effectiveAmount = formData.customAmount
    ? parseFloat(formData.customAmount) || 0
    : formData.amount;

  const isValid = effectiveAmount >= 1;

  const selectPreset = (v: number) => {
    update({ amount: v, customAmount: "" });
  };

  return (
    <div className="pt-2 flex flex-col gap-6">
      <BackButton onClick={onBack} />

      <div>
        <h2 className="font-black text-2xl mb-1" style={{ color: "#2D3436" }}>
          Wie viel möchtest du geben? 💰
        </h2>
        <p className="font-semibold text-sm" style={{ color: "#8B5E3C" }}>
          Jeder Betrag macht einen Unterschied!
        </p>
      </div>

      {/* Preset amounts */}
      <div className="grid grid-cols-3 gap-3">
        {PRESETS.map((v) => (
          <button
            key={v}
            className={`amount-chip ${!formData.customAmount && formData.amount === v ? "selected" : ""}`}
            onClick={() => selectPreset(v)}
          >
            {v} €
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div>
        <label className="block text-sm font-bold mb-2" style={{ color: "#2D3436" }}>
          Oder eigenen Betrag eingeben:
        </label>
        <div className="relative">
          <input
            type="number"
            min="1"
            placeholder="z.B. 35"
            value={formData.customAmount}
            onChange={(e) => update({ customAmount: e.target.value })}
            className="input-field pr-10"
            style={{ fontSize: "1.1rem" }}
          />
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-lg"
            style={{ color: "#2D3436" }}
          >
            €
          </span>
        </div>
      </div>

      {/* Impact card */}
      {isValid && (
        <div
          className="rounded-2xl p-4 text-sm font-semibold"
          style={{
            background: "#F0FFF4",
            border: "1.5px solid #6BCB77",
          }}
        >
          <span className="font-black">🌱 Mit {effectiveAmount} €</span> kannst du z.B.{" "}
          {effectiveAmount < 15
            ? "Bastelmaterialien für eine Woche finanzieren."
            : effectiveAmount < 50
            ? "einen Ausflug mit 3 Kindern ermöglichen."
            : effectiveAmount < 100
            ? "ein Projektmaterial für das ganze Quartal kaufen."
            : "ein Kindergartenprojekt vollständig umsetzen."}
        </div>
      )}

      <button
        className="btn-primary"
        onClick={onNext}
        disabled={!isValid}
        style={!isValid ? { opacity: 0.4, cursor: "not-allowed", transform: "none", boxShadow: "none" } : {}}
      >
        Weiter → Zahlungsrhythmus
      </button>
    </div>
  );
}
