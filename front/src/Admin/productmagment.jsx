import { useEffect, useState } from "react";
import {
  Save,
  Eye,
  Image as ImageIcon,
  ShoppingBag,
  Palette,
  Type,
  Plus,
  Trash2,
  RotateCcw,
  Layers,
  Pencil,
  LoaderCircle,
  X,
  Check,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/productsection";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const initialConfig = {
  heroBadge: "Your Beauty, Your Confidence",
  heroTitle: "Discover Your New Beauty Favorites",
  heroDescription:
    "Explore makeup, skincare, hair care, and fragrances for your personal routine.",
  heroButton: "Explore Products",
  heroImage:
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80",
  heroColor: "#e0f2fe",
  pageTitle: "Discover Your Beauty",
  pageDescription: "Explore makeup, skincare, hair care, perfumes, and more.",
  categories: [
    "Makeup",
    "Skincare",
    "Viper",
    "Spirulina",
    "Hair Care",
    "Soap & Body",
    "Perfume",
    "Pomegranate",
  ],
  products: [],
};

function normalizeConfig(data) {
  const source = data?.data ?? data?.content ?? data;

  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return {
      ...initialConfig,
      categories: [...initialConfig.categories],
      products: [],
    };
  }

  return {
    ...initialConfig,
    ...source,
    categories: Array.isArray(source.categories)
      ? source.categories.filter((item) => typeof item === "string")
      : [...initialConfig.categories],
    products: Array.isArray(source.products) ? source.products : [],
  };
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read image."));
    reader.readAsDataURL(file);
  });
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
  placeholder = "",
}) {
  const className =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100";

  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-600">{label}</span>

      {multiline ? (
        <textarea
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          placeholder={placeholder}
          className={className}
        />
      ) : (
        <input
          type={type}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={className}
        />
      )}
    </label>
  );
}

function ImagePicker({ label, value, onChange }) {
  const [reading, setReading] = useState(false);
  const [source, setSource] = useState("url");
  const [urlInput, setUrlInput] = useState(
    typeof value === "string" && /^https?:\/\//i.test(value) ? value : "",
  );
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    if (typeof value === "string" && /^https?:\/\//i.test(value)) {
      setUrlInput(value);
    } else if (!value) {
      setUrlInput("");
      setImageError("");
    }
  }, [value]);

  async function handleFileChange(event) {
    const input = event.target;
    const file = input.files?.[0];

    if (!file) return;

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file.");
      }

      if (file.size > MAX_IMAGE_SIZE) {
        throw new Error("Image size must be less than 5 MB.");
      }

      setReading(true);
      setImageError("");

      const image = await fileToBase64(file);

      onChange(image);
    } catch (error) {
      window.alert(error.message || "Could not read image.");
    } finally {
      setReading(false);
      input.value = "";
    }
  }

  function applyUrl() {
    const url = urlInput.trim();

    if (!url) {
      setImageError("Please enter an image URL.");
      return;
    }

    try {
      const parsedUrl = new URL(url);

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid URL");
      }

      setImageError("");
      onChange(url);
    } catch {
      setImageError(
        "Please enter a valid URL starting with http:// or https://.",
      );
    }
  }

  function removeImage() {
    onChange("");
    setUrlInput("");
    setImageError("");
  }

  return (
    <div className="space-y-3">
      <span className="block text-sm font-medium text-slate-600">{label}</span>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setSource("url");
            setImageError("");
          }}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            source === "url"
              ? "bg-sky-500 text-white"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          <ImageIcon size={17} />
          Image URL
        </button>

        <button
          type="button"
          onClick={() => {
            setSource("device");
            setImageError("");
          }}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            source === "device"
              ? "bg-sky-500 text-white"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          <Plus size={17} />
          Upload from Device
        </button>
      </div>

      <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-5">
        {value ? (
          <img
            src={value}
            alt={label}
            onError={() =>
              setImageError(
                "Could not display this image. Check the URL or choose another image.",
              )
            }
            onLoad={() => setImageError("")}
            className="mb-4 h-56 w-full rounded-xl bg-white object-contain"
          />
        ) : (
          <div className="mb-4 flex h-40 flex-col items-center justify-center rounded-xl bg-white text-slate-400">
            <ImageIcon size={36} />
            <p className="mt-2 text-sm">No image selected</p>
          </div>
        )}

        {source === "url" && (
          <div className="space-y-3">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-600">
                Enter image URL
              </span>

              <input
                type="url"
                value={urlInput}
                onChange={(event) => {
                  setUrlInput(event.target.value);
                  setImageError("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    applyUrl();
                  }
                }}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </label>

            <button
              type="button"
              onClick={applyUrl}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
            >
              <Check size={17} />
              Use This URL
            </button>

            <p className="text-xs text-slate-500">
              Paste a direct image link beginning with http:// or https://.
            </p>
          </div>
        )}

        {source === "device" && (
          <div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600">
              {reading ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Plus size={17} />
              )}

              {reading ? "Reading image..." : "Choose Image from Device"}

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={reading}
                className="hidden"
              />
            </label>

            <p className="mt-3 text-xs text-slate-500">
              Select an image from your computer. Maximum size: 5 MB.
            </p>
          </div>
        )}

        {imageError && (
          <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {imageError}
          </p>
        )}

        {value && (
          <button
            type="button"
            onClick={removeImage}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <Trash2 size={16} />
            Remove Image
          </button>
        )}
      </div>
    </div>
  );
}

