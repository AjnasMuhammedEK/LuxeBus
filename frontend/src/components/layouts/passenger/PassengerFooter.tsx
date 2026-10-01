import { MessageCircle, AtSign, Globe, MapPin, Mail, Phone, Smartphone } from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
}

const companyLinks: FooterLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Become an Operator", href: "/become-an-operator" },
];

const supportLinks: FooterLink[] = [
  { label: "Help Center", href: "/help-center" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];

const Footer = () => {
  return (
    <footer className="w-full bg-[#152238] text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-white">LuxeBus</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              LuxeBus is a modern online bus booking platform that helps
              passengers book buses quickly, securely, and comfortably
              across India.
            </p>
            <div className="mt-5 flex items-center gap-4">
              <a href="#" aria-label="Chat" className="text-emerald-400 transition-colors hover:text-emerald-300">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Email" className="text-emerald-400 transition-colors hover:text-emerald-300">
                <AtSign className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Website" className="text-emerald-400 transition-colors hover:text-emerald-300">
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[15px] font-semibold text-white">Company</h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[15px] font-semibold text-white">Support</h3>
            <ul className="mt-4 space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[15px] font-semibold text-white">Contact</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2 text-sm text-slate-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <span>Malappuram, Kerala, India</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                <a href="mailto:supportluxebus@gmail.com" className="transition-colors hover:text-white">
                  supportluxebus@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                <a href="tel:+914004040400" className="transition-colors hover:text-white">
                  +91 4004040400
                </a>
              </li>
            </ul>
          </div>

          {/* Download App */}
          <div>
            <h3 className="text-[15px] font-semibold text-white">Download App</h3>
            <div className="mt-4 flex flex-col gap-3">
              <button
                type="button"
                disabled
                className="flex items-center gap-2 rounded-lg bg-slate-700/60 px-4 py-2 text-sm text-slate-300"
              >
                <Smartphone className="h-4 w-4" />
                App Store (Coming Soon)
              </button>
              <button
                type="button"
                disabled
                className="flex items-center gap-2 rounded-lg bg-slate-700/60 px-4 py-2 text-sm text-slate-300"
              >
                <Smartphone className="h-4 w-4" />
                Play Store (Coming Soon)
              </button>
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="mt-12 border-t border-slate-700/60 pt-6">
          <p className="text-center text-xs text-slate-500">
            © {new Date().getFullYear()} LuxeBus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer