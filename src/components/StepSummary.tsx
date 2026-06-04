import { FormData } from "@/app/page";
import BackButton from "./BackButton";
import Link from "next/link";
import { useState } from "react";

interface Props {
  formData: FormData;
  onNext: () => void;
  onBack: () => void;
}

const intervalLabel = { einmalig: "Einmalig", monatlich: "Monatlich", jaehrlich: "Jährlich" };
const paymentLabel = { sepa: "SEPA-Lastschrift", paypal: "PayPal", kreditkarte: "Kreditkarte" };

export default function StepSummary({ formData, onNext, onBack }: Props) {
  const [privacyAccepted, setPrivacyAccepted] = useState(formData.privacyAccepted);
  const [submitting, setSubmitting] = useState(false);

  const amount = formData.customAmount
    ? parseFloat(formData.customAmount) || 0
    : formData.amount;

  const handleSubmit = async () => {
    if (!privacyAccepted) return;
    setSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    onNext();
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

      {/* Privacy */}
      <button
        className="w-full text-left rounded-2xl p-4"
        onClick={() => setPrivacyAccepted((v) => !v)}
        style={{
          border: `2px solid ${privacyAccepted ? "#6BCB77" : "#2D3436"}`,
          background: privacyAccepted ? "#F0FFF4" : "white",
          boxShadow: `3px 3px 0 ${privacyAccepted ? "#6BCB77" : "#2D3436"}`,
          cursor: "pointer",
        }}
      >
        <div className="flex gap-3">
          <div
            className="w-6 h-6 rounded flex-shrink-0 flex items-center justify-center mt-0.5"
            style={{
              border: "2px solid #2D3436",
              background: privacyAccepted ? "#6BCB77" : "white",
              minWidth: "1.5rem",
            }}
          >
            {privacyAccepted && <span style={{ color: "white", fontSize: "13px" }}>✓</span>}
          </div>
          <p className="text-sm font-semibold leading-relaxed" style={{ color: "#636e72" }}>
            Ich habe die{" "}
            <Link href="/datenschutz" target="_blank" style={{ color: "#4DA8FF", fontWeight: "bold" }}>Datenschutzerklärung</Link> gelesen
            und bin damit einverstanden, dass meine Daten zur Bearbeitung des Förderantrags genutzt werden. *
          </p>
        </div>
      </button>

      <button
        className="btn-primary text-lg py-5"
        onClick={handleSubmit}
        disabled={!privacyAccepted || submitting}
        style={
          !privacyAccepted || submitting
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

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <p className="text-center text-xs font-semibold" style={{ color: "#b2bec3" }}>
        Mit dem Absenden bestätigst du alle obigen Angaben.
      </p>
    </div>
  );
}
