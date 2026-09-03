import Link from "next/link";
import { Eyebrow } from "@/components/Eyebrow";

const features = [
  {
    title: "AI-driven business insights",
    description:
      "Turn your documents, emails, and schedules into action-ready insights that drive growth and efficiency.",
  },
  {
    title: "Manual uploads for docs, PDFs, and Excel",
    description:
      "Securely add business files for later AI analysis and graph generation without changing your existing workflow.",
  },
  {
    title: "Smart email and calendar workflows",
    description:
      "Compose mail, sync inbox workflows, and schedule events all inside a unified CRM experience.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface px-6 py-10 text-ink">
      <div className="mx-auto max-w-6xl">
        <section className="space-y-8 rounded-[2rem] border border-hairline bg-surface-2 p-10 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="max-w-4xl space-y-6">
            <Eyebrow>aeson.ai — AI business CRM for modern teams</Eyebrow>
            <h1 className="display max-w-4xl text-ink sm:text-6xl">
              Build insight-driven business operations with AI, automation, and scheduling.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted">
              aeson.ai connects your documents, emails, tasks, and calendar into one intelligent workspace. Analyze business files, automate follow-ups, and turn daily operations into measurable growth.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/login"
                className="rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-ink transition-colors duration-200 ease-out hover:bg-accent-hover"
              >
                Get started
              </Link>
              <Link
                href="/dashboard"
                className="rounded-sm border border-hairline bg-surface px-6 py-3 text-sm font-semibold text-ink transition-colors duration-200 ease-out hover:bg-surface-3"
              >
                View demo dashboard
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-[1.5rem] border border-hairline bg-surface p-6">
                <h2 className="text-lg font-semibold text-ink">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
