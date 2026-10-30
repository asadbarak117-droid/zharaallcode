import { useNavigate } from "react-router-dom";
import {
  Globe,
  Database,
  ArrowRight,
  Users,
  ShoppingBag,
  LayoutDashboard,
  Home,
  Settings,
  ShieldCheck,
  LogOut,
  Sparkles,
} from "lucide-react";

export default function Mother() {
  const navigate = useNavigate();

  const options = [
    {
      title: "Website Management",
      description:
        "Manage your homepage, products, consultation, images, colors and website design.",
      button: "Manage Website",
      path: "/admin/website",
      icon: Globe,
      color: "sky",
      number: "01",
    },
    {
      title: "Database Management",
      description:
        "Manage stored records, products, accounting information and business data.",
      button: "Manage Database",
      path: "/admin/database",
      icon: Database,
      color: "violet",
      number: "02",
    },
    {
      title: "User Management",
      description:
        "Manage administrator accounts, control access and manage user permissions.",
      button: "Manage Users",
      path: "/admin/users",
      icon: Users,
      color: "emerald",
      number: "03",
    },
  ];

  const colorStyles = {
    sky: {
      icon: "bg-sky-100 text-sky-600 group-hover:bg-sky-500 group-hover:text-white",
      button: "text-sky-600",
      line: "bg-sky-500",
    },
    violet: {
      icon: "bg-violet-100 text-violet-600 group-hover:bg-violet-500 group-hover:text-white",
      button: "text-violet-600",
      line: "bg-violet-500",
    },
    emerald: {
      icon: "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white",
      button: "text-emerald-600",
      line: "bg-emerald-500",
    },
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 md:flex">
      {/* Sidebar */}
      <aside className="bg-slate-950 p-5 text-white md:min-h-screen md:w-64 md:shrink-0">
        <div className="mb-10 flex items-center gap-3">
          <div className="rounded-xl bg-sky-400 p-2.5 text-slate-950">
            <ShoppingBag size={25} />
          </div>

          <div>
            <h1 className="text-lg font-bold">LEDORA ADMIN</h1>
            <p className="text-xs text-slate-400">Management Dashboard</p>
          </div>
        </div>

        <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Main Menu
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => navigate("/admin")}
            className="flex w-full items-center gap-3 rounded-xl bg-sky-400 px-4 py-3 text-left text-sm font-semibold text-slate-950"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/website")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <Globe size={19} />
            Website Management
          </button>

          <button
            onClick={() => navigate("/admin/database")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <Database size={19} />
            Database
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <Users size={19} />
            User Management
          </button>
        </nav>

        <div className="my-7 border-t border-slate-800" />

        <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Account
        </div>

        <button
          onClick={() => navigate("/admin/logout")}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={19} />
          Sign Out
        </button>

        <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="mb-2 flex items-center gap-2 text-sky-400">
            <ShieldCheck size={18} />
            <span className="text-sm font-semibold">Admin Access</span>
          </div>
          <p className="text-xs leading-6 text-slate-400">
            Authorized administrators can manage the website and business data.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-4 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <header className="mb-9 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold tracking-widest text-sky-600">
                ADMINISTRATION
              </p>

              <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                Welcome to Admin Panel
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500 md:text-base">
                Manage your website, database and users in one place.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <Sparkles size={19} className="text-sky-500" />
              <span className="text-sm font-semibold text-slate-700">
                LEDORA Dashboard
              </span>
            </div>
          </header>

          {/* Welcome Banner */}
          <section className="relative mb-9 overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-lg md:p-10">
            <div className="relative z-10 max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-300">
                <ShieldCheck size={16} />
                Administration Center
              </div>

              <h2 className="text-2xl font-bold md:text-4xl">
                Everything Under Control.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
                Your central workspace for managing website content, business
                records and administrator accounts.
              </p>

              <button
                onClick={() => navigate("/admin/website")}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-sky-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-300"
              >
                Manage Your Website
                <ArrowRight size={19} />
              </button>
            </div>

            <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border-[35px] border-sky-400/10" />
            <div className="pointer-events-none absolute -bottom-32 right-24 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />
          </section>

          {/* Section Heading */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Management Modules
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select a section to manage your business.
              </p>
            </div>

            <span className="rounded-lg bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700">
              03 Modules
            </span>
          </div>

          {/* Management Cards */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {options.map((item) => {
              const Icon = item.icon;
              const styles = colorStyles[item.color];

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="group relative flex min-h-[320px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 text-left shadow-sm transition duration-300 hover:-translate-y-2 hover:border-sky-200 hover:shadow-xl md:p-8"
                >
                  <div
                    className={`absolute left-0 top-0 h-1 w-full ${styles.line}`}
                  />

                  <div className="mb-7 flex w-full items-center justify-between">
                    <div
                      className={`rounded-2xl p-5 transition duration-300 ${styles.icon}`}
                    >
                      <Icon size={35} />
                    </div>

                    <span className="text-3xl font-bold text-slate-100 transition group-hover:text-slate-200">
                      {item.number}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 md:text-2xl">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      {item.description}
                    </p>
                  </div>

                  <div
                    className={`mt-7 flex items-center gap-2 font-semibold ${styles.button}`}
                  >
                    {item.button}

                    <ArrowRight
                      size={19}
                      className="transition-transform duration-300 group-hover:translate-x-2"
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} LEDORA. All rights reserved.</p>

            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-sky-500" />
              <span>Admin Management System</span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