const tabs = [
  { id: "hero", label: "Product Hero", icon: Layers },
  { id: "content", label: "Page Content", icon: Type },
  { id: "categories", label: "Categories", icon: ImageIcon },
  { id: "products", label: "Products", icon: ShoppingBag },
  { id: "design", label: "Colors & Design", icon: Palette },
];

export default function ProductManagement() {
  const [config, setConfig] = useState({
    ...initialConfig,
    categories: [...initialConfig.categories],
    products: [],
  });

  const [activeTab, setActiveTab] = useState("hero");
  const [categoryInput, setCategoryInput] = useState("");

  const [productForm, setProductForm] = useState({
    name: "",
    code: "",
    category: "Makeup",
    image: "",
    description: "",
    price: "",
    badge: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  function notify(text, type = "info") {
    setMessage(text);
    setMessageType(type);
  }

  useEffect(() => {
    const controller = new AbortController();

    async function loadConfig() {
      try {
        setLoading(true);

        const response = await fetch(API_URL, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        const text = await response.text();
        let data = {};

        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          throw new Error("The server did not return valid JSON.");
        }

        if (!response.ok) {
          throw new Error(data.message || `Request failed: ${response.status}`);
        }

        setConfig(normalizeConfig(data));
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error(error);
        notify(`Could not load settings: ${error.message}`, "error");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadConfig();

    return () => controller.abort();
  }, []);

  function updateField(key, value) {
    setConfig((current) => ({
      ...current,
      [key]: value,
    }));

    setMessage("");
  }

  async function save() {
    if (saving) return;

    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      const text = await response.text();
      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error("The server did not return valid JSON.");
      }

      if (!response.ok) {
        throw new Error(
          data.message || data.error || `Save failed: ${response.status}`,
        );
      }

      setConfig(normalizeConfig(data));
      notify("Changes saved successfully to MongoDB.", "success");
    } catch (error) {
      console.error("Save error:", error);
      notify(`Could not save changes: ${error.message}`, "error");
    } finally {
      setSaving(false);
    }
  }

  function addCategory() {
    const name = categoryInput.trim();

    if (!name) {
      notify("Enter a category name first.", "error");
      return;
    }

    const exists = config.categories.some(
      (category) => category.toLowerCase() === name.toLowerCase(),
    );

    if (exists) {
      notify("This category already exists.", "error");
      return;
    }

    setConfig((current) => ({
      ...current,
      categories: [...current.categories, name],
    }));

    setCategoryInput("");
    notify(`"${name}" added. Click Save Changes to store it.`, "success");
  }

  function deleteCategory(name) {
    const used = config.products.some((product) => product.category === name);

    const confirmation = used
      ? `"${name}" is used by products. Delete this category anyway?`
      : `Delete category "${name}"?`;

    if (!window.confirm(confirmation)) return;

    setConfig((current) => ({
      ...current,
      categories: current.categories.filter((category) => category !== name),
    }));

    notify("Category removed. Click Save Changes to save it.", "info");
  }

  function openAddProduct() {
    setEditingId(null);

    setProductForm({
      name: "",
      code: "",
      category: config.categories[0] || "Makeup",
      image: "",
      description: "",
      price: "",
      badge: "",
    });

    setShowProductForm(true);
  }

  function openEditProduct(product) {
    setEditingId(String(product._id ?? product.id ?? ""));

    setProductForm({
      name: product.name ?? "",
      code: product.code ?? "",
      category: product.category ?? config.categories[0] ?? "Makeup",
      image: product.image ?? "",
      description: product.description ?? "",
      price: product.price ?? "",
      badge: product.badge ?? "",
    });

    setShowProductForm(true);
  }

  function saveProduct(event) {
    event.preventDefault();

    if (!productForm.name.trim()) {
      notify("Product name is required.", "error");
      return;
    }

    const product = {
      ...productForm,
      name: productForm.name.trim(),
      code: productForm.code.trim(),
      category: productForm.category.trim(),
      description: productForm.description.trim(),
      price: String(productForm.price ?? ""),
      badge: productForm.badge.trim(),
    };

    setConfig((current) => {
      const products = [...current.products];

      if (editingId !== null) {
        const index = products.findIndex(
          (item) => String(item._id ?? item.id ?? "") === editingId,
        );

        if (index !== -1) {
          products[index] = {
            ...products[index],
            ...product,
          };
        } else {
          products.push({
            ...product,
            id: `new-${Date.now()}`,
          });
        }
      } else {
        products.push({
          ...product,
          id: `new-${Date.now()}`,
        });
      }

      return {
        ...current,
        products,
      };
    });

    setShowProductForm(false);
    notify("Product updated. Click Save Changes to save it.", "info");
  }

  function deleteProduct(product) {
    if (!window.confirm(`Delete "${product.name}"?`)) return;

    const id = String(product._id ?? product.id ?? "");

    setConfig((current) => ({
      ...current,
      products: current.products.filter(
        (item) => String(item._id ?? item.id ?? "") !== id,
      ),
    }));

    notify("Product removed. Click Save Changes to save it.", "info");
  }

  function resetSettings() {
    if (
      !window.confirm(
        "Restore default page settings and remove all saved products? This takes effect after Save Changes.",
      )
    ) {
      return;
    }

    setConfig({
      ...initialConfig,
      categories: [...initialConfig.categories],
      products: [],
    });

    setCategoryInput("");
    setShowProductForm(false);
    notify("Defaults loaded. Click Save Changes to store the reset.", "info");
  }

  const inputKeys = [
    ["heroBadge", "Small heading"],
    ["heroTitle", "Hero title"],
    ["heroDescription", "Hero description"],
    ["heroButton", "Button text"],
  ];

  const cardClass =
    "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7";

  const buttonClass =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60";

  const secondaryButtonClass =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60";

  const messageClass =
    messageType === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : messageType === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-sky-200 bg-sky-50 text-sky-800";

  function renderPreview() {
    return (
      <div className="min-h-screen bg-white text-slate-800">
        <div className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-slate-950 px-5 py-3 text-white">
          <span className="font-semibold">Products Page Preview</span>

          <button
            type="button"
            onClick={() => setPreview(false)}
            className={buttonClass}
          >
            <X size={17} />
            Back to Editor
          </button>
        </div>

        <header className="px-6 py-5">
          <h2 className="text-2xl font-bold">{config.pageTitle}</h2>
          <p className="mt-2 text-slate-500">{config.pageDescription}</p>
        </header>

        <section
          className="relative overflow-hidden px-6 py-20 md:px-16"
          style={{
            backgroundColor: config.heroColor,
            backgroundImage: config.heroImage
              ? `linear-gradient(90deg, ${config.heroColor}ee, ${config.heroColor}66), url("${config.heroImage}")`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <p className="font-semibold">{config.heroBadge}</p>

          <h1 className="mt-4 max-w-3xl text-4xl font-bold md:text-6xl">
            {config.heroTitle}
          </h1>

          <p className="mt-5 max-w-2xl leading-8">{config.heroDescription}</p>

          <span className="mt-7 inline-flex rounded-full bg-sky-500 px-6 py-3 font-semibold text-white">
            {config.heroButton}
          </span>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <h2 className="text-3xl font-bold">{config.pageTitle}</h2>
          <p className="mt-2 text-slate-500">{config.pageDescription}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {config.categories.map((category, index) => (
              <span
                key={`${category}-${index}`}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm"
              >
                {category}
              </span>
            ))}
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {config.products.map((product, index) => (
              <article
                key={product._id ?? product.id ?? index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3"
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-56 w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center rounded-xl bg-slate-100">
                    <ImageIcon size={30} />
                  </div>
                )}

                <div className="p-2">
                  <p className="mt-2 text-xs uppercase text-sky-600">
                    {product.category}
                  </p>

                  <h3 className="mt-2 font-semibold">{product.name}</h3>

                  <p className="mt-2 font-bold">
                    {product.price || "Price on request"}
                  </p>

                  {product.description && (
                    <p className="mt-2 text-sm text-slate-500">
                      {product.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (preview) return renderPreview();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3 bg-slate-100 text-slate-600">
        <LoaderCircle size={22} className="animate-spin" />
        Loading product settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 md:flex">
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
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                activeTab === id
                  ? "bg-sky-400 font-semibold text-slate-950"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-8 hidden rounded-xl border border-slate-800 p-4 md:block">
          <p className="text-xs uppercase tracking-widest text-slate-400">
            Product catalog
          </p>

          <p className="mt-2 text-2xl font-bold">{config.products.length}</p>
          <p className="text-xs text-slate-400">Products</p>

          <p className="mt-3 text-2xl font-bold">{config.categories.length}</p>
          <p className="text-xs text-slate-400">Categories</p>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-5xl">
          <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-sky-600">
                WEBSITE SETTINGS
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Manage your product page content and catalog.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPreview(true)}
                className={secondaryButtonClass}
              >
                <Eye size={17} />
                Preview
              </button>

              <button
                type="button"
                onClick={save}
                disabled={saving}
                className={buttonClass}
              >
                {saving ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <Save size={17} />
                )}

                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </header>

          {message && (
            <div
              role="status"
              className={`mb-5 rounded-xl border p-3 text-sm ${messageClass}`}
            >
              {message}
            </div>
          )}

          {activeTab === "hero" && (
            <section className={`${cardClass} space-y-5`}>
              <div>
                <h3 className="text-lg font-bold">Product Hero Section</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Edit the main banner on the Products page.
                </p>
              </div>

              {inputKeys.map(([key, label]) => (
                <Field
                  key={key}
                  label={label}
                  value={config[key]}
                  onChange={(value) => updateField(key, value)}
                  multiline={key === "heroTitle" || key === "heroDescription"}
                />
              ))}

              <ImagePicker
                label="Hero image"
                value={config.heroImage}
                onChange={(value) => updateField("heroImage", value)}
              />

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-600">
                  Hero background color
                </span>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                  <input
                    type="color"
                    value={config.heroColor || "#e0f2fe"}
                    onChange={(event) =>
                      updateField("heroColor", event.target.value)
                    }
                    className="h-11 w-14 cursor-pointer rounded-lg border-0"
                  />

                  <span className="text-sm text-slate-500">
                    {config.heroColor}
                  </span>
                </div>
              </label>

              <div
                className="overflow-hidden rounded-2xl p-6 md:p-10"
                style={{
                  backgroundColor: config.heroColor,
                  backgroundImage: config.heroImage
                    ? `linear-gradient(90deg, ${config.heroColor}ee, ${config.heroColor}66), url("${config.heroImage}")`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <p className="font-semibold">{config.heroBadge}</p>

                <h3 className="mt-4 max-w-xl text-3xl font-bold">
                  {config.heroTitle}
                </h3>

                <p className="mt-3 max-w-xl leading-7">
                  {config.heroDescription}
                </p>

                <span className="mt-5 inline-flex rounded-full bg-sky-500 px-5 py-3 font-semibold text-white">
                  {config.heroButton}
                </span>
              </div>
            </section>
          )}

          {activeTab === "content" && (
            <section className={`${cardClass} space-y-5`}>
              <div>
                <h3 className="text-lg font-bold">Page Content</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Edit the heading and introduction above your products.
                </p>
              </div>

              <Field
                label="Page heading"
                value={config.pageTitle}
                onChange={(value) => updateField("pageTitle", value)}
              />

              <Field
                label="Page description"
                value={config.pageDescription}
                onChange={(value) => updateField("pageDescription", value)}
                multiline
              />
            </section>
          )}

          {activeTab === "categories" && (
            <section className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">Manage Categories</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Add and remove categories for your product catalog.
                  </p>
                </div>

                <span className="rounded-full bg-sky-100 px-3 py-1.5 text-sm font-semibold text-sky-700">
                  {config.categories.length} categories
                </span>
              </div>

              <div className={`${cardClass} flex flex-col gap-3 sm:flex-row`}>
                <input
                  value={categoryInput}
                  onChange={(event) => setCategoryInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addCategory();
                    }
                  }}
                  placeholder="Enter a new category name"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />

                <button
                  type="button"
                  onClick={addCategory}
                  className={buttonClass}
                >
                  <Plus size={17} />
                  Add Category
                </button>
              </div>

              <div className="space-y-3">
                {config.categories.map((category, index) => (
                  <article
                    key={`${category}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                        <ImageIcon size={20} />
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold">{category}</p>
                        <p className="text-xs text-slate-500">
                          Category {index + 1}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteCategory(category)}
                      aria-label={`Delete ${category}`}
                      className="rounded-xl p-2.5 text-red-500 transition hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </article>
                ))}

                {config.categories.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                    No categories yet. Add your first category above.
                  </div>
                )}
              </div>
            </section>
          )}

          {activeTab === "products" && (
            <section className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">Manage Products</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {config.products.length} products in your catalog.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openAddProduct}
                  className={buttonClass}
                >
                  <Plus size={17} />
                  Add Product
                </button>
              </div>

              {showProductForm && (
                <form
                  onSubmit={saveProduct}
                  className={`${cardClass} space-y-5 border-sky-200`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold">
                      {editingId === null ? "Add Product" : "Edit Product"}
                    </h3>

                    <button
                      type="button"
                      onClick={() => setShowProductForm(false)}
                      className="rounded-lg p-2 hover:bg-slate-100"
                      aria-label="Close product form"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="Product name"
                      value={productForm.name}
                      onChange={(value) =>
                        setProductForm((old) => ({ ...old, name: value }))
                      }
                    />

                    <Field
                      label="Product code"
                      value={productForm.code}
                      onChange={(value) =>
                        setProductForm((old) => ({ ...old, code: value }))
                      }
                    />

                    <Field
                      label="Price"
                      value={productForm.price}
                      onChange={(value) =>
                        setProductForm((old) => ({ ...old, price: value }))
                      }
                      placeholder="Optional"
                    />

                    <Field
                      label="Badge"
                      value={productForm.badge}
                      onChange={(value) =>
                        setProductForm((old) => ({ ...old, badge: value }))
                      }
                      placeholder="New, Featured..."
                    />
                  </div>

                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-600">
                      Category
                    </span>

                    <select
                      value={productForm.category}
                      onChange={(event) =>
                        setProductForm((old) => ({
                          ...old,
                          category: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-sky-400"
                    >
                      {config.categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}

                      {config.categories.length === 0 && (
                        <option value="Makeup">Makeup</option>
                      )}
                    </select>
                  </label>

                  <ImagePicker
                    label="Product image"
                    value={productForm.image}
                    onChange={(value) =>
                      setProductForm((old) => ({ ...old, image: value }))
                    }
                  />

                  <Field
                    label="Description"
                    value={productForm.description}
                    onChange={(value) =>
                      setProductForm((old) => ({
                        ...old,
                        description: value,
                      }))
                    }
                    multiline
                  />

                  <div className="flex flex-wrap gap-2">
                    <button type="submit" className={buttonClass}>
                      <Check size={17} />
                      Save Product
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowProductForm(false)}
                      className={secondaryButtonClass}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {config.products.map((product, index) => (
                  <article
                    key={product._id ?? product.id ?? index}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-24 w-24 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                        <ImageIcon size={25} />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="font-bold">{product.name}</p>

                      <p className="mt-1 text-sm text-slate-500">
                        {product.category || "Uncategorized"} ·{" "}
                        {product.code || "No code"}
                      </p>

                      {product.price && (
                        <p className="mt-1 text-sm font-semibold text-sky-700">
                          Price: {product.price}
                        </p>
                      )}

                      {product.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                          {product.description}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditProduct(product)}
                        aria-label="Edit product"
                        className="rounded-xl border border-slate-200 p-2.5 hover:bg-slate-50"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteProduct(product)}
                        aria-label="Delete product"
                        className="rounded-xl border border-red-100 p-2.5 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </article>
                ))}

                {config.products.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                    <ShoppingBag size={30} className="mx-auto mb-3" />
                    <p className="font-semibold">No products yet</p>
                    <p className="mt-2 text-sm">
                      Click Add Product to create your first product.
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {activeTab === "design" && (
            <section className={`${cardClass} space-y-5`}>
              <div>
                <h3 className="text-lg font-bold">Colors & Design</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Customize the product banner color and image.
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4">
                <div>
                  <p className="font-medium">Hero background color</p>
                  <p className="text-sm text-slate-500">{config.heroColor}</p>
                </div>

                <input
                  type="color"
                  value={config.heroColor || "#e0f2fe"}
                  onChange={(event) =>
                    updateField("heroColor", event.target.value)
                  }
                  className="h-11 w-14 cursor-pointer rounded-lg border-0"
                />
              </div>

              <ImagePicker
                label="Hero image"
                value={config.heroImage}
                onChange={(value) => updateField("heroImage", value)}
              />

              <div
                className="rounded-2xl p-8"
                style={{
                  backgroundColor: config.heroColor,
                  backgroundImage: config.heroImage
                    ? `linear-gradient(90deg, ${config.heroColor}ee, ${config.heroColor}66), url("${config.heroImage}")`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <p className="font-semibold">{config.heroBadge}</p>
                <h3 className="mt-3 text-3xl font-bold">{config.heroTitle}</h3>
                <p className="mt-2">{config.heroDescription}</p>
              </div>
            </section>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={resetSettings}
              disabled={saving}
              className={secondaryButtonClass}
            >
              <RotateCcw size={16} />
              Reset Settings
            </button>

            <button
              type="button"
              onClick={save}
              disabled={saving}
              className={buttonClass}
            >
              {saving ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-500">
            Product page settings are loaded from MongoDB. Category and product
            edits are stored when you click Save Changes. The public Products
            page must load this same API to display saved changes.
          </p>
        </div>
      </main>
    </div>
  );
}
