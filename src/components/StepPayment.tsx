import { FormData, PaymentMethod } from "@/app/page";
import BackButton from "./BackButton";
import { useState } from "react";

const METHODS: { value: PaymentMethod; label: string; emoji: string; desc: string }[] = [
  { value: "sepa", label: "SEPA-Lastschrift", emoji: "🏦", desc: "Direkt vom Konto – kostenlos" },
  { value: "paypal", label: "PayPal", emoji: "🔵", desc: "Schnell & sicher" },
  { value: "kreditkarte", label: "Kreditkarte", emoji: "💳", desc: "Visa, Mastercard, Amex" },
];

interface Props {
  formData: FormData;
  update: (p: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

function formatIBAN(raw: string) {
  return raw.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim().toUpperCase();
}

export default function StepPayment({ formData, update, onNext, onBack }: Props) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const touch = (f: string) => setTouched((t) => ({ ...t, [f]: true }));

  const errors: Record<string, string> = {};
  if (formData.paymentMethod === "sepa") {
    const ibanClean = formData.iban.replace(/\s/g, "");
    if (!ibanClean || ibanClean.length < 15) errors.iban = "Bitte gültige IBAN eingeben";
    if (!formData.accountHolder.trim()) errors.accountHolder = "Bitte Kontoinhaber eingeben";
    if (!formData.sepaConfirmed) errors.sepaConfirmed = "Bitte SEPA-Mandat bestätigen";
  }

  const isValid = Object.keys(errors).length === 0;

  const handleNext = () => {
    setTouched({ iban: true, accountHolder: true, sepaConfirmed: true });
    if (isValid) onNext();
  };

  return (
    <div className="pt-2 flex flex-col gap-6">
      <BackButton onClick={onBack} />

      <div>
        <h2 className="font-black text-2xl mb-1" style={{ color: "#2D3436" }}>
          Zahlungsart wählen 💳
        </h2>
        <p className="font-semibold text-sm" style={{ color: "#8B5E3C" }}>
          Sicher und verschlüsselt übertragen.
        </p>
      </div>

      {/* Payment method selector */}
      <div className="flex flex-col gap-3">
        {METHODS.map((m) => (
          <button
            key={m.value}
            onClick={() => update({ paymentMethod: m.value })}
            className="w-full text-left rounded-2xl p-4"
            style={{
              border: `2px solid ${formData.paymentMethod === m.value ? "#4DA8FF" : "#2D3436"}`,
              background: formData.paymentMethod === m.value ? "#EFF8FF" : "white",
              boxShadow: `3px 3px 0 ${formData.paymentMethod === m.value ? "#4DA8FF" : "#2D3436"}`,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{
                  border: "2px solid #2D3436",
                  background: formData.paymentMethod === m.value ? "#4DA8FF" : "white",
                }}
              >
                {formData.paymentMethod === m.value && (
                  <span style={{ color: "white", fontSize: "12px" }}>✓</span>
                )}
              </div>
              <span className="text-xl">{m.emoji}</span>
              <div>
                <p className="font-black text-base" style={{ color: "#2D3436" }}>
                  {m.label}
                </p>
                <p className="text-xs font-semibold" style={{ color: "#8B5E3C" }}>
                  {m.desc}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* SEPA fields */}
      {formData.paymentMethod === "sepa" && (
        <div className="card flex flex-col gap-4">
          <p className="font-black text-sm" style={{ color: "#2D3436" }}>
            🏦 SEPA-Bankdaten
          </p>

          <div>
            <label className="block text-sm font-bold mb-1.5" style={{ color: "#2D3436" }}>
              Kontoinhaber *
            </label>
            <input
              type="text"
              placeholder="Max Mustermann"
              value={formData.accountHolder}
              onChange={(e) => update({ accountHolder: e.target.value })}
              onBlur={() => touch("accountHolder")}
              className="input-field"
              style={touched.accountHolder && errors.accountHolder ? { borderColor: "#FF6B6B" } : {}}
            />
            {touched.accountHolder && errors.accountHolder && (
              <p className="text-xs font-bold mt-1" style={{ color: "#FF6B6B" }}>
                {errors.accountHolder}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold mb-1.5" style={{ color: "#2D3436" }}>
              IBAN *
            </label>
            <input
              type="text"
              placeholder="DE89 3704 0044 0532 0130 00"
              value={formData.iban}
              onChange={(e) => update({ iban: formatIBAN(e.target.value) })}
              onBlur={() => touch("iban")}
              className="input-field"
              style={{
                letterSpacing: "0.05em",
                ...(touched.iban && errors.iban ? { borderColor: "#FF6B6B" } : {}),
              }}
              maxLength={34}
            />
            {touched.iban && errors.iban && (
              <p className="text-xs font-bold mt-1" style={{ color: "#FF6B6B" }}>
                {errors.iban}
              </p>
            )}
          </div>

          {/* SEPA mandate */}
          <button
            className="w-full text-left rounded-xl p-3"
            onClick={() => {
              update({ sepaConfirmed: !formData.sepaConfirmed });
              touch("sepaConfirmed");
            }}
            style={{
              border: `1.5px solid ${
                touched.sepaConfirmed && errors.sepaConfirmed
                  ? "#FF6B6B"
                  : formData.sepaConfirmed
                  ? "#6BCB77"
                  : "#b2bec3"
              }`,
              background: formData.sepaConfirmed ? "#F0FFF4" : "#f8f9fa",
              cursor: "pointer",
            }}
          >
            <div className="flex gap-3">
              <div
                className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center mt-0.5"
                style={{
                  border: "2px solid #2D3436",
                  background: formData.sepaConfirmed ? "#6BCB77" : "white",
                  minWidth: "1.25rem",
                }}
              >
                {formData.sepaConfirmed && (
                  <span style={{ color: "white", fontSize: "11px" }}>✓</span>
                )}
              </div>
              <p className="text-xs font-semibold leading-relaxed" style={{ color: "#636e72" }}>
                Ich ermächtige das Kinderhaus, Zahlungen von meinem Konto per Lastschrift einzuziehen.
                Ich kann die Zahlung innerhalb von 8 Wochen zurückbuchen lassen.
              </p>
            </div>
          </button>
          {touched.sepaConfirmed && errors.sepaConfirmed && (
            <p className="text-xs font-bold -mt-2" style={{ color: "#FF6B6B" }}>
              {errors.sepaConfirmed}
            </p>
          )}
        </div>
      )}

      {/* PayPal info */}
      {formData.paymentMethod === "paypal" && (
        <div
          className="rounded-2xl p-4 text-sm font-semibold"
          style={{ background: "#EFF8FF", border: "1.5px solid #4DA8FF" }}
        >
          🔵 Du wirst nach dem Absenden zu PayPal weitergeleitet, um die Zahlung zu bestätigen.
        </div>
      )}

      {/* Credit card info */}
      {formData.paymentMethod === "kreditkarte" && (
        <div
          className="rounded-2xl p-4 text-sm font-semibold"
          style={{ background: "#FFF0F0", border: "1.5px solid #FF6B6B" }}
        >
          💳 Du wirst nach dem Absenden zur sicheren Zahlungsseite weitergeleitet.
        </div>
      )}

      {/* Security note */}
      <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: "#b2bec3" }}>
        <span>🔒</span>
        <span>Alle Zahlungsdaten werden SSL-verschlüsselt übertragen.</span>
      </div>

      <button
        className="btn-primary"
        onClick={handleNext}
        style={
          !isValid
            ? { opacity: 0.5, cursor: "not-allowed", transform: "none", boxShadow: "none" }
            : {}
        }
      >
        Weiter → Zusammenfassung
      </button>
    </div>
  );
}
