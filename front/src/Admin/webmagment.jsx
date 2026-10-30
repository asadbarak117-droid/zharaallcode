import { useNavigate } from "react-router-dom";
import {
  House,
  ArrowRight,
  Package,
  PanelsTopLeft,
  MessageCircle,
  Sparkles,
  ShoppingBag,
  LayoutDashboard,
  Globe,
  Database,
  Users,
  LogOut,
} from "lucide-react";

const tabs = [
  {
    id: "header",
    label: "Header Management",
    icon: PanelsTopLeft,
    path: "/admin/website/header",
  },
  {
    id: "home",
    label: "Home Management",
    icon: House,
    path: "/admin/website/home",
  },
  {
    id: "products",
    label: "Product Management",
    icon: Package,
    path: "/admin/website/product",
  },
  {
    id: "consultation",
    label: "Consultation Management",
    icon: Sparkles,
    path: "/admin/website/consultation",
  },
  {
    id: "connect",
    label: "Connect Management",
    icon: MessageCircle,
    path: "/admin/website/connect",
  },
];

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  {
    label: "Website Management",
    icon: Globe,
    path: "/admin/website",
    active: true,
  },
  { label: "Database", icon: Database, path: "/admin/database" },
  { label: "Users", icon: Users, path: "/admin/users" },
];

const colors = {
  sky: {
    icon: "bg-sky-100 text-sky-600 group-hover:bg-sky-600",
    text: "text-sky-600",
  },
  blue: {
    icon: "bg-blue-100 text-blue-600 group-hover:bg-blue-600",
    text: "text-blue-600",
  },
  purple: {
    icon: "bg-purple-100 text-purple-600 group-hover:bg-purple-600",
    text: "text-purple-600",
  },
  pink: {
    icon: "bg-pink-100 text-pink-600 group-hover:bg-pink-600",
    text: "text-pink-600",
  },
  cyan: {
    icon: "bg-cyan-100 text-cyan-600 group-hover:bg-cyan-600",
    text: "text-cyan-600",
  },
};

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

export default function WebManagement() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 md:flex">
      {/* Sidebar */}
      <aside className="bg-slate-950 p-5 text-white md:min-h-screen md:w-64 md:shrink-0">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-sky-400 p-2 text-slate-950">
            <ShoppingBag size={23} />
          </div>

          <div>
            <h1 className="font-bold">Website Admin</h1>
            <p className="text-xs text-slate-400">Content management</p>
          </div>
        </div>

        <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                  item.active
                    ? "bg-sky-400 font-semibold text-slate-950"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-8 border-t border-slate-800 pt-5">
          <button
            type="button"
            onClick={() => navigate("/admin/logout")}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-400 transition hover:bg-red-500 hover:text-white"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-5xl">
          {/* Page Header */}
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-sky-600">
                WEBSITE SETTINGS
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-800">
                Website Management
              </h2>

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

          {/* Information Card */}
          <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-sky-100 p-3 text-sky-600">
                <Globe size={25} />
              </div>

              <div>
                <h3 className="font-bold text-slate-800">
                  Website Control Center
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Select a section below to manage your LEDORA website content,
                  products, design, and customer information.
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

                  <h3 className="mb-3 text-xl font-bold text-slate-800">
                    {item.title}
                  </h3>

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
