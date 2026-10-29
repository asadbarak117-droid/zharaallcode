import { useEffect, useState } from "react";
import {
  Save,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Palette,
  Type,
  Link as LinkIcon,
  LayoutDashboard,
  LoaderCircle,
  Globe,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/header";

const initialHeader = {
  logoLetter: "L",
  siteName: "Ledora",
  tagline: "Beauty & Elegance",
  backgroundColor: "#ffffff",
  accentColor: "#b76e79",
  textColor: "#333333",
  buttonText: "Contact Us",
  buttonPath: "/connect",
  links: [
    { label: "Home", path: "/", enabled: true },
    { label: "Products", path: "/products", enabled: true },
    { label: "Consultation", path: "/consultation", enabled: true },
    { label: "Connect", path: "/connect", enabled: true },
  ],
};

const tabs = [
  { id: "branding", label: "Brand Identity", icon: Type },
  { id: "navigation", label: "Navigation Links", icon: LinkIcon },
  { id: "design", label: "Colors & Design", icon: Palette },
  { id: "button", label: "Header Button", icon: Globe },
];

function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-600">{label}</span>
      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
      />
    </label>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4">
      <div className="min-w-0">
        <p className="font-semibold text-slate-700">{label}</p>
        <p className="mt-1 text-sm text-slate-400">{value}</p>
      </div>
      <input
        type="color"
        value={value || "#ffffff"}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-14 cursor-pointer rounded-lg border-0 bg-transparent"
      />
    </div>
  );
}

function moveItem(items, index, direction) {
  const nextIndex = index + direction;

  if (nextIndex < 0 || nextIndex >= items.length) {
    return items;
  }

  const next = [...items];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];

  return next;
}

