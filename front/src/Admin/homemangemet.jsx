import { useEffect, useState } from "react";
import {
  Save,
  Eye,
  Home,
  Image as ImageIcon,
  ShoppingBag,
  Palette,
  Type,
  Plus,
  Trash2,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Layers,
  EyeOff,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/home";

const initialContent = {
  brand: "FASHION",
  heroBackgroundType: "image",
  heroBadge: "Discover Your Beauty",
  heroTitle: "Your Beauty.",
  heroSubtitle: "Your Story.",
  heroDescription:
    "Discover beauty and fashion essentials that express your individuality. Find your favorite products and create a look that feels uniquely yours.",
  heroVideo: "/videos/hero.mp4",
  heroPoster:
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
  primaryButton: "Shop Collection",
  secondaryButton: "Explore More",
  primaryColor: "#38bdf8",
  backgroundColor: "#ffffff",
  textColor: "#1e293b",
  promotionTitle: "A Little Beauty, A Lot of Confidence",
  promotionDescription:
    "Discover beauty essentials that help you express yourself and feel confident every day.",
  footerDescription: "Your style, your story. Find what feels like you.",
  categories: [
    {
      name: "Makeup",
      description: "Express your beauty",
      image:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=85",
    },
    {
      name: "Skincare",
      description: "Care for your skin",
      image:
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85",
    },
    {
      name: "Fashion",
      description: "Complete your look",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=85",
    },
  ],
  products: [
    {
      name: "Radiant Foundation",
      category: "Makeup",
      price: "19.99",
      image:
        "https://images.unsplash.com/photo-1631214540242-7b7c7f2a4c6b?auto=format&fit=crop&w=600&q=85",
      badge: "Popular",
    },
    {
      name: "Everyday Lip Tint",
      category: "Lip Makeup",
      price: "12.50",
      image:
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=85",
      badge: "New",
    },
    {
      name: "Skin Care Essentials",
      category: "Skincare",
      price: "24.00",
      image:
        "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=600&q=85",
      badge: "",
    },
    {
      name: "Beauty Collection",
      category: "Beauty",
      price: "29.99",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=85",
      badge: "Trending",
    },
  ],
  sections: [
    { type: "hero", title: "Hero", order: 0, isActive: true },
    { type: "categories", title: "Categories", order: 1, isActive: true },
    { type: "products", title: "Featured Products", order: 2, isActive: true },
    { type: "promotion", title: "Promotion", order: 3, isActive: true },
    { type: "footer", title: "Footer", order: 4, isActive: true },
  ],
};

const tabs = [
  { id: "sections", label: "Homepage Sections", icon: Layers },
  { id: "hero", label: "Home Hero", icon: Home },
  { id: "categories", label: "Categories", icon: ImageIcon },
  { id: "products", label: "Products", icon: ShoppingBag },
  { id: "promotion", label: "Promotion", icon: Type },
  { id: "design", label: "Colors & Design", icon: Palette },
  { id: "footer", label: "Footer", icon: Type },
];

const sectionOptions = [
  { type: "hero", title: "Hero" },
  { type: "categories", title: "Categories" },
  { type: "products", title: "Featured Products" },
  { type: "promotion", title: "Promotion" },
  { type: "custom", title: "Custom Section" },
  { type: "footer", title: "Footer" },
];

function Field({ label, value, onChange, multiline = false, type = "text" }) {
  const className =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100";
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      {multiline ? (
        <textarea
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={className}
        />
      ) : (
        <input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={className}
        />
      )}
    </label>
  );
}

function moveInList(list, index, direction) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= list.length) return list;
  const next = [...list];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  return next;
}

