import { useState } from "react"

interface DestinationData {
  image: string
  title: string
  description: string

}

const destinations: DestinationData[] = [
  {
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&auto=format&fit=crop",
    title: "Agra: The Eternal Monument",
    description: "Experience the majestic beauty of the Taj Mahal at sunrise.",
   
  },
  {
    image: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=1200&auto=format&fit=crop",
    title: "Alleppey: Emerald Backwaters",
    description: "Cruise through Kerala's serene palm-fringed waterways in a luxury houseboat.",

  },
  {
    image: "https://images.unsplash.com/photo-1736950825214-1b5e2bdbb5f8?w=1200&auto=format&fit=crop",
    title: "Munnar: Misty Tea Estates",
    description: "Breathe in the fresh air of rolling green hills and misty tea plantations.",

  },
  {
    image: "https://images.unsplash.com/photo-1722934804353-0d9f6a55ab5e?w=1200&auto=format&fit=crop",
    title: "Hampi: Ancient Heritage",
    description: "Discover the surreal boulder-strewn landscapes and historic ruins of the Vijayanagara Empire.",

  },
  {
    image: "https://images.unsplash.com/photo-1582972236019-ea4af5ffe587?w=1200&auto=format&fit=crop",
    title: "Goa: Coastal Paradise",
    description: "Relax on golden beaches, enjoy vibrant nightlife, and experience Portuguese heritage.",

  },
  {
    image: "https://images.unsplash.com/photo-1524229321985-1e1989075d9b?w=1200&auto=format&fit=crop",
    title: "Jaipur: The Pink City",
    description: "Explore magnificent forts, royal palaces, and colorful markets.",
 
  },
  {
    image: "https://images.unsplash.com/photo-1638886540342-240980f60d25?w=1200&auto=format&fit=crop",
    title: "Ooty: Queen of the Hills",
    description: "Escape to lush gardens, winding mountain roads, and cool weather.",
  
  },
  {
    image: "https://images.unsplash.com/photo-1657856855186-7cf4909a4f78?w=1200&auto=format&fit=crop",
    title: "Mysuru: Royal Heritage",
    description: "Visit the magnificent Mysore Palace and experience Karnataka's royal culture.",
  },
]

 
const track = [...destinations, ...destinations]

 
const SECONDS_PER_ITEM = 4
const DURATION = destinations.length * SECONDS_PER_ITEM

const ExploreDestinationsSection = () => {
  const [isPaused, setIsPaused] = useState(false)

  return (
    <section className="bg-slate-50 py-16">
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl font-bold text-slate-900">Explore Iconic Destinations</h2>
        <p className="mt-1 text-sm text-slate-500">
          Curated luxury experiences across India&apos;s most breathtaking locales
        </p>

        <div
          className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="flex w-max"
            style={{
              animation: `marquee-scroll ${DURATION}s linear infinite`,
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {track.map((destination, i) => (
              <div
                key={`${destination.title}-${i}`}
                className="w-[85vw] shrink-0 px-3 sm:w-[45vw] lg:w-[380px]"
              >
                <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md">
                  <div className="h-36 w-full">
                    <img
                      src={destination.image}
                      alt={destination.title}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-[15px] font-semibold text-slate-900">{destination.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {destination.description}
                    </p>
                     
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExploreDestinationsSection