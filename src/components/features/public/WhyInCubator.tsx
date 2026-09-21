const ROADMAP_PREVIEW = [
  { label: "Prototype validé", state: "done" as const },
  { label: "Mentorat démarré", state: "done" as const },
  { label: "Deal Room configurée", state: "active" as const },
  { label: "Levée en préparation", state: "pending" as const },
];

export default function WhyInCubator() {
  return (
    <section className="w-full bg-white px-6 py-24 sm:px-10 lg:py-32" data-theme="light">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Heading row */}
        <div className="mb-14 flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <p className="font-serif text-6xl font-black text-violet-dark lg:text-7xl">2026</p>
            <p className="mt-2 text-sm font-semibold text-gray-main">Cohorte ouverte aux candidatures</p>
          </div>
          <h2 className="font-serif text-4xl font-black uppercase leading-[0.95] tracking-tight text-violet-dark text-right sm:text-5xl">
            Pourquoi
            <br />
            IN-CUBATOR
          </h2>
        </div>

        {/* Bento row */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Roadmap card — spans full height on the left */}
          <div className="rounded-[1.75rem] border border-black/5 bg-white p-7 shadow-[0_15px_45px_rgba(71,41,92,0.08)] lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-main">Roadmap · Cohorte 2026</p>
              <span className="rounded-full bg-violet-main/10 px-3 py-1 text-xs font-bold text-violet-dark">65%</span>
            </div>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {ROADMAP_PREVIEW.map((item) => (
                <li key={item.label} className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                      item.state === "done"
                        ? "bg-green-main text-white"
                        : item.state === "active"
                          ? "bg-violet-main/15 text-violet-dark"
                          : "border border-black/10 text-transparent"
                    }`}
                  >
                    {item.state === "done" ? "✓" : "•"}
                  </span>
                  <span className={`text-sm font-semibold ${item.state === "pending" ? "text-gray-main" : "text-violet-dark"}`}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-black/5">
              <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-violet-main to-blue-main" />
            </div>
          </div>

          {/* Two stacked tiles */}
          <div className="flex flex-col gap-5">
            <div className="flex-1 rounded-[1.75rem] bg-yellow-orange/20 p-7">
              <p className="mb-3 text-2xl">🤝</p>
              <p className="font-serif text-lg font-bold text-violet-dark">Mentorat 1:1</p>
              <p className="mt-1 text-sm text-violet-dark/70">Des experts qui ont déjà bâti, choisis pour votre secteur.</p>
            </div>
            <div className="flex-1 rounded-[1.75rem] bg-violet-main/10 p-7">
              <p className="mb-3 text-2xl">🔒</p>
              <p className="font-serif text-lg font-bold text-violet-dark">Deal Room sécurisée</p>
              <p className="mt-1 text-sm text-violet-dark/70">Documents tracés, accès investisseurs contrôlé.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
