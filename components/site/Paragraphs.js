// Long text is stored as plain text; blank lines separate paragraphs.
export default function Paragraphs({ text, className = "" }) {
  if (!text?.trim()) return null;
  return (
    <div className={`space-y-5 ${className}`}>
      {text.trim().split(/\n\s*\n/).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}
