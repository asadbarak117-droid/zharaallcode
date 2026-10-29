import { Link, NavLink } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  MessageCircle,
  ArrowUpRight,
  Menu,
  X,
  Sparkles,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/header";

const defaultHeader = {
  logoLetter: "L",
  siteName: "Ledora",
  tagline: "Beauty & Elegance",
  backgroundColor: "#f0f9ff",
  accentColor: "#38bdf8",
  textColor: "#082f49",
  buttonText: "Connect",
  buttonPath: "/connect",
  links: [
    { label: "Home", path: "/", enabled: true },
    { label: "Products", path: "/products", enabled: true },
    { label: "Consultation", path: "/consultation", enabled: true },
    { label: "Connect", path: "/connect", enabled: true },
  ],
};

function getIcon(label) {
  const name = label.toLowerCase();

  if (name.includes("home")) return Home;
  if (name.includes("product") || name.includes("shop")) return ShoppingBag;
  if (name.includes("consult") || name.includes("connect")) {
    return MessageCircle;
  }

  return Globe;
}

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [header, setHeader] = useState(defaultHeader);

  useEffect(() => {
    let active = true;

    async function loadHeader() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Could not load header settings");
        }

        const data = await response.json();
        const settings = data.header ?? data;

        if (active) {
          setHeader({
            ...defaultHeader,
            ...settings,
            links:
              Array.isArray(settings.links) && settings.links.length > 0
                ? settings.links
                : defaultHeader.links,
          });
        }
      } catch (error) {
        console.error("Header loading failed:", error.message);
      }
    }

    loadHeader();

    return () => {
      active = false;
    };
  }, []);

  const links = header.links.filter(
    (link) => link.enabled !== false && link.label && link.path,
  );

  const buttonPath = header.buttonPath || "/connect";
  const buttonText = header.buttonText || "Connect";

  const logoLetter = header.logoLetter || header.siteName?.charAt(0) || "L";

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundColor: `${header.backgroundColor || "#f0f9ff"}f2`,
        color: header.textColor || "#082f49",
        borderColor: `${header.accentColor || "#38bdf8"}35`,
      }}
      className="sticky top-0 z-50 border-b shadow-lg shadow-sky-200/30 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link
          to="/"
          onClick={() => setIsOpen(false)}
          className="group flex shrink-0 items-center gap-3"
        >
          <motion.div
            whileHover={{ rotate: -8, scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            style={{
              background: `linear-gradient(135deg, ${header.accentColor || "#38bdf8"}, #60a5fa)`,
            }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg shadow-sky-300/40 transition-all group-hover:rounded-full"
          >
            <span className="font-serif text-3xl italic text-white">
              {logoLetter}
            </span>
          </motion.div>

          <div>
            <h1 className="font-serif text-xl font-bold tracking-widest transition-colors sm:text-2xl">
              {header.siteName || "Ledora"}
              <span style={{ color: header.accentColor }}>.</span>
            </h1>
            <p
              style={{ color: header.textColor || "#082f49" }}
              className="mt-1 text-[8px] uppercase tracking-[0.25em] opacity-70"
            >
              {header.tagline || "Beauty & Elegance"}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-sky-100 bg-white/90 p-1.5 shadow-sm md:flex">
          {links.map((link) => {
            const Icon = getIcon(link.label);

            return (
              <NavLink
                key={`${link.label}-${link.path}`}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `group flex items-center gap-2 rounded-full px-4 py-3 text-sm transition-all duration-300 lg:px-5 ${
                    isActive
                      ? "text-white shadow-md"
                      : "text-slate-600 hover:bg-sky-50 hover:text-sky-600"
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? {
                        backgroundColor: header.accentColor || "#38bdf8",
                      }
                    : {}
                }
              >
                {({ isActive }) => (
                  <motion.span
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2"
                  >
                    <Icon size={17} />
                    <span>{link.label}</span>

                    {isActive && (
                      <motion.span
                        layoutId="activeNavIndicator"
                        className="h-1.5 w-1.5 rounded-full bg-white"
                      />
                    )}
                  </motion.span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <motion.div
            whileHover={{ y: -3, scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
          >
            <Link
              to="/products"
              aria-label="Go to products"
              title="Shop products"
              style={{ color: header.accentColor }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-sky-100 bg-white transition-colors duration-300 hover:bg-sky-400 hover:text-white hover:shadow-lg"
            >
              <ShoppingBag size={20} />
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
            <Link
              to={buttonPath}
              style={{
                backgroundColor: header.accentColor || "#38bdf8",
              }}
              className="group flex items-center gap-3 rounded-full px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:brightness-95 hover:shadow-lg"
            >
              {buttonText}
              <motion.span whileHover={{ x: 3, y: -3 }} className="flex">
                <ArrowUpRight size={17} />
              </motion.span>
            </Link>
          </motion.div>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          style={{
            backgroundColor: header.accentColor || "#38bdf8",
          }}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-white transition hover:brightness-95 md:hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isOpen ? "close" : "open"}
              initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
              transition={{ duration: 0.18 }}
              className="flex"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: header.backgroundColor || "#f0f9ff",
              borderColor: `${header.accentColor || "#38bdf8"}35`,
            }}
            className="overflow-hidden border-t md:hidden"
          >
            <div className="flex flex-col gap-2 px-5 py-5">
              {links.map((link, index) => {
                const Icon = getIcon(link.label);

                return (
                  <motion.div
                    key={`${link.label}-${link.path}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.07, duration: 0.25 }}
                  >
                    <NavLink
                      to={link.path}
                      end={link.path === "/"}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-2xl border p-4 transition-all duration-300 ${
                          isActive
                            ? "border-transparent text-white"
                            : "border-sky-100 bg-white text-slate-600 hover:bg-sky-50"
                        }`
                      }
                      style={({ isActive }) =>
                        isActive
                          ? {
                              backgroundColor: header.accentColor || "#38bdf8",
                            }
                          : {}
                      }
                    >
                      <span className="flex items-center gap-3">
                        <Icon size={19} />
                        <span>{link.label}</span>
                      </span>
                      <span className="text-xs opacity-60">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </NavLink>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: links.length * 0.07, duration: 0.25 }}
              >
                <Link
                  to={buttonPath}
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: `linear-gradient(to right, ${header.accentColor || "#38bdf8"}, #60a5fa)`,
                  }}
                  className="mt-2 flex items-center justify-between rounded-2xl p-4 font-semibold text-white shadow-md shadow-sky-200/50"
                >
                  <span className="flex items-center gap-3">
                    <Sparkles size={19} />
                    {buttonText}
                  </span>
                  <ArrowUpRight size={19} />
                </Link>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Header;
