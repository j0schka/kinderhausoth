interface Props {
  onNext: () => void;
}

export default function StepStart({ onNext }: Props) {
  return (
    <div className="pt-4 flex flex-col gap-6">
      {/* Hero illustration */}
      <div
        className="rounded-3xl overflow-hidden flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #6BCB77 0%, #4DA8FF 100%)",
          border: "2.5px solid #2D3436",
          boxShadow: "5px 5px 0 #2D3436",
          minHeight: "200px",
        }}
      >
        <div className="text-center p-6">
          <div className="text-7xl mb-3">🎒🌈🎨</div>
          <p className="text-white font-black text-xl" style={{ textShadow: "1px 2px 0 rgba(0,0,0,0.2)" }}>
            Gemeinsam für unsere Kinder!
          </p>
        </div>
      </div>

      {/* Intro card */}
      <div className="card">
        <h1 className="font-black text-2xl mb-3" style={{ color: "#2D3436" }}>
          Kinderhaus fördern 💛
        </h1>
        <p className="font-semibold leading-relaxed mb-2" style={{ color: "#636e72" }}>
          Mit deiner Unterstützung können wir tolle Projekte, Ausflüge und Materialien für unsere Kinder ermöglichen.
        </p>
        <p className="font-semibold leading-relaxed" style={{ color: "#636e72" }}>
          Der Antrag dauert nur{" "}
          <strong style={{ color: "#2D3436" }}>2–3 Minuten</strong> und hilft uns
          enorm weiter. Danke! 🙏
        </p>
      </div>

      {/* Trust badges */}
      <div className="flex gap-3 flex-wrap">
        {[
          { icon: "🔒", text: "Sicher & verschlüsselt" },
          { icon: "📋", text: "Spendenquittung möglich" },
          { icon: "✊", text: "Gemeinnützig" },
        ].map((b) => (
          <div
            key={b.text}
            className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold"
            style={{
              background: "white",
              border: "1.5px solid #2D3436",
              boxShadow: "2px 2px 0 #2D3436",
            }}
          >
            <span>{b.icon}</span>
            <span>{b.text}</span>
          </div>
        ))}
      </div>

      <button className="btn-primary text-lg py-4" onClick={onNext}>
        Jetzt Förderantrag stellen 🚀
      </button>

      <p className="text-center text-xs font-semibold" style={{ color: "#b2bec3" }}>
        Keine Verpflichtung • Jederzeit kündbar
      </p>
    </div>
  );
}
