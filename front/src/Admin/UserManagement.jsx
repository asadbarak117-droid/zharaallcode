import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Trash2,
  Power,
  PowerOff,
  ShieldCheck,
  Mail,
  X,
  RefreshCw,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  LockKeyhole,
} from "lucide-react";

const API_URL = "https://zharaallcode.onrender.com";

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-sky-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60";
const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-60";

function UserManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const token = localStorage.getItem("adminToken");

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load users.");
      }

      setAdmins(Array.isArray(data) ? data : data.admins || data.data || []);
    } catch (err) {
      setError(err.message || "Could not load administrators.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      setSubmitting(true);

      const response = await fetch(`${API_URL}/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not create admin.");
      }

      setMessage("Administrator created successfully.");
      setForm({ name: "", email: "", password: "" });
      setShowPassword(false);
      setShowForm(false);
      await fetchAdmins();
    } catch (err) {
      setError(err.message || "Could not create administrator.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (admin) => {
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/admin/users/${admin._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive: !admin.isActive }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update status.");
      }

      setMessage("Administrator status updated successfully.");
      await fetchAdmins();
    } catch (err) {
      setError(err.message || "Could not update administrator status.");
    }
  };

  const deleteAdmin = async (admin) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${admin.name}?`,
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/admin/users/${admin._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete admin.");
      }

      setMessage("Administrator deleted successfully.");
      await fetchAdmins();
    } catch (err) {
      setError(err.message || "Could not delete administrator.");
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setShowPassword(false);
    setForm({ name: "", email: "", password: "" });
  };

  const activeCount = admins.filter((admin) => admin.isActive).length;
  const inactiveCount = admins.length - activeCount;

  const statCard = (label, value, Icon) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{label}</p>
        <span className="rounded-xl bg-sky-100 p-2 text-sky-600">
          <Icon size={19} />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p>
    </div>
  );

  const messageBox = (text, type) =>
    text && (
      <div
        className={`mb-5 flex items-start gap-3 rounded-xl border p-4 text-sm ${
          type === "error"
            ? "border-red-200 bg-red-50 text-red-800"
            : "border-emerald-200 bg-emerald-50 text-emerald-800"
        }`}
      >
        {type === "error" ? (
          <AlertCircle size={19} className="shrink-0" />
        ) : (
          <CheckCircle2 size={19} className="shrink-0" />
        )}
        <span>{text}</span>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 md:flex">
      <aside className="bg-slate-950 p-5 text-white md:min-h-screen md:w-64 md:shrink-0">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-sky-400 p-2 text-slate-950">
            <Users size={23} />
          </div>
          <div>
            <h2 className="font-bold">Website Admin</h2>
            <p className="text-xs text-slate-400">Administrator control</p>
          </div>
        </div>
        <div className="rounded-xl bg-sky-400 px-3 py-3 text-sm font-semibold text-slate-950">
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} />
            User Management
          </div>
        </div>
        <p className="mt-6 text-xs leading-5 text-slate-400">
          Manage administrator accounts, access status, and permissions.
        </p>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-5xl">
          <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-wider text-sky-600">
                WEBSITE SETTINGS
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                User Management
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage administrators and access permissions for your Ledora
                Beauty website.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={fetchAdmins}
                disabled={loading}
                className={secondaryButton}
              >
                {loading ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <RefreshCw size={17} />
                )}
                Refresh
              </button>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setMessage("");
                  setShowForm(true);
                }}
                disabled={admins.length >= 3}
                className={primaryButton}
                title={
                  admins.length >= 3
                    ? "Maximum of 3 administrators reached"
                    : "Add administrator"
                }
              >
                <UserPlus size={18} />
                Add Admin
              </button>
            </div>
          </header>

          {messageBox(error, "error")}
          {messageBox(message, "success")}

          <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {statCard("Total Admins", admins.length, Users)}
            {statCard("Active Admins", activeCount, ShieldCheck)}
            {statCard("Inactive Admins", inactiveCount, PowerOff)}
          </div>

          <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Administrator Accounts
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  View, activate, deactivate, or remove administrator accounts.
                </p>
              </div>
              <span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
                Maximum allowed accounts: 3
              </span>
            </div>
          </section>

          {loading ? (
            <div className="flex min-h-56 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-slate-500">
              <Loader2 size={22} className="animate-spin text-sky-600" />
              Loading administrators...
            </div>
          ) : admins.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                <Users size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-950">
                No administrators found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Create an administrator account to get started.
              </p>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className={`${primaryButton} mt-5`}
              >
                <UserPlus size={17} />
                Add Admin
              </button>
            </div>
          ) : (
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4 md:px-6">
                <h3 className="font-bold text-slate-950">Administrators</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {admins.length} of 3 administrator accounts are in use.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50">
                      {[
                        "Administrator",
                        "Email",
                        "Role",
                        "Status",
                        "Actions",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr
                        key={admin._id}
                        className="border-t border-slate-100 transition hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 font-bold text-sky-700">
                              {admin.name?.charAt(0).toUpperCase() || "A"}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">
                                {admin.name}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-400">
                                Admin account
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail size={16} className="shrink-0 text-sky-600" />
                            <span className="break-all">{admin.email}</span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
                            <ShieldCheck size={14} />
                            Administrator
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                              admin.isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {admin.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleStatus(admin)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                              title={admin.isActive ? "Deactivate" : "Activate"}
                            >
                              {admin.isActive ? (
                                <PowerOff size={16} />
                              ) : (
                                <Power size={16} />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteAdmin(admin)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100"
                              title="Delete administrator"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <footer className="mt-8 border-t border-slate-200 pt-5 text-xs text-slate-500">
            User Management · Ledora Website Admin
          </footer>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl md:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  New Account
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Add Administrator
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Create a new admin account for Ledora.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                aria-label="Close form"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Name
                </span>
                <input
                  type="text"
                  placeholder="Administrator name"
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  required
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Email
                </span>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  required
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Password
                </span>
                <div className="flex items-center rounded-xl border border-slate-200 bg-white pr-3 transition focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100">
                  <LockKeyhole
                    size={17}
                    className="ml-3 shrink-0 text-slate-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 8 characters"
                    value={form.password}
                    onChange={(event) =>
                      setForm({ ...form, password: event.target.value })
                    }
                    className="min-w-0 flex-1 border-0 bg-transparent px-3 py-3 text-sm text-slate-900 outline-none"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-sky-50 hover:text-sky-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`${primaryButton} flex-1`}
                >
                  {submitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <UserPlus size={18} />
                  )}
                  {submitting ? "Creating..." : "Create Administrator"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className={secondaryButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
