import { useNavigate } from "react-router-dom";
import {
  House,
  ArrowRight,
  Package,
  PanelsTopLeft,
  MessageCircle,
  Sparkles,
} from "lucide-react";

export default function WebManagement() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-12">
      <h1 className="mb-3 text-3xl font-bold text-slate-800">
        Website Management
      </h1>

      <p className="mb-10 text-slate-500">
        Manage and customize your public website.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Header Management */}
        <button
          type="button"
          onClick={() => navigate("/admin/website/header")}
          className="group rounded-2xl bg-white p-8 text-left shadow-md transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="mb-5 inline-flex rounded-xl bg-sky-100 p-4 text-sky-600 transition group-hover:bg-sky-600 group-hover:text-white">
            <PanelsTopLeft size={36} />
          </div>

          <h2 className="mb-3 text-xl font-bold text-slate-800">
            Header Management
          </h2>

          <p className="mb-5 text-sm leading-6 text-slate-500">
            Manage your website logo, name, tagline, navigation links, button,
            and header colors.
          </p>

          <span className="flex items-center gap-2 font-semibold text-sky-600">
            Manage Header
            <ArrowRight size={18} />
          </span>
        </button>

        {/* Home Management */}
        <button
          type="button"
          onClick={() => navigate("/admin/website/home")}
          className="group rounded-2xl bg-white p-8 text-left shadow-md transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="mb-5 inline-flex rounded-xl bg-blue-100 p-4 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
            <House size={36} />
          </div>

          <h2 className="mb-3 text-xl font-bold text-slate-800">
            Home Management
          </h2>

          <p className="mb-5 text-sm leading-6 text-slate-500">
            Edit the homepage text, images, colors, banners, and layout.
          </p>

          <span className="flex items-center gap-2 font-semibold text-blue-600">
            Manage Home
            <ArrowRight size={18} />
          </span>
        </button>

        {/* Product Management */}
        <button
          type="button"
          onClick={() => navigate("/admin/website/product")}
          className="group rounded-2xl bg-white p-8 text-left shadow-md transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="mb-5 inline-flex rounded-xl bg-purple-100 p-4 text-purple-600 transition group-hover:bg-purple-600 group-hover:text-white">
            <Package size={36} />
          </div>

          <h2 className="mb-3 text-xl font-bold text-slate-800">
            Product Management
          </h2>

          <p className="mb-5 text-sm leading-6 text-slate-500">
            Add, edit, delete, and manage your products, prices, images, and
            stock.
          </p>

          <span className="flex items-center gap-2 font-semibold text-purple-600">
            Manage Products
            <ArrowRight size={18} />
          </span>
        </button>

        {/* Consultation Management */}
        <button
          type="button"
          onClick={() => navigate("/admin/website/consultation")}
          className="group rounded-2xl bg-white p-8 text-left shadow-md transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="mb-5 inline-flex rounded-xl bg-pink-100 p-4 text-pink-600 transition group-hover:bg-pink-600 group-hover:text-white">
            <Sparkles size={36} />
          </div>

          <h2 className="mb-3 text-xl font-bold text-slate-800">
            Consultation Management
          </h2>

          <p className="mb-5 text-sm leading-6 text-slate-500">
            Add, edit, and delete skin and hair problems, descriptions, and
            helpful beauty tips displayed on your consultation page.
          </p>

          <span className="flex items-center gap-2 font-semibold text-pink-600">
            Manage Consultation
            <ArrowRight size={18} />
          </span>
        </button>

        {/* Connect Management */}
        <button
          type="button"
          onClick={() => navigate("/admin/website/connect")}
          className="group rounded-2xl bg-white p-8 text-left shadow-md transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="mb-5 inline-flex rounded-xl bg-cyan-100 p-4 text-cyan-600 transition group-hover:bg-cyan-600 group-hover:text-white">
            <MessageCircle size={36} />
          </div>

          <h2 className="mb-3 text-xl font-bold text-slate-800">
            Connect Management
          </h2>

          <p className="mb-5 text-sm leading-6 text-slate-500">
            Manage contact information, social media links, and customer
            messages from your Connect page.
          </p>

          <span className="flex items-center gap-2 font-semibold text-cyan-600">
            Manage Connect
            <ArrowRight size={18} />
          </span>
        </button>
      </div>
    </div>
  );
}
