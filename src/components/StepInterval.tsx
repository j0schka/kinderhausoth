import { FormData, Interval } from "@/app/page";
import BackButton from "./BackButton";

const OPTIONS: { value: Interval; label: string; sub: string; emoji: string }[] = [
  { value: "einmalig", label: "Einmalig", sub: "Eine einzige Förderung", emoji: "🎁" },
  { value: "monatlich", label: "Monatlich", sub: "Regelmäßige Unterstützung", emoji: "📅" },
  { value: "jaehrlich", label: "Jährlich", sub: "Einmal im Jahr", emoji: "🎉" },
];

interface Props {
  formData: FormData;
  update: (p: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepInterval({ formData, update, onNext, onBack }: Props) {
  const amount = formData.customAmount
    ? parseFloat(formData.customAmount) || 0
    : formData.amount;

  return (
    <div className="pt-2 flex flex-col gap-6">
      <BackButton onClick={onBack} />

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
              <div
                className="font-black text-base"
                style={{ color: formData.interval === opt.value ? "#2D3436" : "#636e72" }}
              >
                {amount} € {opt.value === "monatlich" ? "/Mo" : opt.value === "jaehrlich" ? "/Jahr" : ""}
              </div>
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

      <button className="btn-primary" onClick={onNext}>
        Weiter → Deine Daten
      </button>
    </div>
  );
}