export default function HomeManagement() {
  const [content, setContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState("sections");
  const [preview, setPreview] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadContent() {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Could not load website content.");
        if (!cancelled) {
          const savedContent = data.content ?? data;
          setContent({
            ...initialContent,
            ...savedContent,
            categories:
              Array.isArray(savedContent.categories) &&
              savedContent.categories.length > 0
                ? savedContent.categories
                : initialContent.categories,
            products:
              Array.isArray(savedContent.products) &&
              savedContent.products.length > 0
                ? savedContent.products
                : initialContent.products,
            sections:
              Array.isArray(savedContent.sections) &&
              savedContent.sections.length > 0
                ? [...savedContent.sections].sort((a, b) => a.order - b.order)
                : initialContent.sections,
          });
          setMessage("");
        }
      } catch (error) {
        if (!cancelled)
          setMessage(
            `Could not load content from MongoDB: ${error.message}. Check that your backend is running.`,
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadContent();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = (key, value) => {
    setContent((old) => ({ ...old, [key]: value }));
    setMessage("");
  };

  const updateItem = (listName, index, key, value) => {
    setContent((old) => ({
      ...old,
      [listName]: old[listName].map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    }));
    setMessage("");
  };

  const addItem = (listName) => {
    const item =
      listName === "products"
        ? {
            name: "New Product",
            category: "Beauty",
            price: "0.00",
            image: "",
            badge: "New",
          }
        : { name: "New Category", description: "Discover more", image: "" };
    setContent((old) => ({ ...old, [listName]: [...old[listName], item] }));
    setMessage("");
  };

  const deleteItem = (listName, index) => {
    setContent((old) => ({
      ...old,
      [listName]: old[listName].filter((_, i) => i !== index),
    }));
    setMessage("");
  };

  const moveItem = (listName, index, direction) => {
    setContent((old) => ({
      ...old,
      [listName]: moveInList(old[listName], index, direction).map((item, i) =>
        listName === "sections" ? { ...item, order: i } : item,
      ),
    }));
    setMessage("");
  };

  const addSection = (type) => {
    const option = sectionOptions.find((item) => item.type === type);
    if (!option) return;
    setContent((old) => ({
      ...old,
      sections: [
        ...old.sections,
        {
          type: option.type,
          title: option.title,
          description: "",
          order: old.sections.length,
          isActive: true,
        },
      ],
    }));
    setMessage("");
  };

  const updateSection = (index, key, value) => {
    setContent((old) => ({
      ...old,
      sections: old.sections.map((section, i) =>
        i === index ? { ...section, [key]: value } : section,
      ),
    }));
    setMessage("");
  };

  const save = async () => {
    if (saving) return;
    setSaving(true);
    setMessage("Saving changes to MongoDB...");
    try {
      const payload = {
        ...content,
        sections: content.sections.map((section, order) => ({
          ...section,
          order,
        })),
      };
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Could not save website content.");
      const savedContent = data.content ?? data;
      setContent((old) => ({
        ...old,
        ...savedContent,
        categories: Array.isArray(savedContent.categories)
          ? savedContent.categories
          : old.categories,
        products: Array.isArray(savedContent.products)
          ? savedContent.products
          : old.products,
        sections: Array.isArray(savedContent.sections)
          ? [...savedContent.sections].sort((a, b) => a.order - b.order)
          : old.sections,
      }));
      setMessage("Successfully saved to MongoDB!");
    } catch (error) {
      setMessage(
        `Save failed: ${error.message}. Check your backend and API route.`,
      );
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    if (
      !window.confirm(
        "Restore default content in this editor? Click Save to update MongoDB.",
      )
    )
      return;
    setContent(initialContent);
    setMessage(
      "Default content loaded. Click Save Changes to store it in MongoDB.",
    );
  };

  const inputKeys = [
    ["heroBadge", "Badge text"],
    ["heroTitle", "Main title"],
    ["heroSubtitle", "Title highlight"],
    ["heroDescription", "Description"],
    ["primaryButton", "Primary button"],
    ["secondaryButton", "Secondary button"],
  ];

  const renderHero = () => (
    <section className="relative isolate overflow-hidden px-6 py-24 text-white md:px-16">
      {content.heroBackgroundType === "video" && content.heroVideo ? (
        <video
          key={content.heroVideo}
          autoPlay
          muted
          loop
          playsInline
          poster={content.heroPoster}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        >
          <source src={content.heroVideo} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: `url("${content.heroPoster}")` }}
        />
      )}
      <div className="absolute inset-0 -z-10 bg-slate-950/60" />
      <p className="mb-4">{content.heroBadge}</p>
      <h1 className="max-w-3xl text-5xl font-bold md:text-7xl">
        {content.heroTitle}
        <span className="mt-2 block" style={{ color: content.primaryColor }}>
          {content.heroSubtitle}
        </span>
      </h1>
      <p className="mt-6 max-w-2xl leading-8">{content.heroDescription}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <span
          className="rounded-full px-6 py-3 font-semibold text-white"
          style={{ backgroundColor: content.primaryColor }}
        >
          {content.primaryButton}
        </span>
        <span className="rounded-full border border-white px-6 py-3">
          {content.secondaryButton}
        </span>
      </div>
    </section>
  );

  const renderCategories = () => (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <h2 className="mb-7 text-3xl font-bold">Explore Our Categories</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {content.categories.map((item, index) => (
          <article
            key={item._id || index}
            className="overflow-hidden rounded-2xl border"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="h-64 w-full object-cover"
              />
            )}
            <div className="p-5">
              <h3 className="text-xl font-bold">{item.name}</h3>
              <p className="mt-2">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
  const renderProducts = () => (
    <section className="bg-slate-50 px-6 py-14">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-7 text-3xl font-bold text-slate-900">
          Featured Products
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {content.products.map((item, index) => (
            <article
              key={item._id || index}
              className="overflow-hidden rounded-2xl bg-white p-3 text-slate-800 shadow-sm"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-56 w-full rounded-xl object-cover"
                />
              )}
              <div className="p-2">
                <p className="mt-2 text-xs uppercase text-sky-600">
                  {item.category}
                </p>
                <h3 className="mt-2 font-semibold">{item.name}</h3>
                <p className="mt-2 font-bold">${item.price}</p>
                <p className="mt-1 text-sm text-slate-500">{item.badge}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
  const renderPromotion = () => (
    <section
      className="px-6 py-16 text-center text-white"
      style={{ backgroundColor: content.primaryColor }}
    >
      <h2 className="text-3xl font-bold">{content.promotionTitle}</h2>
      <p className="mx-auto mt-4 max-w-xl">{content.promotionDescription}</p>
    </section>
  );
  const renderFooter = () => (
    <footer className="px-6 py-8 text-center">
      <h2 className="text-xl font-bold">{content.brand}</h2>
      <p className="mt-2">{content.footerDescription}</p>
    </footer>
  );

  const renderSection = (section, index) => {
    if (!section.isActive) return null;
    const key = section._id || `${section.type}-${index}`;
    switch (section.type) {
      case "hero":
        return <div key={key}>{renderHero()}</div>;
      case "categories":
        return <div key={key}>{renderCategories()}</div>;
      case "products":
        return <div key={key}>{renderProducts()}</div>;
      case "promotion":
        return <div key={key}>{renderPromotion()}</div>;
      case "footer":
        return <div key={key}>{renderFooter()}</div>;
      case "custom":
        return (
          <section key={key} className="mx-auto max-w-7xl px-6 py-14">
            <h2 className="text-3xl font-bold">
              {section.title || "New Section"}
            </h2>
            {section.description && (
              <p className="mt-4">{section.description}</p>
            )}
          </section>
        );
      default:
        return null;
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-700">
        Loading website content...
      </div>
    );

  if (preview)
    return (
      <div
        className="min-h-screen"
        style={{
          backgroundColor: content.backgroundColor,
          color: content.textColor,
        }}
      >
        <div className="sticky top-0 z-30 flex items-center justify-between bg-slate-950 px-5 py-3 text-white">
          <span className="font-semibold">Website Preview</span>
          <button
            onClick={() => setPreview(false)}
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900"
          >
            Back to Editor
          </button>
        </div>
        <header className="flex items-center justify-between px-6 py-5">
          <h2 className="text-2xl font-bold">{content.brand}</h2>
          <span className="text-sm">Beauty · Fashion · You</span>
        </header>
        {[...content.sections]
          .sort((a, b) => a.order - b.order)
          .map(renderSection)}
      </div>
    );

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
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${activeTab === tab.id ? "bg-sky-400 font-semibold text-slate-950" : "text-slate-300 hover:bg-slate-800"}`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-sky-600">
                WEBSITE SETTINGS
              </p>
              <h2 className="mt-1 text-3xl font-bold">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Edit your content, order sections, and preview before saving.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setPreview(true)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50"
              >
                <Eye size={17} /> Preview
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-60"
              >
                <Save size={17} />
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
          {message && (
            <div className="mb-5 rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800">
              {message}
            </div>
          )}

          {activeTab === "sections" && (
            <section className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-bold">Manage Homepage Sections</h3>
                <div className="flex flex-wrap gap-2">
                  {sectionOptions.map((option) => (
                    <button
                      key={option.type}
                      onClick={() => addSection(option.type)}
                      className="flex items-center gap-1 rounded-lg bg-sky-500 px-3 py-2 text-sm font-semibold text-white"
                    >
                      <Plus size={15} />
                      {option.title}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-500">
                Use the arrows to reorder sections. Toggle visibility or remove
                a section. Changes are saved to MongoDB when you click Save.
              </p>
              {content.sections.map((section, index) => (
                <article
                  key={section._id || `${section.type}-${index}`}
                  className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 font-bold text-sky-700">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-bold">
                          {section.title || section.type}
                        </p>
                        <p className="text-xs uppercase text-slate-500">
                          {section.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        title="Move up"
                        disabled={index === 0}
                        onClick={() => moveItem("sections", index, -1)}
                        className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-30"
                      >
                        <ArrowUp size={18} />
                      </button>
                      <button
                        title="Move down"
                        disabled={index === content.sections.length - 1}
                        onClick={() => moveItem("sections", index, 1)}
                        className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-30"
                      >
                        <ArrowDown size={18} />
                      </button>
                      <button
                        title={
                          section.isActive ? "Hide section" : "Show section"
                        }
                        onClick={() =>
                          updateSection(index, "isActive", !section.isActive)
                        }
                        className="rounded-lg p-2 hover:bg-slate-100"
                      >
                        {section.isActive ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                      <button
                        title="Delete section"
                        onClick={() => deleteItem("sections", index)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <Field
                    label="Section title"
                    value={section.title}
                    onChange={(value) => updateSection(index, "title", value)}
                  />
                  {section.type === "custom" && (
                    <Field
                      label="Section description"
                      value={section.description}
                      onChange={(value) =>
                        updateSection(index, "description", value)
                      }
                      multiline
                    />
                  )}
                </article>
              ))}
            </section>
          )}

          {activeTab === "hero" && (
            <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
              <h3 className="text-lg font-bold">Homepage Hero Section</h3>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-600">
                  Background Type
                </span>
                <select
                  value={content.heroBackgroundType}
                  onChange={(e) => update("heroBackgroundType", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3"
                >
                  <option value="image">Image Background</option>
                  <option value="video">Video Background</option>
                </select>
              </label>
              {content.heroBackgroundType === "image" ? (
                <Field
                  label="Background Image URL"
                  value={content.heroPoster}
                  onChange={(v) => update("heroPoster", v)}
                />
              ) : (
                <>
                  <Field
                    label="Video URL or public path"
                    value={content.heroVideo}
                    onChange={(v) => update("heroVideo", v)}
                  />
                  <Field
                    label="Poster Image URL"
                    value={content.heroPoster}
                    onChange={(v) => update("heroPoster", v)}
                  />
                </>
              )}
              {content.heroBackgroundType === "image" && content.heroPoster && (
                <img
                  src={content.heroPoster}
                  alt="Hero background preview"
                  className="h-48 w-full rounded-xl object-cover"
                />
              )}
              {content.heroBackgroundType === "video" && content.heroVideo && (
                <video
                  key={content.heroVideo}
                  src={content.heroVideo}
                  poster={content.heroPoster}
                  controls
                  muted
                  className="h-48 w-full rounded-xl bg-slate-900 object-cover"
                />
              )}
              {inputKeys.map(([key, label]) => (
                <Field
                  key={key}
                  label={label}
                  value={content[key]}
                  onChange={(value) => update(key, value)}
                  multiline={key === "heroDescription"}
                />
              ))}
            </section>
          )}

          {activeTab === "categories" && (
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Manage Categories</h3>
                <button
                  onClick={() => addItem("categories")}
                  className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <Plus size={17} />
                  Add Category
                </button>
              </div>
              {content.categories.map((item, index) => (
                <article
                  key={item._id || index}
                  className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold">Category {index + 1}</h4>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={index === 0}
                        onClick={() => moveItem("categories", index, -1)}
                        className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-30"
                        title="Move up"
                      >
                        <ArrowUp size={18} />
                      </button>
                      <button
                        disabled={index === content.categories.length - 1}
                        onClick={() => moveItem("categories", index, 1)}
                        className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-30"
                        title="Move down"
                      >
                        <ArrowDown size={18} />
                      </button>
                      <button
                        onClick={() => deleteItem("categories", index)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        aria-label="Delete category"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <Field
                    label="Category name"
                    value={item.name}
                    onChange={(v) => updateItem("categories", index, "name", v)}
                  />
                  <Field
                    label="Description"
                    value={item.description}
                    onChange={(v) =>
                      updateItem("categories", index, "description", v)
                    }
                  />
                  <Field
                    label="Image URL"
                    value={item.image}
                    onChange={(v) =>
                      updateItem("categories", index, "image", v)
                    }
                  />
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-36 w-40 rounded-xl object-cover"
                    />
                  )}
                </article>
              ))}
            </section>
          )}

          {activeTab === "products" && (
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Manage Products</h3>
                <button
                  onClick={() => addItem("products")}
                  className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <Plus size={17} />
                  Add Product
                </button>
              </div>
              {content.products.map((item, index) => (
                <article
                  key={item._id || index}
                  className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold">Product {index + 1}</h4>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={index === 0}
                        onClick={() => moveItem("products", index, -1)}
                        className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-30"
                        title="Move up"
                      >
                        <ArrowUp size={18} />
                      </button>
                      <button
                        disabled={index === content.products.length - 1}
                        onClick={() => moveItem("products", index, 1)}
                        className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-30"
                        title="Move down"
                      >
                        <ArrowDown size={18} />
                      </button>
                      <button
                        onClick={() => deleteItem("products", index)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        aria-label="Delete product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="Product name"
                      value={item.name}
                      onChange={(v) => updateItem("products", index, "name", v)}
                    />
                    <Field
                      label="Category"
                      value={item.category}
                      onChange={(v) =>
                        updateItem("products", index, "category", v)
                      }
                    />
                    <Field
                      label="Price"
                      value={item.price}
                      onChange={(v) =>
                        updateItem("products", index, "price", v)
                      }
                    />
                    <Field
                      label="Badge"
                      value={item.badge}
                      onChange={(v) =>
                        updateItem("products", index, "badge", v)
                      }
                    />
                  </div>
                  <Field
                    label="Image URL"
                    value={item.image}
                    onChange={(v) => updateItem("products", index, "image", v)}
                  />
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-36 w-36 rounded-xl object-cover"
                    />
                  )}
                </article>
              ))}
            </section>
          )}

          {activeTab === "promotion" && (
            <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
              <h3 className="text-lg font-bold">Promotional Banner</h3>
              <Field
                label="Promotion title"
                value={content.promotionTitle}
                onChange={(v) => update("promotionTitle", v)}
              />
              <Field
                label="Promotion description"
                value={content.promotionDescription}
                onChange={(v) => update("promotionDescription", v)}
                multiline
              />
            </section>
          )}
          {activeTab === "design" && (
            <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
              <h3 className="text-lg font-bold">Website Colors</h3>
              {[
                ["primaryColor", "Primary color"],
                ["backgroundColor", "Background color"],
                ["textColor", "Text color"],
              ].map(([key, label]) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-3"
                >
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-slate-500">{content[key]}</p>
                  </div>
                  <input
                    type="color"
                    value={content[key]}
                    onChange={(e) => update(key, e.target.value)}
                    className="h-11 w-14 cursor-pointer rounded-lg border-0 bg-transparent"
                  />
                </div>
              ))}
              <Field
                label="Brand name"
                value={content.brand}
                onChange={(v) => update("brand", v)}
              />
            </section>
          )}
          {activeTab === "footer" && (
            <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
              <h3 className="text-lg font-bold">Footer Settings</h3>
              <Field
                label="Brand name"
                value={content.brand}
                onChange={(v) => update("brand", v)}
              />
              <Field
                label="Footer description"
                value={content.footerDescription}
                onChange={(v) => update("footerDescription", v)}
                multiline
              />
            </section>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={reset}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <RotateCcw size={16} />
              Reset Content
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white hover:bg-sky-600 disabled:opacity-60"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            Homepage settings are loaded from MongoDB. Save changes to persist
            edits. The public homepage must use the same sections array to
            reflect section ordering and visibility.
          </p>
        </div>
      </main>
    </div>
  );
}
