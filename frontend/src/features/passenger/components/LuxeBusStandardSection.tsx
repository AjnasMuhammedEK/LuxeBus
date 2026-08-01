import {  Armchair, Clock, Headphones } from 'lucide-react'
import type {LucideIcon} from 'lucide-react'
interface StandardFeature {
  icon: LucideIcon
  title: string
  description: string
}

const features: StandardFeature[] = [
  {
    icon: Armchair,
    title: 'Luxury Seating',
    description:
      'Italian leather recliners with 180-degree leg rests and individual charging ports for every passenger.',
  },
  {
    icon: Clock,
    title: 'On-time Guarantee',
    description: 'We value your time. Our 99% punctuality rate ensures you reach your destination exactly as scheduled.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our dedicated concierge team is available around the clock to assist with bookings or trip inquiries.',
  },
]

const LuxeBusStandardSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 text-center">
      <h2 className="text-2xl font-bold text-slate-900">The LuxeBus Standard</h2>

      <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <feature.icon className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="mt-4 text-[15px] font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default LuxeBusStandardSection