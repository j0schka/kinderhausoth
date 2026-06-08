import { FormData } from "@/app/page";

interface Props {
  formData: FormData;
}

const intervalLabel = { einmalig: "einmalige", monatlich: "monatliche", jaehrlich: "jährliche" };

export default function StepSuccess({ formData }: Props) {
  const amount = formData.customAmount
    ? parseFloat(formData.customAmount) || 0
    : formData.amount;

  return (
    <div className="pt-4 flex flex-col gap-6 text-center">
      {/* Confetti-style hero */}
      <div
        className="rounded-3xl overflow-hidden flex flex-col items-center justify-center py-10 px-6"
        style={{
          background: "linear-gradient(135deg, #6BCB77 0%, #FFD93D 100%)",
          border: "2.5px solid #2D3436",
          boxShadow: "5px 5px 0 #2D3436",
        }}
      >
        <div className="text-7xl mb-4">🎉</div>
        <h2 className="font-black text-2xl" style={{ color: "#2D3436" }}>
          Vielen herzlichen Dank!
        </h2>
        <p className="font-bold text-base mt-2" style={{ color: "#2D3436", opacity: 0.8 }}>
          {formData.firstName}, du bist großartig! 💛
        </p>
      </div>

      {/* Summary */}
      <div className="card text-left">
        <p className="font-black text-base mb-3" style={{ color: "#2D3436" }}>
          📋 Deine Förderung
        </p>
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: "#FFF9EE", border: "1.5px solid #FFD93D" }}
        >
          <p className="font-black text-3xl" style={{ color: "#2D3436" }}>
            {amount} €
          </p>
          <p className="font-bold text-sm mt-1" style={{ color: "#8B5E3C" }}>
            {intervalLabel[formData.interval]} Förderung
          </p>
        </div>
        {formData.email && (
          <p className="text-sm font-semibold mt-3" style={{ color: "#636e72" }}>
            ✉️ Bestätigung an <strong>{formData.email}</strong> gesendet.
          </p>
        )}
        {formData.receiptWanted && (
          <p className="text-sm font-semibold mt-2" style={{ color: "#636e72" }}>
            📋 Spendenquittung wird einmal jährlich im Dezember ausgestellt.
          </p>
        )}
      </div>

      {/* Share */}
      <div className="card">
        <p className="font-black text-base mb-2" style={{ color: "#2D3436" }}>
          🤝 Andere einladen!
        </p>
        <p className="text-sm font-semibold mb-4" style={{ color: "#636e72" }}>
          Teile den Link zum Förderantrag mit Freunden und Familie!
        </p>
        <button
          className="btn-secondary"
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: "Kinderhaus fördern", url: window.location.href });
            } else {
              navigator.clipboard.writeText(window.location.href);
            }
          }}
        >
          🔗 Link teilen
        </button>
      </div>

      <p className="text-center text-2xl mt-2">🌻🎨🌈🎒💛</p>
    </div>
  );
}
