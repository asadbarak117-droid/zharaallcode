import { useEffect, useState } from "react";
import {
  Save,
  Eye,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Settings,
  Inbox,
  Trash2,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  LoaderCircle,
  EyeOff,
} from "lucide-react";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";

const API_URL = "http://localhost:5000/api";

const initialSettings = {
  email: "",
  phone: "",
  location: "Afghanistan",
  instagram: "",
  facebook: "",
  whatsapp: "",
};

const tabs = [
  { id: "settings", label: "Contact Settings", icon: Settings },
  { id: "messages", label: "Customer Messages", icon: Inbox },
];

const fields = [
  {
    key: "email",
    label: "Email Address",
    placeholder: "contact@example.com",
    type: "email",
    icon: Mail,
  },
  {
    key: "phone",
    label: "Phone Number",
    placeholder: "Enter your phone number",
    type: "text",
    icon: Phone,
  },
  {
    key: "location",
    label: "Location",
    placeholder: "City, country",
    type: "text",
    icon: MapPin,
  },
  {
    key: "instagram",
    label: "Instagram URL",
    placeholder: "https://www.instagram.com/yourpage",
    type: "url",
    icon: FaInstagram,
  },
  {
    key: "facebook",
    label: "Facebook URL",
    placeholder: "https://www.facebook.com/yourpage",
    type: "url",
    icon: FaFacebookF,
  },
  {
    key: "whatsapp",
    label: "WhatsApp Number",
    placeholder: "Country code + number",
    type: "text",
    icon: FaWhatsapp,
  },
];

