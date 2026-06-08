import { FormData } from "@/app/page";
import BackButton from "./BackButton";
import { useState } from "react";

interface Props {
  formData: FormData;
  onNext: () => void;
  onBack: () => void;
}

const intervalLabel = { einmalig: "Einmalig", monatlich: "Monatlich", jaehrlich: "Jährlich" };
const paymentLabel = { sepa: "SEPA-Lastschrift", dauerauftrag: "Dauerauftrag" };

export default function StepSummary({ formData, onNext, onBack }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const amount = formData.customAmount
    ? parseFloat(formData.customAmount) || 0
    : formData.amount;

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail ?? json.error ?? "Fehler beim Senden");
      onNext();
    } catch {
      setSubmitError("Es ist ein Fehler aufgetreten. Bitte versuche es erneut.");
    } finally {
      setSubmitting(false);
    }
  };

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between items-start py-2" style={{ borderBottom: "1px solid #f1f2f6" }}>
      <span className="text-sm font-semibold" style={{ color: "#8B5E3C" }}>
        {label}
      </span>
      <span className="text-sm font-bold text-right ml-4" style={{ color: "#2D3436" }}>
        {value}
      </span>
    </div>
  );

  return (
    <div className="pt-2 flex flex-col gap-6">
      <BackButton onClick={onBack} />

      <div>
        <h2 className="font-black text-2xl mb-1" style={{ color: "#2D3436" }}>
          Alles korrekt? ✅
        </h2>
        <p className="font-semibold text-sm" style={{ color: "#8B5E3C" }}>
          Bitte prüfe deine Angaben vor dem Absenden.
        </p>
      </div>

      {/* Summary highlight */}
      <div
        className="rounded-3xl p-5 text-center"
        style={{
          background: "linear-gradient(135deg, #FFD93D, #FF6B6B)",
          border: "2.5px solid #2D3436",
          boxShadow: "5px 5px 0 #2D3436",
        }}
      >
        <p className="font-black text-4xl" style={{ color: "#2D3436" }}>
          {amount} €
        </p>
        <p className="font-bold text-base mt-1" style={{ color: "#2D3436" }}>
          {intervalLabel[formData.interval]}
        </p>
      </div>

      {/* Details */}
      <div className="card">
        <p className="font-black text-sm mb-3" style={{ color: "#2D3436" }}>
          👤 Deine Angaben
        </p>
        <Row
          label="Name"
          value={`${formData.salutation ? formData.salutation + " " : ""}${formData.firstName} ${formData.lastName}`}
        />
        <Row label="E-Mail" value={formData.email} />
        {formData.receiptWanted && (
          <Row
            label="Adresse"
            value={`${formData.street} ${formData.houseNumber}, ${formData.zip} ${formData.city}`}
          />
        )}
        <Row label="Zahlungsart" value={paymentLabel[formData.paymentMethod]} />
        {formData.paymentMethod === "sepa" && (
          <Row label="IBAN" value={`•••• •••• •••• ${formData.iban.replace(/\s/g, "").slice(-4)}`} />
        )}
        {formData.message && <Row label="Nachricht" value={formData.message} />}
        <Row label="Spendenquittung" value={formData.receiptWanted ? "Ja" : "Nein"} />
      </div>

      <button
        className="btn-primary text-lg py-5"
        onClick={handleSubmit}
        disabled={submitting}
        style={
          submitting
            ? { opacity: 0.5, cursor: "not-allowed", transform: "none", boxShadow: "none" }
            : {}
        }
      >
        {submitting ? (
          <>
            <span
              className="inline-block w-5 h-5 rounded-full border-2 border-current border-t-transparent"
              style={{ animation: "spin 0.8s linear infinite" }}
            />
            Wird übermittelt…
          </>
        ) : (
          <>🚀 Förderantrag absenden</>
        )}
      </button>

      {submitError && (
        <div className="rounded-2xl p-4 text-sm font-bold text-center" style={{ background: "#FFF0F0", border: "1.5px solid #FF6B6B", color: "#FF6B6B" }}>
          ⚠️ {submitError}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <p className="text-center text-xs font-semibold" style={{ color: "#b2bec3" }}>
        Mit dem Absenden bestätigst du alle obigen Angaben.
      </p>
    </div>
  );
}
