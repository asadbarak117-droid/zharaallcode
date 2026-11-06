import { useState, useEffect } from "react";
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
  Home,
  Image,
  Package,
  MessageCircle,
  Menu,
  X,
  ChevronRight,
  Settings,
  BarChart3,
  UserCog,
  FolderOpen,
  Palette,
} from "lucide-react";

import AIAssistant from "./AIAssistant";

export default function Mother() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const isDashboard = path === "/admin";

  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setSidebarOpen(isDashboard);
  }, [path, isDashboard]);

  const sidebarMenus = {
    dashboard: [
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
        title: "Database",
        icon: Database,
        path: "/admin/database",
      },
      {
        title: "User Management",
        icon: Users,
        path: "/admin/users",
      },
    ],

    website: [
      {
        title: "Website Overview",
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
        title: "Website Design",
        icon: Palette,
        path: "/admin/website/design",
      },
    ],

    database: [
      {
        title: "Database Overview",
        icon: Database,
        path: "/admin/database",
      },
      {
        title: "Products Database",
        icon: Package,
        path: "/admin/database/products",
      },
      {
        title: "Business Records",
        icon: FolderOpen,
        path: "/admin/database/records",
      },
      {
        title: "Reports",
        icon: BarChart3,
        path: "/admin/database/reports",
      },
      {
        title: "Database Settings",
        icon: Settings,
        path: "/admin/database/settings",
      },
    ],

    users: [
      {
        title: "User Overview",
        icon: Users,
        path: "/admin/users",
      },
      {
        title: "Manage Users",
        icon: UserCog,
        path: "/admin/users/manage",
      },
      {
        title: "Permissions",
        icon: ShieldCheck,
        path: "/admin/users/permissions",
      },
      {
        title: "User Reports",
        icon: BarChart3,
        path: "/admin/users/reports",
      },
      {
        title: "Settings",
        icon: Settings,
        path: "/admin/users/settings",
      },
    ],
  };

  const getCurrentMenu = () => {
    if (path.startsWith("/admin/website")) {
      return {
        title: "Website Management",
        subtitle: "Website Workspace",
        icon: Globe,
        items: sidebarMenus.website,
      };
    }

    if (path.startsWith("/admin/database")) {
      return {
        title: "Database Management",
        subtitle: "Database Workspace",
        icon: Database,
        items: sidebarMenus.database,
      };
    }

    if (path.startsWith("/admin/users")) {
      return {
        title: "User Management",
        subtitle: "User Workspace",
        icon: Users,
        items: sidebarMenus.users,
      };
    }

    return {
      title: "LEDORA ADMIN",
      subtitle: "Management Dashboard",
      icon: ShoppingBag,
      items: sidebarMenus.dashboard,
    };
  };

  const currentMenu = getCurrentMenu();
  const CurrentIcon = currentMenu.icon;

  const isActive = (itemPath) => {
    if (itemPath === "/admin") {
      return path === "/admin";
    }

    return path === itemPath || path.startsWith(itemPath + "/");
  };

  const handleNavigation = (targetPath) => {
    navigate(targetPath);
  };

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
    <div className="flex min-h-screen w-full bg-slate-100 text-slate-800">
      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* SINGLE SHARED SIDEBAR */}

      {sidebarOpen && (
        <aside
          className="
            fixed inset-y-0 left-0 z-50
            flex h-screen w-72 shrink-0 flex-col
            overflow-y-auto bg-slate-950 p-5 text-white
            shadow-xl transition-all duration-300
            md:sticky md:top-0 md:z-30 md:shadow-none
          "
        >
          {/* LOGO */}

          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-sky-400 p-2.5 text-slate-950">
                <ShoppingBag size={25} />
              </div>

              <div>
                <h1 className="text-lg font-bold tracking-wide">
                  LEDORA ADMIN
                </h1>

                <p className="text-xs text-slate-400">{currentMenu.subtitle}</p>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <X size={21} />
            </button>
          </div>

          {/* CURRENT SECTION */}

          <div className="mb-5 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3">
            <CurrentIcon size={21} className="text-sky-400" />

            <div>
              <p className="text-sm font-semibold">{currentMenu.title}</p>

              <p className="text-xs text-slate-400">Current Workspace</p>
            </div>
          </div>

          {/* NAVIGATION */}

          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Navigation
          </p>

          <nav className="space-y-2">
            {currentMenu.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition ${
                    active
                      ? "bg-sky-400 font-semibold text-slate-950"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={19} />
                    {item.title}
                  </span>

                  <ChevronRight size={17} />
                </button>
              );
            })}
          </nav>

          {/* BACK TO DASHBOARD */}

          {!isDashboard && (
            <>
              <div className="my-7 border-t border-slate-800" />

              <button
                onClick={() => navigate("/admin")}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <LayoutDashboard size={19} />
                Back to Dashboard
              </button>
            </>
          )}

          {/* ACCOUNT */}

          <div className="my-7 border-t border-slate-800" />

          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Account
          </p>

          <button
            onClick={() => navigate("/admin/logout")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={19} />
            Sign Out
          </button>

          {/* SECURITY */}

          <div className="mt-auto pt-8">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <div className="mb-2 flex items-center gap-2 text-sky-400">
                <ShieldCheck size={18} />
                <span className="text-sm font-semibold">Secure Admin</span>
              </div>

              <p className="text-xs leading-6 text-slate-400">
                Manage your website and business information from one place.
              </p>
            </div>
          </div>
        </aside>
      )}

      {/* MAIN CONTENT */}

      <main className="min-w-0 flex-1 p-4 transition-all duration-300 md:p-8">
        {/* TOP BAR */}

        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:bg-slate-50"
              >
                <Menu size={20} />
                <span className="text-sm font-semibold">Open Sidebar</span>
              </button>
            )}

            <div>
              <p className="text-xs font-semibold tracking-widest text-sky-600">
                LEDORA ADMIN
              </p>

              <p className="text-sm text-slate-500">{currentMenu.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <Sparkles size={19} className="text-sky-500" />
            <span className="text-sm font-semibold">Admin Dashboard</span>
          </div>
        </header>

        {/* MOTHER DASHBOARD */}

        {isDashboard ? (
          <div className="mx-auto max-w-7xl">
            <section className="mb-8">
              <p className="text-sm font-semibold tracking-widest text-sky-600">
                ADMINISTRATION
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                Welcome to LEDORA
              </h2>

              <p className="mt-2 text-sm text-slate-500 md:text-base">
                Manage your website and business from one dashboard.
              </p>
            </section>

            {/* HERO */}

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
                  Your central workspace for managing website content, products,
                  database and administrator accounts.
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

            {/* MODULES */}

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

            {/* FOOTER */}

            <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500">
              <p>© {new Date().getFullYear()} LEDORA. All rights reserved.</p>

              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-sky-500" />
                Admin Management System
              </div>
            </footer>
          </div>
        ) : (
          /* CHILD PAGES */

          <div className="min-h-screen w-full min-w-0">
            <Outlet />
          </div>
        )}
      </main>

      {/* AI ASSISTANT */}

      <AIAssistant />
    </div>
  );
}