function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <label className="block space-y-2">
      {label && (
        <span className="text-sm font-medium text-slate-600">{label}</span>
      )}
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
      />
    </label>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <div className="rounded-xl bg-sky-50 p-3 text-sky-600">
          <Icon size={21} />
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default function ConnectAdmin() {
  const [settings, setSettings] = useState(initialSettings);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("settings");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [savingMessageId, setSavingMessageId] = useState("");
  const [deletingMessageId, setDeletingMessageId] = useState("");
  const [preview, setPreview] = useState(false);

  const unreadCount = messages.filter((item) => !item.read).length;

  const request = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || `Request failed with status ${response.status}`,
      );
    }

    return data;
  };

  const loadSettings = async () => {
    const data = await request(`${API_URL}/conect`);
    const saved = data.contact ?? data;

    setSettings({
      ...initialSettings,
      ...saved,
    });
  };

  const loadMessages = async () => {
    const data = await request(`${API_URL}/messages`);

    if (!Array.isArray(data)) {
      throw new Error("The messages API did not return a list.");
    }

    setMessages(data);
  };

  const loadAll = async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");
    setNotice("");

    try {
      await Promise.all([loadSettings(), loadMessages()]);
    } catch (err) {
      setError(
        `${err.message}. Check that your backend is running on port 5000.`,
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
    setNotice("");
    setError("");
  };

  const saveSettings = async (e) => {
    e.preventDefault();

    if (saving) return;

    setSaving(true);
    setNotice("");
    setError("");

    try {
      const data = await request(`${API_URL}/conect`, {
        method: "PUT",
        body: JSON.stringify(settings),
      });

      setSettings({
        ...initialSettings,
        ...(data.contact ?? data),
      });

      setNotice("Contact settings saved successfully to MongoDB.");
    } catch (err) {
      setError(`Could not save contact settings: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const markRead = async (message) => {
    const id = message._id || message.id;

    if (!id || message.read) return;

    setSavingMessageId(id);
    setError("");
    setNotice("");

    try {
      await request(`${API_URL}/messages/${id}/read`, {
        method: "PATCH",
      });

      setMessages((previous) =>
        previous.map((item) =>
          (item._id || item.id) === id ? { ...item, read: true } : item,
        ),
      );

      setNotice("Message marked as read.");
    } catch (err) {
      setError(`Could not update the message: ${err.message}`);
    } finally {
      setSavingMessageId("");
    }
  };

  const deleteMessage = async (message) => {
    const id = message._id || message.id;

    if (!id || !window.confirm("Delete this customer message permanently?")) {
      return;
    }

    setDeletingMessageId(id);
    setError("");
    setNotice("");

    try {
      await request(`${API_URL}/messages/${id}`, {
        method: "DELETE",
      });

      setMessages((previous) =>
        previous.filter((item) => (item._id || item.id) !== id),
      );

      setNotice("Message deleted successfully.");
    } catch (err) {
      setError(`Could not delete the message: ${err.message}`);
    } finally {
      setDeletingMessageId("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-600">
        <LoaderCircle className="mr-3 animate-spin" size={22} />
        Loading Connect Management...
      </div>
    );
  }

  if (preview) {
    return (
      <div className="min-h-screen bg-white p-6 text-slate-800 md:p-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold">Contact Page Preview</h1>
            <button
              type="button"
              onClick={() => setPreview(false)}
              className="rounded-xl bg-slate-950 px-4 py-3 text-white"
            >
              Back to Editor
            </button>
          </div>

          <section className="rounded-3xl bg-gradient-to-br from-sky-50 to-white p-8 md:p-12">
            <p className="font-semibold uppercase tracking-widest text-sky-600">
              Ledora
            </p>
            <h2 className="mt-4 text-4xl font-bold">Let's Connect</h2>
            <p className="mt-3 text-slate-500">
              Contact information currently saved in the editor.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {fields.map((field) => {
                const Icon = field.icon;

                return (
                  <div
                    key={field.key}
                    className="rounded-2xl border border-sky-100 bg-white p-5"
                  >
                    <Icon className="text-sky-500" size={22} />
                    <p className="mt-3 text-sm text-slate-500">{field.label}</p>
                    <p className="mt-1 break-all font-semibold">
                      {settings[field.key] || "Not provided"}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 md:flex">
      <aside className="bg-slate-950 p-5 text-white md:min-h-screen md:w-64 md:shrink-0">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-sky-400 p-2 text-slate-950">
            <MessageCircle size={23} />
          </div>
          <div>
            <h1 className="font-bold">Website Admin</h1>
            <p className="text-xs text-slate-400">Connect management</p>
          </div>
        </div>

        <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setNotice("");
                  setError("");
                }}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                  activeTab === tab.id
                    ? "bg-sky-400 font-semibold text-slate-950"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon size={18} />
                {tab.label}
                {tab.id === "messages" && messages.length > 0 && (
                  <span className="ml-auto rounded-full bg-white/15 px-2 py-0.5 text-xs">
                    {messages.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-semibold">Message Overview</p>
          <p className="mt-2 text-sm text-slate-400">
            {unreadCount} unread message{unreadCount === 1 ? "" : "s"}
          </p>
          <button
            type="button"
            onClick={() => loadAll(true)}
            disabled={refreshing}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            Refresh Data
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-6xl">
          <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium tracking-widest text-sky-600">
                WEBSITE SETTINGS
              </p>
              <h2 className="mt-1 text-3xl font-bold">
                {activeTab === "settings"
                  ? "Connect Management"
                  : "Customer Messages"}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {activeTab === "settings"
                  ? "Manage contact details displayed on your public website."
                  : "Read and manage messages received from your customers."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href="/connect"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50"
              >
                <Eye size={17} />
                View Connect Page
                <ExternalLink size={15} />
              </a>

              {activeTab === "settings" && (
                <button
                  type="submit"
                  form="connect-settings-form"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-60"
                >
                  <Save size={17} />
                  {saving ? "Saving..." : "Save"}
                </button>
              )}
            </div>
          </header>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {notice && (
            <div
              role="status"
              className="mb-5 flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800"
            >
              <CheckCircle2 size={19} />
              {notice}
            </div>
          )}

          <section className="mb-7 grid gap-5 sm:grid-cols-3">
            <StatCard
              label="Total Messages"
              value={messages.length}
              icon={Inbox}
            />
            <StatCard label="Unread Messages" value={unreadCount} icon={Mail} />
            <StatCard
              label="Contact Fields"
              value={fields.length}
              icon={Settings}
            />
          </section>

          <nav className="mb-6 flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setNotice("");
                    setError("");
                  }}
                  className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "bg-sky-500 text-white shadow-lg shadow-sky-100"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-sky-50"
                  }`}
                >
                  <Icon size={17} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {activeTab === "settings" && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
              <div className="mb-7">
                <h3 className="text-xl font-bold">Contact Information</h3>
                <p className="mt-2 text-sm text-slate-500">
                  These settings are loaded from and saved to MongoDB.
                </p>
              </div>

              <form
                id="connect-settings-form"
                onSubmit={saveSettings}
                className="space-y-6"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  {fields.map((field) => {
                    const Icon = field.icon;

                    return (
                      <div key={field.key} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Icon size={18} className="text-sky-500" />
                          <span className="text-sm font-semibold text-slate-700">
                            {field.label}
                          </span>
                        </div>

                        <Field
                          value={settings[field.key]}
                          onChange={(value) => updateSetting(field.key, value)}
                          placeholder={field.placeholder}
                          type={field.type}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-6">
                  <p className="text-xs text-slate-500">
                    Save your changes to update the stored contact settings.
                  </p>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white transition hover:bg-sky-600 disabled:opacity-50"
                  >
                    <Save size={18} />
                    {saving ? "Saving..." : "Save Contact Settings"}
                  </button>
                </div>
              </form>
            </section>
          )}

          {activeTab === "messages" && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold">Customer Messages</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Messages are retrieved from your backend API.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => loadAll(true)}
                  disabled={refreshing}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
                >
                  <RefreshCw
                    size={16}
                    className={refreshing ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
              </div>

              {messages.length === 0 ? (
                <div className="rounded-2xl bg-sky-50/70 px-5 py-14 text-center">
                  <MessageSquare size={38} className="mx-auto text-sky-400" />
                  <h4 className="mt-4 font-semibold">No messages yet</h4>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Customer messages submitted through your public Connect form
                    will appear here after they are saved in MongoDB.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((item, index) => {
                    const id = item._id || item.id || `message-${index}`;

                    return (
                      <article
                        key={id}
                        className="rounded-2xl border border-slate-200 p-5 transition hover:border-sky-200"
                      >
                        <div className="flex flex-col justify-between gap-4 sm:flex-row">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-bold text-slate-900">
                                {item.name || "Unknown sender"}
                              </h4>

                              {!item.read && (
                                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                                  Unread
                                </span>
                              )}
                            </div>

                            <a
                              href={`mailto:${item.email || ""}`}
                              className="mt-1 block break-all text-sm text-sky-600 hover:underline"
                            >
                              {item.email || "No email"}
                            </a>

                            <p className="mt-3 font-semibold">
                              {item.subject || "No subject"}
                            </p>
                          </div>

                          <div className="flex h-fit flex-wrap gap-2">
                            {!item.read && (
                              <button
                                type="button"
                                onClick={() => markRead(item)}
                                disabled={savingMessageId === id}
                                className="flex items-center gap-2 rounded-lg border border-sky-200 px-3 py-2 text-sm text-sky-700 hover:bg-sky-50 disabled:opacity-50"
                              >
                                <EyeOff size={15} />
                                {savingMessageId === id
                                  ? "Updating..."
                                  : "Mark Read"}
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => deleteMessage(item)}
                              disabled={deletingMessageId === id}
                              className="flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              <Trash2 size={15} />
                              {deletingMessageId === id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </div>

                        <p className="mt-4 whitespace-pre-wrap break-words leading-7 text-slate-600">
                          {item.message}
                        </p>

                        {item.createdAt && (
                          <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
                            Received:{" "}
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          <p className="mt-6 text-xs leading-6 text-slate-500">
            Ledora Admin · Connect Management · Protect admin API endpoints with
            authentication before deploying your website.
          </p>
        </div>
      </main>
    </div>
  );
}
