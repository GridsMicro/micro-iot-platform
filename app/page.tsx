import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-950">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-10 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400 rounded-lg blur-md group-hover:blur-lg transition-all opacity-50"></div>
                <div className="relative bg-gradient-to-br from-emerald-400 to-teal-500 p-2 rounded-lg">
                  <span className="text-2xl">🌱</span>
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
                Smart Farm
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/smarthome">Smart Home</NavLink>
              <NavLink href="/docs">Docs</NavLink>
              <NavLink href="/docs/hardware/esp32-setup">ESP32</NavLink>
              <NavLink href="/docs/hardware/stm32-getting-started">STM32</NavLink>
              <NavLink href="/docs/hardware/power-solutions">Power</NavLink>
              <NavLink href="/docs/hardware/water-management">Water</NavLink>
              <NavLink href="/docs/hardware/ai-crop-analysis">AI</NavLink>
              <NavLink href="https://github.com/GridsMicro/micro-iot-platform" external>
                GitHub
              </NavLink>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg glass-card">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        <div className="max-w-5xl w-full space-y-12">

          {/* Main Hero Content */}
          <div className="text-center space-y-6 animate-fade-in-up">
            {/* Neon Icon */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full flex items-center justify-center border-2 border-emerald-400/50 shadow-2xl shadow-emerald-500/50">
                <span className="text-7xl animate-float">🌱</span>
              </div>
            </div>

            {/* Title with Neon Effect */}
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              <span className="block bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-300 bg-clip-text text-transparent animate-gradient">
                Smart Farm
              </span>
              <span className="block mt-2 text-4xl md:text-6xl bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-transparent">
                IoT Platform 2025
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-emerald-100/90 max-w-3xl mx-auto font-light">
              Open Hardware, Closed Platform Strategy
              <br />
              <span className="text-lg text-emerald-200/70">
                The future of agriculture is here. Build your smart farm with affordable components.
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/docs"
                className="group relative px-8 py-4 rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:from-emerald-400 group-hover:to-teal-400"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-300"></div>
                <span className="relative flex items-center gap-2 text-lg font-semibold text-white">
                  Get Started
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>

              <Link
                href="/docs/hardware/esp32-setup"
                className="group px-8 py-4 rounded-full glass-card border-2 border-emerald-400/30 hover:border-emerald-400/60 transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center gap-2 text-lg font-medium text-emerald-100">
                  Hardware Guides
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up animation-delay-200">
            <FeatureCard
              icon="⚡"
              title="Real-time Monitoring"
              description="Live sensor data via EMQX MQTT broker with sub-second latency"
              gradient="from-yellow-400/20 to-orange-500/20"
              glowColor="yellow"
            />
            <FeatureCard
              icon="🤖"
              title="No-Code Automation"
              description="Drag & drop rules engine. If soil dry, then pump ON. Simple."
              gradient="from-blue-400/20 to-purple-500/20"
              glowColor="blue"
            />
            <FeatureCard
              icon="📊"
              title="AI Analytics"
              description="Smart insights for crop health and yield optimization"
              gradient="from-pink-400/20 to-rose-500/20"
              glowColor="pink"
            />
          </div>

          {/* Tech Stack Badges */}
          <div className="flex flex-wrap justify-center gap-3 pt-8 animate-fade-in-up animation-delay-400">
            <TechBadge>Next.js 15</TechBadge>
            <TechBadge>Supabase</TechBadge>
            <TechBadge>EMQX MQTT</TechBadge>
            <TechBadge>ESP32</TechBadge>
            <TechBadge>TypeScript</TechBadge>
            <TechBadge>Tailwind v4</TechBadge>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 glass border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-emerald-200/60 text-sm">
            © 2025 Smart Farm IoT Platform. Built with ❤️ for the Future of Farming.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Navigation Link Component
function NavLink({ href, children, external = false }: { href: string; children: React.ReactNode; external?: boolean }) {
  const className = "px-4 py-2 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
  gradient,
  glowColor
}: {
  icon: string;
  title: string;
  description: string;
  gradient: string;
  glowColor: string;
}) {
  return (
    <div className="group relative">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
      <div className="relative glass-card p-6 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
        <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-emerald-100 mb-2">{title}</h3>
        <p className="text-emerald-200/70 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// Tech Badge Component
function TechBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-4 py-2 rounded-full glass-card border border-emerald-400/30 text-emerald-200 text-sm font-medium hover:border-emerald-400/60 hover:scale-105 transition-all duration-200">
      {children}
    </span>
  );
}