export default function HeaderManagement() {
  const [header, setHeader] = useState(initialHeader);
  const [activeTab, setActiveTab] = useState("branding");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadHeader() {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load header settings.");
        }

        const savedHeader = data.header ?? data;

        if (!cancelled) {
          setHeader({
            ...initialHeader,
            ...savedHeader,
            links: Array.isArray(savedHeader.links)
              ? savedHeader.links
              : initialHeader.links,
          });
          setMessage("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(true);
          setMessage(
            `Could not load header settings: ${err.message}. Check your backend.`,
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadHeader();

    return () => {
      cancelled = true;
    };
  }, []);

  const update = (key, value) => {
    setHeader((current) => ({ ...current, [key]: value }));
    setMessage("");
    setError(false);
  };

  const updateLink = (index, key, value) => {
    setHeader((current) => ({
      ...current,
      links: current.links.map((link, i) =>
        i === index ? { ...link, [key]: value } : link,
      ),
    }));
    setMessage("");
    setError(false);
  };

  const addLink = () => {
    setHeader((current) => ({
      ...current,
      links: [
        ...current.links,
        {
          label: "New Link",
          path: "/",
          enabled: true,
        },
      ],
    }));
    setMessage("");
  };

  const deleteLink = (index) => {
    setHeader((current) => ({
      ...current,
      links: current.links.filter((_, i) => i !== index),
    }));
    setMessage("");
  };

  const reorderLink = (index, direction) => {
    setHeader((current) => ({
      ...current,
      links: moveItem(current.links, index, direction),
    }));
    setMessage("");
  };

  const save = async () => {
    if (saving) return;

    setSaving(true);
    setMessage("Saving header settings...");
    setError(false);

    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(header),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save header settings.");
      }

      const savedHeader = data.header ?? data;

      setHeader((current) => ({
        ...current,
        ...savedHeader,
        links: Array.isArray(savedHeader.links)
          ? savedHeader.links
          : current.links,
      }));

      setMessage("Header settings saved successfully!");
    } catch (err) {
      setError(true);
      setMessage(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    const confirmed = window.confirm(
      "Restore default header settings? Click Save to store them in MongoDB.",
    );

    if (!confirmed) return;

    setHeader(initialHeader);
    setMessage("Default settings loaded. Click Save Changes to save them.");
    setError(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex items-center gap-3 rounded-2xl bg-white p-6 text-slate-600 shadow-sm">
          <LoaderCircle className="animate-spin text-sky-500" size={24} />
          Loading header settings...
        </div>
      </div>
    );
  }

  if (preview) {
    return (
      <div className="min-h-screen bg-slate-100 p-4 md:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-sky-600">LIVE PREVIEW</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-800">
                Header Design
              </h1>
            </div>
            <button
              onClick={() => setPreview(false)}
              className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Back to Editor
            </button>
          </div>

          <header
            className="rounded-2xl border border-slate-200 p-5 shadow-sm md:px-8"
            style={{
              backgroundColor: header.backgroundColor,
              color: header.textColor,
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-bold text-white"
                  style={{ backgroundColor: header.accentColor }}
                >
                  {header.logoLetter}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{header.siteName}</h2>
                  <p className="text-xs opacity-70">{header.tagline}</p>
                </div>
              </div>

              <nav className="flex flex-wrap items-center gap-4">
                {header.links
                  .filter((link) => link.enabled)
                  .map((link, index) => (
                    <span
                      key={link._id || `${link.path}-${index}`}
                      className="text-sm font-medium"
                    >
                      {link.label}
                    </span>
                  ))}
              </nav>

              <span
                className="rounded-full px-5 py-3 text-sm font-semibold text-white"
                style={{ backgroundColor: header.accentColor }}
              >
                {header.buttonText}
              </span>
            </div>
          </header>

          <p className="mt-4 text-sm text-slate-500">
            This is a preview of the header settings. Save changes to store them
            in MongoDB.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 md:flex">
      <aside className="bg-slate-950 p-5 text-white md:min-h-screen md:w-64 md:shrink-0">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-sky-400 p-2 text-slate-950">
            <LayoutDashboard size={23} />
          </div>
          <div>
            <h1 className="font-bold">Website Admin</h1>
            <p className="text-xs text-slate-400">Header management</p>
          </div>
        </div>

        <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Website Settings
        </div>

        <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const selected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                  selected
                    ? "bg-sky-400 font-semibold text-slate-950"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Globe size={17} className="text-sky-400" />
            Header Settings
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            Manage your brand, navigation, colors and contact button.
          </p>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-sky-600">
                WEBSITE SETTINGS
              </p>
              <h2 className="mt-1 text-3xl font-bold">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Customize your website header and preview your changes.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setPreview(true)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold transition hover:bg-slate-50"
              >
                <Eye size={17} />
                Preview
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
              >
                {saving ? (
                  <LoaderCircle className="animate-spin" size={17} />
                ) : (
                  <Save size={17} />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {message && (
            <div
              className={`mb-5 flex items-start gap-3 rounded-xl border p-4 text-sm ${
                error
                  ? "border-red-200 bg-red-50 text-red-700"
                  : message.includes("successfully")
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-sky-200 bg-sky-50 text-sky-800"
              }`}
            >
              {error ? (
                <AlertCircle size={19} className="mt-0.5 shrink-0" />
              ) : message.includes("successfully") ? (
                <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
              ) : (
                <Globe size={19} className="mt-0.5 shrink-0" />
              )}
              <span>{message}</span>
            </div>
          )}

          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Header Preview
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Your current branding and navigation
                </p>
              </div>
              <button
                onClick={() => setPreview(true)}
                title="Open larger preview"
                className="rounded-xl border border-slate-200 p-3 text-slate-600 hover:bg-slate-50"
              >
                <ExternalLink size={18} />
              </button>
            </div>

            <div
              className="rounded-2xl border border-slate-100 p-4"
              style={{
                backgroundColor: header.backgroundColor,
                color: header.textColor,
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl font-bold text-white"
                    style={{ backgroundColor: header.accentColor }}
                  >
                    {header.logoLetter || "L"}
                  </div>
                  <div>
                    <p className="font-bold">
                      {header.siteName || "Site name"}
                    </p>
                    <p className="text-xs opacity-70">{header.tagline}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {header.links
                    .filter((link) => link.enabled)
                    .map((link, index) => (
                      <span
                        key={link._id || `${link.path}-${index}`}
                        className="text-xs font-medium"
                      >
                        {link.label}
                      </span>
                    ))}
                  <span
                    className="rounded-full px-3 py-2 text-xs font-semibold text-white"
                    style={{ backgroundColor: header.accentColor }}
                  >
                    {header.buttonText}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {activeTab === "branding" && (
            <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
              <div>
                <h3 className="text-lg font-bold">Brand Identity</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Set the name and logo shown in your website header.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Logo Letter"
                  value={header.logoLetter}
                  onChange={(value) => update("logoLetter", value)}
                  placeholder="L"
                />
                <Field
                  label="Website Name"
                  value={header.siteName}
                  onChange={(value) => update("siteName", value)}
                  placeholder="Ledora"
                />
              </div>

              <Field
                label="Tagline"
                value={header.tagline}
                onChange={(value) => update("tagline", value)}
                placeholder="Beauty & Elegance"
              />

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="mb-4 text-sm font-semibold text-slate-700">
                  Brand Preview
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white"
                    style={{ backgroundColor: header.accentColor }}
                  >
                    {header.logoLetter || "L"}
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold">{header.siteName}</h4>
                    <p className="mt-1 text-sm text-slate-500">
                      {header.tagline}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "navigation" && (
            <section className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">Navigation Links</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Add links, change their paths, reorder or hide them.
                  </p>
                </div>
                <button
                  onClick={addLink}
                  className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-600"
                >
                  <Plus size={17} />
                  Add Link
                </button>
              </div>

              {header.links.map((link, index) => (
                <article
                  key={link._id || `${link.path}-${index}`}
                  className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 font-bold text-sky-700">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-bold">{link.label || "New Link"}</p>
                        <p className="text-xs text-slate-400">{link.path}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        title="Move up"
                        disabled={index === 0}
                        onClick={() => reorderLink(index, -1)}
                        className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-30"
                      >
                        <ArrowUp size={18} />
                      </button>
                      <button
                        title="Move down"
                        disabled={index === header.links.length - 1}
                        onClick={() => reorderLink(index, 1)}
                        className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-30"
                      >
                        <ArrowDown size={18} />
                      </button>
                      <button
                        title={link.enabled ? "Hide link" : "Show link"}
                        onClick={() =>
                          updateLink(index, "enabled", !link.enabled)
                        }
                        className="rounded-lg p-2 hover:bg-slate-100"
                      >
                        {link.enabled ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                      <button
                        title="Delete link"
                        onClick={() => deleteLink(index)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="Link Label"
                      value={link.label}
                      onChange={(value) => updateLink(index, "label", value)}
                      placeholder="Products"
                    />
                    <Field
                      label="Link Path"
                      value={link.path}
                      onChange={(value) => updateLink(index, "path", value)}
                      placeholder="/products"
                    />
                  </div>

                  <div
                    className={`flex items-center gap-2 text-sm font-medium ${
                      link.enabled ? "text-emerald-600" : "text-slate-400"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        link.enabled ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    />
                    {link.enabled ? "Visible in header" : "Hidden from header"}
                  </div>
                </article>
              ))}

              {header.links.length === 0 && (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
                  <LinkIcon className="mx-auto mb-3 text-slate-400" size={30} />
                  <p className="font-semibold">No navigation links yet</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Click Add Link to create your first link.
                  </p>
                </div>
              )}
            </section>
          )}

          {activeTab === "design" && (
            <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
              <div>
                <h3 className="text-lg font-bold">Colors & Design</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Choose the colors that match your brand.
                </p>
              </div>

              <ColorField
                label="Header Background"
                value={header.backgroundColor}
                onChange={(value) => update("backgroundColor", value)}
              />
              <ColorField
                label="Accent Color"
                value={header.accentColor}
                onChange={(value) => update("accentColor", value)}
              />
              <ColorField
                label="Text Color"
                value={header.textColor}
                onChange={(value) => update("textColor", value)}
              />

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="mb-3 text-sm font-semibold text-slate-700">
                  Color Preview
                </p>
                <div
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl p-4"
                  style={{
                    backgroundColor: header.backgroundColor,
                    color: header.textColor,
                  }}
                >
                  <span className="font-bold">{header.siteName}</span>
                  <span
                    className="rounded-full px-4 py-2 text-sm font-semibold text-white"
                    style={{ backgroundColor: header.accentColor }}
                  >
                    {header.buttonText}
                  </span>
                </div>
              </div>
            </section>
          )}

          {activeTab === "button" && (
            <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
              <div>
                <h3 className="text-lg font-bold">Header Action Button</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Customize the main button displayed on the right side of your
                  header.
                </p>
              </div>

              <Field
                label="Button Text"
                value={header.buttonText}
                onChange={(value) => update("buttonText", value)}
                placeholder="Contact Us"
              />
              <Field
                label="Button Destination"
                value={header.buttonPath}
                onChange={(value) => update("buttonPath", value)}
                placeholder="/connect"
              />

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="mb-4 text-sm font-semibold text-slate-700">
                  Button Preview
                </p>
                <span
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white"
                  style={{ backgroundColor: header.accentColor }}
                >
                  {header.buttonText || "Contact Us"}
                  <ExternalLink size={16} />
                </span>
                <p className="mt-3 text-sm text-slate-500">
                  Destination: {header.buttonPath}
                </p>
              </div>
            </section>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={reset}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <RotateCcw size={17} />
              Reset Defaults
            </button>

            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white hover:bg-sky-600 disabled:opacity-60"
            >
              {saving ? (
                <LoaderCircle className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <p className="mt-5 text-xs leading-5 text-slate-500">
            Header settings are stored in MongoDB. Save your changes to persist
            them. Your public Header component must fetch these settings to
            display them on the website.
          </p>
        </div>
      </main>
    </div>
  );
}
