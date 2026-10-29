import { useNavigate } from "react-router-dom";
import { Globe, Database, ArrowRight } from "lucide-react";

export default function Mother() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-slate-800 md:text-5xl">
            Welcome to Admin Panel
          </h1>

          <p className="text-base text-slate-500 md:text-lg">
            Manage your website and database in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <button
            onClick={() => navigate("/admin/website")}
            className="group flex min-h-[280px] flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="mb-6 rounded-2xl bg-blue-100 p-6 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
              <Globe size={52} />
            </div>

            <h2 className="mb-3 text-2xl font-bold text-slate-800">
              Website Management
            </h2>

            <p className="mb-6 max-w-sm text-slate-500">
              Manage Home, Products, Consultation, images, colors and website
              design.
            </p>

            <span className="flex items-center gap-2 font-semibold text-blue-600">
              Manage Website
              <ArrowRight size={20} />
            </span>
          </button>

          <button
            onClick={() => navigate("/admin/database")}
            className="group flex min-h-[280px] flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="mb-6 rounded-2xl bg-purple-100 p-6 text-purple-600 transition group-hover:bg-purple-600 group-hover:text-white">
              <Database size={52} />
            </div>

            <h2 className="mb-3 text-2xl font-bold text-slate-800">
              Database Management
            </h2>

            <p className="mb-6 max-w-sm text-slate-500">
              Manage stored records, products, and business data.
            </p>

            <span className="flex items-center gap-2 font-semibold text-purple-600">
              Manage Database
              <ArrowRight size={20} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
