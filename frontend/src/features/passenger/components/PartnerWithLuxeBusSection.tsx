import { Bus, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
const PartnerWithLuxeBusSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-72 w-full sm:h-80">
        {/* Background design - layered gradient + subtle pattern, no image needed */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

        {/* Diagonal amber glow accents */}
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Large faded bus icon as a decorative watermark */}
        <Bus
          className="pointer-events-none absolute -right-8 top-1/2 h-56 w-56 -translate-y-1/2 text-amber-400/[0.06] sm:h-64 sm:w-64"
          strokeWidth={1}
        />

        {/* Top and bottom hairline borders for a premium, structured feel */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <span className="mb-3 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-400">
            Become an Operator
          </span>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Partner with LuxeBus</h2>
          <p className="mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
            Join India&apos;s most exclusive network of premium inter-city travel operators. Scale your business
            with our elite clientele and industry-leading technology platform.
          </p>
          <Link
          to='/operator/register'
            
            className="mt-6 flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-amber-400"
          >
            <Bus className="h-4 w-4" />
            List Your Buses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default PartnerWithLuxeBusSection