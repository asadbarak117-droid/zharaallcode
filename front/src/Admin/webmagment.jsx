import { useNavigate } from "react-router-dom";
import {
  House,
  ArrowRight,
  Package,
  PanelsTopLeft,
  MessageCircle,
  Sparkles,
  LayoutDashboard,
  Globe,
  Database,
  Users,
  LogOut,
  Settings,
} from "lucide-react";

export default function WebManagement() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Header Management",
      description:
        "Manage your website logo, name, tagline, navigation links, buttons, and header colors.",
      button: "Manage Header",
      path: "/admin/website/header",
      icon: PanelsTopLeft,
      color: "sky",
    },
    {
      title: "Home Management",
      description:
        "Edit homepage text, images, colors, banners, sections, and page layout.",
      button: "Manage Home",
      path: "/admin/website/home",
      icon: House,
      color: "blue",
    },
    {
      title: "Product Management",
      description:
        "Add, edit, delete, and manage products, prices, images, and stock.",
      button: "Manage Products",
      path: "/admin/website/product",
      icon: Package,
      color: "purple",
    },
    {
      title: "Consultation Management",
      description:
        "Manage skin and hair problems, descriptions, and helpful beauty tips.",
      button: "Manage Consultation",
      path: "/admin/website/consultation",
      icon: Sparkles,
      color: "pink",
    },
    {
      title: "Connect Management",
      description:
        "Manage contact information, social media links, and customer messages.",
      button: "Manage Connect",
      path: "/admin/website/connect",
      icon: MessageCircle,
      color: "cyan",
    },
  ];

  const colors = {
    sky: {
      icon: "bg-sky-100 text-sky-600 group-hover:bg-sky-500",
      text: "text-sky-600",
    },
    blue: {
      icon: "bg-blue-100 text-blue-600 group-hover:bg-blue-500",
      text: "text-blue-600",
    },
    purple: {
      icon: "bg-purple-100 text-purple-600 group-hover:bg-purple-500",
      text: "text-purple-600",
    },
    pink: {
      icon: "bg-pink-100 text-pink-600 group-hover:bg-pink-500",
      text: "text-pink-600",
    },
    cyan: {
      icon: "bg-cyan-100 text-cyan-600 group-hover:bg-cyan-500",
      text: "text-cyan-600",
    },
  };

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
    },
    {
      title: "Website Management",
      icon: Globe,
      path: "/admin/website",
      active: true,
    },
    {
      title: "Database",
      icon: Database,
      path: "/admin/database",
    },
    {
      title: "Users",
      icon: Users,
      path: "/admin/users",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      {/* Sidebar */}
      <aside className="w-full bg-slate-950 p-5 text-white md:min-h-screen md:w-64 md:shrink-0">
        <div className="mb-10 border-b border-slate-800 pb-6">
          <h1 className="text-2xl font-bold tracking-wide">LEDORA</h1>
          <p className="mt-2 text-sm text-slate-400">Admin Management</p>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                type="button"
                onClick={() => navigate(item.path)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  item.active
                    ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={19} />
                {item.title}
              </button>
            );
          })}
        </nav>

        <div className="mt-10 border-t border-slate-800 pt-6">
          <button
            type="button"
            onClick={() => navigate("/admin/logout")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500 hover:text-white"
          >
            <LogOut size={19} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-5 md:p-8">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sky-600">
                <Settings size={19} />
                <span className="text-sm font-semibold">WEBSITE SETTINGS</span>
              </div>

              <h1 className="text-3xl font-bold text-slate-800">
                Website Management
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Manage and customize your public website.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-sky-400 hover:text-sky-600"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>
          </div>

          {/* Information Section */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-sky-100 p-3 text-sky-600">
                <Globe size={25} />
              </div>

              <div>
                <h2 className="font-bold text-slate-800">
                  Website Control Center
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Select a section below to manage the content and appearance of
                  your LEDORA website.
                </p>
              </div>
            </div>
          </div>

          {/* Management Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {sections.map((item) => {
              const Icon = item.icon;
              const color = colors[item.color];

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl md:p-8"
                >
                  <div
                    className={`mb-5 inline-flex rounded-xl p-4 transition group-hover:text-white ${color.icon}`}
                  >
                    <Icon size={32} />
                  </div>

                  <h2 className="mb-3 text-xl font-bold text-slate-800">
                    {item.title}
                  </h2>

                  <p className="mb-6 min-h-14 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>

                  <span
                    className={`flex items-center gap-2 text-sm font-semibold ${color.text}`}
                  >
                    {item.button}
                    <ArrowRight
                      size={18}
                      className="transition group-hover:translate-x-1"
                    />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} LEDORA. All rights reserved.
          </div>
        </div>
      </main>
    </div>
  );
}
