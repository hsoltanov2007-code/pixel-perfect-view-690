import { localizeDescription } from "@/lib/product-image";
import { useI18n } from "@/lib/i18n";

export function LocalizedDescription({
  description,
  className = "",
}: {
  description: string;
  className?: string;
}) {
  const { lang } = useI18n();
  const text = localizeDescription(description, lang);
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return null;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {paragraphs.map((p, i) => (
        <p key={i} className="leading-relaxed">
          {p.split("\n").map((line, idx, arr) => (
            <span key={idx}>
              {line}
              {idx < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
