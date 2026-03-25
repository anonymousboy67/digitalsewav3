export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px"
          }}
        />
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />
        <div className="absolute top-1/3 -right-20 w-48 h-48 bg-emerald-400/20 rounded-full" />

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <span className="text-white font-bold text-2xl" style={{ fontFamily: "var(--font-outfit)" }}>DS</span>
            </div>
            <span className="text-white font-bold text-3xl" style={{ fontFamily: "var(--font-outfit)" }}>
              DigitalSewa
            </span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            Nepal&apos;s Local Freelancing Hub
          </h2>
          <p className="text-teal-100 text-lg max-w-sm mx-auto leading-relaxed mb-12">
            Connect with verified local talent. Pay in NPR. Build trust in your community.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: "Freelancers", value: "500+" },
              { label: "Projects", value: "200+" },
              { label: "Districts", value: "20+" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <p className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                  {stat.value}
                </p>
                <p className="text-teal-200 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
