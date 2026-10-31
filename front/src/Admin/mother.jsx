import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  LayoutDashboard,
  Globe,
  Database,
  Users,
  ShieldCheck,
  LogOut,
  Sparkles,
  ArrowRight,
  Settings,
  Home,
  Image,
  Package,
  MessageCircle,
} from "lucide-react";

import AIAssistant from "./AIAssistant";

export default function Mother() {
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;
  const isDashboard = path === "/admin";

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
    },
    {
      title: "Website Management",
      icon: Globe,
      path: "/admin/website",
    },
    {
      title: "Home Management",
      icon: Home,
      path: "/admin/website/home",
    },
    {
      title: "Product Management",
      icon: Package,
      path: "/admin/website/product",
    },
    {
      title: "Header Management",
      icon: Image,
      path: "/admin/website/header",
    },
    {
      title: "Consultation",
      icon: MessageCircle,
      path: "/admin/website/consultation",
    },
    {
      title: "Database",
      icon: Database,
      path: "/admin/database",
    },
    {
      title: "User Management",
      icon: Users,
      path: "/admin/users",
    },
  ];

  const modules = [
    {
      title: "Website Management",
      description:
        "Manage your homepage, website content, images, colors and design.",
      icon: Globe,
      path: "/admin/website",
      number: "01",
    },
    {
      title: "Database Management",
      description:
        "Manage your business records, products and stored information.",
      icon: Database,
      path: "/admin/database",
      number: "02",
    },
    {
      title: "User Management",
      description:
        "Manage administrator accounts, access and user permissions.",
      icon: Users,
      path: "/admin/users",
      number: "03",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 md:flex">
      <aside className="bg-slate-950 p-5 text-white md:min-h-screen md:w-64 md:shrink-0">
        <div className="mb-9 flex items-center gap-3">
          <div className="rounded-xl bg-sky-400 p-2.5 text-slate-950">
            <ShoppingBag size={25} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-wide">LEDORA ADMIN</h1>
            <p className="text-xs text-slate-400">Management Dashboard</p>
          </div>
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Main Menu
        </p>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              item.path === "/admin"
                ? path === "/admin"
                : path === item.path || path.startsWith(item.path + "/");

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                  active
                    ? "bg-sky-400 font-semibold text-slate-950"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.title}
              </button>
            );
          })}
        </nav>

        <div className="my-7 border-t border-slate-800" />

        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Account
        </p>

        <button
          onClick={() => navigate("/admin/logout")}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={18} />
          Sign Out
        </button>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="mb-2 flex items-center gap-2 text-sky-400">
            <ShieldCheck size={18} />
            <span className="text-sm font-semibold">Secure Admin</span>
          </div>

          <p className="text-xs leading-6 text-slate-400">
            Manage your website and business information from one place.
          </p>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 pb-24 md:p-8">
        <div className="mx-auto max-w-7xl">
          {isDashboard ? (
            <>
              <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold tracking-widest text-sky-600">
                    ADMINISTRATION
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                    Welcome to LEDORA
                  </h2>

                  <p className="mt-2 text-sm text-slate-500 md:text-base">
                    Manage your website and business from one dashboard.
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <Sparkles size={19} className="text-sky-500" />
                  <span className="text-sm font-semibold">Admin Dashboard</span>
                </div>
              </header>

              <section className="relative mb-9 overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-sm md:p-10">
                <div className="relative z-10 max-w-2xl">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-300">
                    <ShieldCheck size={16} />
                    Administration Center
                  </div>

                  <h3 className="text-3xl font-bold md:text-4xl">
                    Everything Under Control.
                  </h3>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
                    Your central workspace for managing website content,
                    products, database and administrator accounts.
                  </p>

                  <button
                    onClick={() => navigate("/admin/website")}
                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-sky-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-300"
                  >
                    Manage Website
                    <ArrowRight size={18} />
                  </button>
                </div>

                <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border-[35px] border-sky-400/10" />

                <div className="pointer-events-none absolute -bottom-32 right-24 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />
              </section>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  Management Modules
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Choose a module to manage your business.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {modules.map((module) => {
                  const Icon = module.icon;

                  return (
                    <button
                      key={module.path}
                      onClick={() => navigate(module.path)}
                      className="group relative flex min-h-72 flex-col rounded-3xl border border-slate-200 bg-white p-7 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl"
                    >
                      <div className="mb-7 flex w-full items-center justify-between">
                        <div className="rounded-2xl bg-sky-100 p-5 text-sky-600 transition group-hover:bg-sky-500 group-hover:text-white">
                          <Icon size={34} />
                        </div>

                        <span className="text-3xl font-bold text-slate-100">
                          {module.number}
                        </span>
                      </div>

                      <h4 className="text-xl font-bold text-slate-900">
                        {module.title}
                      </h4>

                      <p className="mt-3 flex-1 text-sm leading-7 text-slate-500">
                        {module.description}
                      </p>

                      <div className="mt-6 flex items-center gap-2 font-semibold text-sky-600">
                        Open Module
                        <ArrowRight
                          size={18}
                          className="transition group-hover:translate-x-2"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <Outlet />
          )}

          <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} LEDORA. All rights reserved.</p>

            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-sky-500" />
              Admin Management System
            </div>
          </footer>
        </div>
      </main>

      <AIAssistant />
    </div>
  );
}
