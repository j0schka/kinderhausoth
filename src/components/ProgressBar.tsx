interface Props {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const pct = Math.min(100, (current / total) * 100);
  return (
    <div className="w-full">
      <div
        className="w-full h-3 rounded-full"
        style={{ background: "rgba(45,52,54,0.12)", border: "1.5px solid rgba(45,52,54,0.15)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-in-out"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #FFD93D, #FF6B6B)",
            minWidth: pct > 0 ? "1.5rem" : "0",
          }}
        />
      </div>
    </div>
  );
}
