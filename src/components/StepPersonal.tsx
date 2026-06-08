import { FormData } from "@/app/page";
import BackButton from "./BackButton";
import { useState } from "react";

interface Props {
  formData: FormData;
  update: (p: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepPersonal({ formData, update, onNext, onBack }: Props) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const touch = (f: string) => setTouched((t) => ({ ...t, [f]: true }));

  const errors: Record<string, string> = {};
  if (!formData.firstName.trim()) errors.firstName = "Bitte Vornamen eingeben";
  if (!formData.lastName.trim()) errors.lastName = "Bitte Nachnamen eingeben";
  if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
    errors.email = "Bitte gültige E-Mail eingeben";
  if (formData.receiptWanted) {
    if (!formData.street.trim()) errors.street = "Bitte Straße eingeben";
    if (!formData.houseNumber.trim()) errors.houseNumber = "Bitte Hausnummer eingeben";
    if (!formData.zip.trim()) errors.zip = "Bitte PLZ eingeben";
    if (!formData.city.trim()) errors.city = "Bitte Ort eingeben";
  }

  const isValid = Object.keys(errors).length === 0;

  const handleNext = () => {
    setTouched({ firstName: true, lastName: true, email: true, street: true, houseNumber: true, zip: true, city: true });
    if (isValid) onNext();
  };

  const field = (
    id: keyof FormData,
    label: string,
    placeholder: string,
    type = "text",
    half = false,
    autoComplete = "on"
  ) => (
    <div className={half ? "" : "col-span-2"}>
      <label className="block text-sm font-bold mb-1.5" style={{ color: "#2D3436" }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={String(formData[id] ?? "")}
        onChange={(e) => update({ [id]: e.target.value } as Partial<FormData>)}
        onBlur={() => touch(id)}
        className="input-field"
        style={touched[id] && errors[id] ? { borderColor: "#FF6B6B" } : {}}
        autoComplete={autoComplete}
        name={id}
      />
      {touched[id] && errors[id] && (
        <p className="text-xs font-bold mt-1" style={{ color: "#FF6B6B" }}>
          {errors[id]}
        </p>
      )}
    </div>
  );

  return (
    <div className="pt-2 flex flex-col gap-6">
      <BackButton onClick={onBack} />

      <div>
        <h2 className="font-black text-2xl mb-1" style={{ color: "#2D3436" }}>
          Deine Angaben 👤
        </h2>
        <p className="font-semibold text-sm" style={{ color: "#8B5E3C" }}>
          Diese Daten werden nur für den Antrag verwendet.
        </p>
      </div>

      <div className="card flex flex-col gap-4">
        {/* Anrede */}
        <div>
          <label className="block text-sm font-bold mb-1.5" style={{ color: "#2D3436" }}>
            Anrede
          </label>
          <select
            value={formData.salutation}
            onChange={(e) => update({ salutation: e.target.value })}
            className="input-field select"
            autoComplete="honorific-prefix"
            name="salutation"
          >
            <option value="">Bitte wählen</option>
            <option value="Herr">Herr</option>
            <option value="Frau">Frau</option>
            <option value="Divers">Divers / Keine Angabe</option>
          </select>
        </div>

        {/* Name grid */}
        <div className="grid grid-cols-2 gap-3">
          {field("firstName", "Vorname *", "Max", "text", true, "given-name")}
          {field("lastName", "Nachname *", "Mustermann", "text", true, "family-name")}
        </div>

        {field("email", "E-Mail-Adresse *", "max@beispiel.de", "email", false, "email")}

        {/* Optional message */}
        <div>
          <label className="block text-sm font-bold mb-1.5" style={{ color: "#2D3436" }}>
            Nachricht (optional)
          </label>
          <textarea
            placeholder="Möchtest du dem Kinderhaus etwas mitteilen?"
            value={formData.message}
            onChange={(e) => update({ message: e.target.value })}
            rows={3}
            className="input-field"
            style={{ resize: "none" }}
          />
        </div>
      </div>

      {/* Receipt toggle */}
      <button
        className="w-full text-left rounded-2xl p-4"
        onClick={() => update({ receiptWanted: !formData.receiptWanted })}
        style={{
          border: `2px solid ${formData.receiptWanted ? "#6BCB77" : "#2D3436"}`,
          background: formData.receiptWanted ? "#F0FFF4" : "white",
          boxShadow: `3px 3px 0 ${formData.receiptWanted ? "#6BCB77" : "#2D3436"}`,
          cursor: "pointer",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              border: "2px solid #2D3436",
              background: formData.receiptWanted ? "#6BCB77" : "white",
            }}
          >
            {formData.receiptWanted && <span style={{ color: "white", fontSize: "14px" }}>✓</span>}
          </div>
          <div>
            <p className="font-black text-sm" style={{ color: "#2D3436" }}>
              📋 Spendenquittung gewünscht
            </p>
            <p className="text-xs font-semibold" style={{ color: "#8B5E3C" }}>
              Ab 300 € steuerlich absetzbar · Quittung wird einmal jährlich im Dezember ausgestellt
            </p>
          </div>
        </div>
      </button>

      {/* Address fields */}
      {formData.receiptWanted && (
        <div className="card flex flex-col gap-4">
          <p className="font-black text-sm" style={{ color: "#2D3436" }}>
            📬 Postanschrift
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              {field("street", "Straße *", "Musterstraße", "text", true, "address-line1")}
            </div>
            <div>{field("houseNumber", "Nr. *", "12a", "text", true, "address-line2")}</div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>{field("zip", "PLZ *", "12345", "text", true, "postal-code")}</div>
            <div className="col-span-2">{field("city", "Ort *", "München", "text", true, "address-level2")}</div>
          </div>
        </div>
      )}

      <button
        className="btn-primary"
        onClick={handleNext}
        style={
          !isValid
            ? { opacity: 0.5, cursor: "not-allowed", transform: "none", boxShadow: "none" }
            : {}
        }
      >
        Weiter → Zahlungsart
      </button>
    </div>
  );
}
