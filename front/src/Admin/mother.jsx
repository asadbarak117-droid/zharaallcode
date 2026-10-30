import { useNavigate } from "react-router-dom";
import { Globe, Database, ArrowRight, Users } from "lucide-react";

export default function Mother() {
  const navigate = useNavigate();

  const options = [
    {
      title: "Website Management",
      description:
        "Manage Home, Products, Consultation, images, colors and website design.",
      button: "Manage Website",
      path: "/admin/website",
      icon: <Globe size={52} />,
      color: "blue",
    },
    {
      title: "Database Management",
      description: "Manage stored records, products, and business data.",
      button: "Manage Database",
      path: "/admin/database",
      icon: <Database size={52} />,
      color: "purple",
    },
    {
      title: "User Management",
      description:
        "Manage admin accounts, control access and decide who can enter your admin panel.",
      button: "Manage Users",
      path: "/admin/users",
      icon: <Users size={52} />,
      color: "emerald",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-slate-800 md:text-5xl">
            Welcome to Admin Panel
          </h1>

          <p className="text-base text-slate-500 md:text-lg">
            Manage your website, database and users in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {options.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="group flex min-h-[280px] flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div
                className={`mb-6 rounded-2xl bg-${item.color}-100 p-6 text-${item.color}-600 transition group-hover:bg-${item.color}-600 group-hover:text-white`}
              >
                {item.icon}
              </div>

              <h2 className="mb-3 text-2xl font-bold text-slate-800">
                {item.title}
              </h2>

              <p className="mb-6 max-w-sm text-slate-500">{item.description}</p>

              <span
                className={`flex items-center gap-2 font-semibold text-${item.color}-600`}
              >
                {item.button}
                <ArrowRight size={20} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
