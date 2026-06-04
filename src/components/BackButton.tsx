interface Props {
  onClick: () => void;
  label?: string;
}

export default function BackButton({ onClick, label = "Zurück" }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-sm font-bold mb-5"
      style={{ color: "#8B5E3C", background: "none", border: "none", cursor: "pointer" }}
    >
      <span>←</span> {label}
    </button>
  );
}
