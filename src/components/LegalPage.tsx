import { Link } from "@tanstack/react-router";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useI18n } from "@/lib/i18n";
import { getLegalDoc, legalLabels, type LegalSlug } from "@/lib/legal";

const routes: Record<LegalSlug, string> = {
  privacy: "/privacy",
  terms: "/terms",
  refund: "/refund",
};

export default function LegalPage({ slug }: { slug: LegalSlug }) {
  const { lang } = useI18n();
  const doc = getLegalDoc(lang, slug);
  const labels = legalLabels[lang];

  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <main className="relative mx-auto max-w-3xl px-6 pb-24 pt-32">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">2G SHOP</p>
        <h1 className="mt-4 text-4xl font-semibold text-gradient sm:text-5xl">{doc.title}</h1>
        <p className="mt-3 text-xs text-muted-foreground">{doc.updated}</p>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{doc.intro}</p>

        <div className="divider-line my-10" />

        <div className="space-y-10">
          {doc.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-lg font-semibold text-foreground">{s.heading}</h2>
              <ul className="mt-3 space-y-2">
                {s.body.map((p) => (
                  <li key={p} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="divider-line my-10" />

        <nav className="flex flex-wrap gap-3">
          {(Object.keys(routes) as LegalSlug[])
            .filter((s) => s !== slug)
            .map((s) => (
              <Link
                key={s}
                to={routes[s]}
                className="rounded-full glass px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {labels[s]}
              </Link>
            ))}
        </nav>
      </main>
      <Footer />
    </div>
  );
}
