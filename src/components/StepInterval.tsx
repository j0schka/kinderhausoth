import { FormData, Interval } from "@/app/page";
import BackButton from "./BackButton";

const OPTIONS: { value: Interval; label: string; sub: string; emoji: string }[] = [
  { value: "einmalig", label: "Einmalig", sub: "Eine einzige Förderung", emoji: "🎁" },
  { value: "monatlich", label: "Monatlich", sub: "Regelmäßige Unterstützung", emoji: "📅" },
  { value: "jaehrlich", label: "Jährlich", sub: "Einmal im Jahr", emoji: "🎉" },
];

const PRESETS = [5, 10, 25, 50, 100, 200];

interface Props {
  formData: FormData;
  update: (p: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepInterval({ formData, update, onNext, onBack }: Props) {
  const effectiveAmount = formData.customAmount
    ? parseFloat(formData.customAmount) || 0
    : formData.amount;

  const isValid = effectiveAmount >= 1;

  return (
    <div className="pt-2 flex flex-col gap-6">
      <BackButton onClick={onBack} />

      {/* Rhythmus */}
      <div>
        <h2 className="font-black text-2xl mb-1" style={{ color: "#2D3436" }}>
          Wie oft möchtest du fördern? 🗓
        </h2>
        <p className="font-semibold text-sm" style={{ color: "#8B5E3C" }}>
          Regelmäßige Förderung hilft uns besonders gut zu planen.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => update({ interval: opt.value })}
            className="w-full text-left rounded-2xl p-4 transition-all duration-150"
            style={{
              border: `2px solid ${formData.interval === opt.value ? "#FFD93D" : "#2D3436"}`,
              background: formData.interval === opt.value ? "#FFFBEA" : "white",
              boxShadow: formData.interval === opt.value ? "4px 4px 0 #FFD93D" : "3px 3px 0 #2D3436",
              cursor: "pointer",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{opt.emoji}</span>
                <div>
                  <p className="font-black text-base" style={{ color: "#2D3436" }}>
                    {opt.label}
                  </p>
                  <p className="text-xs font-semibold" style={{ color: "#8B5E3C" }}>
                    {opt.sub}
                  </p>
                </div>
              </div>
              {formData.interval === opt.value && (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "#FFD93D", border: "2px solid #2D3436" }}
                >
                  <span style={{ fontSize: "10px" }}>✓</span>
                </div>
              )}
            </div>
            {formData.interval === opt.value && opt.value === "monatlich" && (
              <div
                className="mt-2 text-xs font-bold rounded-full px-3 py-1 inline-block"
                style={{ background: "#FFD93D", border: "1.5px solid #2D3436" }}
              >
                ⭐ Meistgewählt
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: "rgba(45,52,54,0.15)" }} />
        <span className="text-sm font-bold" style={{ color: "#8B5E3C" }}>Und wie viel?</span>
        <div className="flex-1 h-px" style={{ background: "rgba(45,52,54,0.15)" }} />
      </div>

      {/* Betrag */}
      <div>
        <h2 className="font-black text-2xl mb-1" style={{ color: "#2D3436" }}>
          Wie viel möchtest du geben? 💰
        </h2>
        <p className="font-semibold text-sm" style={{ color: "#8B5E3C" }}>
          Jeder Betrag macht einen Unterschied!
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {PRESETS.map((v) => (
          <button
            key={v}
            className={`amount-chip ${!formData.customAmount && formData.amount === v ? "selected" : ""}`}
            onClick={() => update({ amount: v, customAmount: "" })}
          >
            {v} €
          </button>
        ))}
      </div>

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

      <button
        className="btn-primary"
        onClick={onNext}
        disabled={!isValid}
        style={!isValid ? { opacity: 0.4, cursor: "not-allowed", transform: "none", boxShadow: "none" } : {}}
      >
        Weiter → Deine Daten
      </button>
    </div>
  );
}
