import Link from "next/link";

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
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-10 text-slate-200">
      <section className="space-y-8 rounded-[2rem] border border-slate-800 bg-slate-950/90 p-10 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-2 text-sm text-indigo-200 ring-1 ring-indigo-500/20">
            OperaOPS — AI business CRM for modern teams
          </div>
          <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            Build insight-driven business operations with AI, automation, and scheduling.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-400">
            OperaOPS connects your documents, emails, tasks, and calendar into one intelligent workspace. Analyze business files, automate follow-ups, and turn daily operations into measurable growth.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Get started
            </Link>
            <Link
              href="/dashboard"
              className="rounded-2xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
            >
              View demo dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <h2 className="text-lg font-semibold text-white">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
