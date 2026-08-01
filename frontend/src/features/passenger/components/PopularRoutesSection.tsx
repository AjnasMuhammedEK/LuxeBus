
import { Wifi, Zap, Tv, UtensilsCrossed, Snowflake, Leaf, Sun, Mountain } from 'lucide-react'
import type {LucideIcon} from 'lucide-react'

interface RouteData {
  image: string
  badge: string
  badgeStyle: string
  price: string
  from: string
  to: string
  description: string
  icons: LucideIcon[]
}
const routes: RouteData[] = [
  {
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop",
    badge: "FASTEST",
    badgeStyle: "bg-emerald-100 text-emerald-700",
    price: "1,290",
    from: "Ernakulam",
    to: "Bengaluru",
    description: "Multiple daily departures starting at 8:00 PM",
    icons: [Wifi, Zap, Tv],
  },
  {
    image:
      "https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=800&auto=format&fit=crop",
    badge: "MOST BOOKED",
    badgeStyle: "bg-sky-100 text-sky-700",
    price: "899",
    from: "Kochi",
    to: "Chennai",
    description: "Executive sleeper coaches with individual TV screens",
    icons: [UtensilsCrossed, Snowflake, Tv],
  },
  {
    image:
      "https://www.google.com/imgres?q=i%20want%20a%20image%20for%20my%20banner%20of%20my%20website%20like%20the%20bus%20based%20routes%20for%20popoular%20routes&imgurl=https%3A%2F%2Fpng.pngtree.com%2Fthumb_back%2Ffh260%2Fbackground%2F20230704%2Fpngtree-d-illustration-of-bus-service-for-transportation-of-workers-to-remote-image_3743662.jpg&imgrefurl=https%3A%2F%2Fpngtree.com%2Ffree-backgrounds-photos%2Fbus-service&docid=8gsJWq0keaUu0M&tbnid=6bI_BZfqvrn-5M&vet=12ahUKEwi23Nv939GVAxX8SGwGHQhkHFwQnPAOegQIMhAA..i&w=640&h=359&hcb=2&itg=1&ved=2ahUKEwi23Nv939GVAxX8SGwGHQhkHFwQnPAOegQIMhAA",
    badge: "SCENIC ROUTE",
    badgeStyle: "bg-violet-100 text-violet-700",
    price: "650",
    from: "Kozhikode",
    to: "Munnar",
    description: "Breathtaking views through wide panoramic windows",
    icons: [Leaf, Sun, Mountain],
  },
];

const PopularRoutesSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Popular Routes</h2>
          <p className="mt-1 text-sm text-slate-500">Discover our most traveled premium pathways</p>
        </div>
 
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {routes.map((route) => (
          <div
            key={`${route.from}-${route.to}`}
            className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="h-40 w-full">
              <img src={route.image} alt={`${route.from} to ${route.to}`} className="h-full w-full object-cover" />
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className={`rounded-md px-2 py-1 text-[11px] font-bold tracking-wide ${route.badgeStyle}`}>
                  {route.badge}
                </span>
                <span className="text-xs text-slate-500">
                  From <span className="font-semibold text-slate-900">₹{route.price}</span>
                </span>
              </div>

              <h3 className="mt-3 text-[15px] font-semibold text-slate-900">
                {route.from} to {route.to}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{route.description}</p>

              <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-3 text-slate-400">
                {route.icons.map((Icon, index) => (
                  <Icon key={index} className="h-4 w-4" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PopularRoutesSection