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
  Video,
  Upload,
  Play,
  X,
  LoaderCircle,
  CheckCircle,
  Link as LinkIcon,
} from "lucide-react";

const API_URL = "https://zharaallcode.onrender.com/api/home";

// Cloudinary configuration.
// Create an unsigned upload preset in your Cloudinary account.
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";

const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

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

  videos: [],

  sections: [
    { type: "hero", title: "Hero", order: 0, isActive: true },
    { type: "categories", title: "Categories", order: 1, isActive: true },
    { type: "videos", title: "Beauty Videos", order: 2, isActive: true },
    { type: "promotion", title: "Promotion", order: 3, isActive: true },
    { type: "footer", title: "Footer", order: 4, isActive: true },
  ],
};

const tabs = [
  { id: "sections", label: "Homepage Sections", icon: Layers },
  { id: "hero", label: "Home Hero", icon: Home },
  { id: "categories", label: "Categories", icon: ImageIcon },
  { id: "videos", label: "Videos Management", icon: Video },
  { id: "promotion", label: "Promotion", icon: Type },
  { id: "design", label: "Colors & Design", icon: Palette },
  { id: "footer", label: "Footer", icon: Type },
];

const sectionOptions = [
  { type: "hero", title: "Hero" },
  { type: "categories", title: "Categories" },
  { type: "videos", title: "Beauty Videos" },
  { type: "promotion", title: "Promotion" },
  { type: "custom", title: "Custom Section" },
  { type: "footer", title: "Footer" },
];

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
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={className}
        />
      ) : (
        <input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
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

function normalizeSections(sections) {
  if (!Array.isArray(sections) || sections.length === 0) {
    return initialContent.sections;
  }

  return sections
    .filter((section) => section.type !== "products")
    .map((section) => ({
      ...section,
      type: section.type === "products" ? "videos" : section.type,
      title: section.type === "products" ? "Beauty Videos" : section.title,
    }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((section, index) => ({
      ...section,
      order: index,
    }));
}

export default function HomeManagement() {
  const [content, setContent] = useState(initialContent);

  const [activeTab, setActiveTab] = useState("sections");
  const [preview, setPreview] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(null);

  // LOAD HOMEPAGE CONTENT FROM MONGODB

  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load website content.");
        }

        if (cancelled) return;

        const savedContent = data.content ?? data;

        setContent({
          ...initialContent,
          ...savedContent,

          categories: Array.isArray(savedContent.categories)
            ? savedContent.categories
            : initialContent.categories,

          videos: Array.isArray(savedContent.videos) ? savedContent.videos : [],

          sections: normalizeSections(savedContent.sections),
        });

        setMessage("");
      } catch (error) {
        if (!cancelled) {
          setMessage(`Could not load content: ${error.message}`);
          setMessageType("error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadContent();

    return () => {
      cancelled = true;
    };
  }, []);

  // UPDATE MAIN CONTENT

  const update = (key, value) => {
    setContent((old) => ({
      ...old,
      [key]: value,
    }));

    setMessage("");
  };

  // UPDATE CATEGORY OR VIDEO

  const updateItem = (listName, index, key, value) => {
    setContent((old) => ({
      ...old,

      [listName]: old[listName].map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    }));

    setMessage("");
  };

  // ADD CATEGORY OR VIDEO

  const addItem = (listName) => {
    let item;

    if (listName === "categories") {
      item = {
        name: "New Category",
        description: "Discover more",
        image: "",
      };
    } else if (listName === "videos") {
      item = {
        id: crypto.randomUUID(),
        title: "New Beauty Video",
        description: "Discover something beautiful.",
        url: "",
        publicId: "",
        originalFileName: "",
      };
    }

    setContent((old) => ({
      ...old,
      [listName]: [...old[listName], item],
    }));

    setMessage("");
  };

  // DELETE ITEM

  const deleteItem = (listName, index) => {
    if (listName === "videos" && !window.confirm("Remove this video card?")) {
      return;
    }

    setContent((old) => ({
      ...old,
      [listName]: old[listName].filter((_, i) => i !== index),
    }));

    setMessage(
      listName === "videos"
        ? "Video removed from the editor. Save Changes to update the website."
        : "",
    );
  };

  // REORDER ITEMS

  const moveItem = (listName, index, direction) => {
    setContent((old) => ({
      ...old,

      [listName]: moveInList(old[listName], index, direction).map((item, i) =>
        listName === "sections" ? { ...item, order: i } : item,
      ),
    }));

    setMessage("");
  };

  // ADD HOMEPAGE SECTION

  const addSection = (type) => {
    const option = sectionOptions.find((item) => item.type === type);

    if (!option) return;

    if (
      type !== "custom" &&
      content.sections.some((section) => section.type === type)
    ) {
      setMessage("This section already exists.");
      setMessageType("error");
      return;
    }

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

  // UPDATE SECTION

  const updateSection = (index, key, value) => {
    setContent((old) => ({
      ...old,

      sections: old.sections.map((section, i) =>
        i === index ? { ...section, [key]: value } : section,
      ),
    }));

    setMessage("");
  };

  // UPLOAD VIDEO TO CLOUDINARY

  const uploadVideo = async (index, file) => {
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setMessage("Please select a valid video file.");
      setMessageType("error");
      return;
    }

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setMessage(
        "Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your frontend .env file.",
      );
      setMessageType("error");
      return;
    }

    setUploadingVideo(index);
    setMessage("Uploading video...");

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("resource_type", "video");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Video upload failed.");
      }

      setContent((old) => ({
        ...old,

        videos: old.videos.map((item, i) =>
          i === index
            ? {
                ...item,
                url: data.secure_url,
                publicId: data.public_id,
                originalFileName: file.name,
              }
            : item,
        ),
      }));

      setMessage(
        "Video uploaded successfully. Click Save Changes to store its URL in MongoDB.",
      );
      setMessageType("success");
    } catch (error) {
      setMessage(`Video upload failed: ${error.message}`);
      setMessageType("error");
    } finally {
      setUploadingVideo(null);
    }
  };

  // SAVE TO MONGODB

  const save = async () => {
    if (saving) return;

    setSaving(true);
    setMessage("Saving changes to MongoDB...");
    setMessageType("info");

    try {
      const payload = {
        ...content,

        categories: Array.isArray(content.categories) ? content.categories : [],

        videos: Array.isArray(content.videos) ? content.videos : [],

        sections: content.sections
          .filter((section) => section.type !== "products")
          .map((section, order) => ({
            ...section,
            order,
          })),
      };

      const response = await fetch(API_URL, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save website content.");
      }

      const savedContent = data.content ?? data;

      setContent((old) => ({
        ...old,
        ...savedContent,

        categories: Array.isArray(savedContent.categories)
          ? savedContent.categories
          : old.categories,

        videos: Array.isArray(savedContent.videos)
          ? savedContent.videos
          : old.videos,

        sections: Array.isArray(savedContent.sections)
          ? normalizeSections(savedContent.sections)
          : payload.sections,
      }));

      setMessage("Successfully saved to MongoDB!");
      setMessageType("success");
    } catch (error) {
      setMessage(`Save failed: ${error.message}`);
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  // RESET CONTENT

  const reset = () => {
    if (
      !window.confirm(
        "Restore default content? Click Save Changes to update MongoDB.",
      )
    ) {
      return;
    }

    setContent(initialContent);

    setMessage("Default content loaded. Click Save Changes to store it.");

    setMessageType("info");
  };

  // HERO FIELDS

  const inputKeys = [
    ["heroBadge", "Badge text"],
    ["heroTitle", "Main title"],
    ["heroSubtitle", "Title highlight"],
    ["heroDescription", "Description"],
    ["primaryButton", "Primary button"],
    ["secondaryButton", "Secondary button"],
  ];

  // HERO PREVIEW

  const renderHero = () => (
    <section className="relative isolate min-h-[550px] overflow-hidden px-6 py-24 text-white md:px-16">
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
          style={{
            backgroundImage: `url("${content.heroPoster}")`,
          }}
        />
      )}

      <div className="absolute inset-0 -z-10 bg-slate-950/60" />

      <div className="mx-auto max-w-7xl">
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
            style={{
              backgroundColor: content.primaryColor,
            }}
          >
            {content.primaryButton}
          </span>

          <span className="rounded-full border border-white px-6 py-3">
            {content.secondaryButton}
          </span>
        </div>
      </div>
    </section>
  );

  // CATEGORIES PREVIEW

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

  // VIDEO CARDS PREVIEW

  const renderVideos = () => (
    <section className="bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-sky-500">
            Watch & Discover
          </p>

          <h2 className="text-3xl font-bold text-slate-900">Beauty Videos</h2>

          <p className="mt-3 text-slate-500">
            Explore our latest beauty and fashion videos.
          </p>
        </div>

        {content.videos.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {content.videos
              .filter((item) => item.url)
              .map((item, index) => (
                <article
                  key={item.id || item._id || index}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm"
                >
                  <video
                    src={item.url}
                    controls
                    playsInline
                    preload="metadata"
                    className="aspect-video w-full bg-black object-cover"
                  />

                  <div className="p-5">
                    <h3 className="font-bold text-slate-900">{item.title}</h3>

                    <p className="mt-2 text-sm text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
          </div>
        ) : (
          <p className="py-12 text-center text-slate-400">
            Videos will appear here soon.
          </p>
        )}
      </div>
    </section>
  );

  // PROMOTION PREVIEW

  const renderPromotion = () => (
    <section
      className="px-6 py-16 text-center text-white"
      style={{
        backgroundColor: content.primaryColor,
      }}
    >
      <h2 className="text-3xl font-bold">{content.promotionTitle}</h2>

      <p className="mx-auto mt-4 max-w-xl">{content.promotionDescription}</p>
    </section>
  );

  // FOOTER PREVIEW

  const renderFooter = () => (
    <footer className="border-t border-slate-200 px-6 py-8 text-center">
      <h2 className="text-xl font-bold">{content.brand}</h2>

      <p className="mt-2">{content.footerDescription}</p>
    </footer>
  );

  // RENDER HOMEPAGE SECTIONS

  const renderSection = (section, index) => {
    if (!section.isActive) return null;

    const key = section._id || `${section.type}-${index}`;

    switch (section.type) {
      case "hero":
        return <div key={key}>{renderHero()}</div>;

      case "categories":
        return <div key={key}>{renderCategories()}</div>;

      case "videos":
        return <div key={key}>{renderVideos()}</div>;

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

  // LOADING

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-700">
        <LoaderCircle className="mr-3 animate-spin" size={22} />
        Loading website content...
      </div>
    );
  }

  // WEBSITE PREVIEW

  if (preview) {
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
  }

  // ADMIN PANEL

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 md:flex">
      {/* BLACK SIDEBAR */}

      <aside className="bg-black p-5 text-white md:min-h-screen md:w-64 md:shrink-0">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-sky-400 p-2 text-black">
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
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                  activeTab === tab.id
                    ? "bg-sky-400 font-semibold text-black"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT */}

      <main className="min-w-0 flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-5xl">
          {/* HEADER */}

          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-sky-600">
                WEBSITE SETTINGS
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Edit your content, manage videos, order sections and preview
                your website.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setPreview(true)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50"
              >
                <Eye size={17} />
                Preview
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

          {/* MESSAGE */}

          {message && (
            <div
              className={`mb-5 flex items-start gap-2 rounded-xl border p-3 text-sm ${
                messageType === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : messageType === "success"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-sky-200 bg-sky-50 text-sky-800"
              }`}
            >
              {messageType === "success" ? <CheckCircle size={18} /> : null}

              <span>{message}</span>
            </div>
          )}

          {/* HOMEPAGE SECTIONS */}

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
                Reorder, hide or remove homepage sections. Products are no
                longer a homepage section.
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

          {/* HERO MANAGEMENT */}

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
                    label="Video URL"
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
                  alt="Hero background"
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

          {/* CATEGORY MANAGEMENT */}

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
                      >
                        <ArrowUp size={18} />
                      </button>

                      <button
                        disabled={index === content.categories.length - 1}
                        onClick={() => moveItem("categories", index, 1)}
                        className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-30"
                      >
                        <ArrowDown size={18} />
                      </button>

                      <button
                        onClick={() => deleteItem("categories", index)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
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

          {/* VIDEO MANAGEMENT */}

          {activeTab === "videos" && (
            <section className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">Beauty Videos</h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Upload videos and manage their homepage cards.
                  </p>
                </div>

                <button
                  onClick={() => addItem("videos")}
                  className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-600"
                >
                  <Plus size={17} />
                  Add Video Card
                </button>
              </div>

              {content.videos.length === 0 && (
                <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white px-5 py-14 text-center">
                  <Video size={40} className="mx-auto mb-4 text-slate-400" />

                  <h4 className="font-bold">No videos yet</h4>

                  <p className="mt-2 text-sm text-slate-500">
                    Add a video card to start building your video section.
                  </p>

                  <button
                    onClick={() => addItem("videos")}
                    className="mt-5 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white"
                  >
                    Add Your First Video
                  </button>
                </div>
              )}

              {content.videos.map((item, index) => (
                <article
                  key={item.id || item._id || index}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                        <Video size={20} />
                      </div>

                      <div>
                        <h4 className="font-bold">Video Card {index + 1}</h4>

                        <p className="text-xs text-slate-500">
                          {item.originalFileName || "No uploaded file"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        title="Move up"
                        disabled={index === 0}
                        onClick={() => moveItem("videos", index, -1)}
                        className="rounded-lg p-2 hover:bg-white disabled:opacity-30"
                      >
                        <ArrowUp size={18} />
                      </button>

                      <button
                        title="Move down"
                        disabled={index === content.videos.length - 1}
                        onClick={() => moveItem("videos", index, 1)}
                        className="rounded-lg p-2 hover:bg-white disabled:opacity-30"
                      >
                        <ArrowDown size={18} />
                      </button>

                      <button
                        title="Delete video"
                        onClick={() => deleteItem("videos", index)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-5 p-5 md:grid-cols-2">
                    <div className="space-y-4">
                      <Field
                        label="Video title"
                        value={item.title}
                        onChange={(v) =>
                          updateItem("videos", index, "title", v)
                        }
                        placeholder="Enter video title"
                      />

                      <Field
                        label="Video description"
                        value={item.description}
                        onChange={(v) =>
                          updateItem("videos", index, "description", v)
                        }
                        multiline
                        placeholder="Describe this video"
                      />

                      <Field
                        label="Video URL"
                        value={item.url}
                        onChange={(v) => updateItem("videos", index, "url", v)}
                        placeholder="Paste a video URL"
                      />

                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-sky-300 bg-sky-50 px-4 py-5 text-sm font-semibold text-sky-700 transition hover:bg-sky-100">
                        {uploadingVideo === index ? (
                          <>
                            <LoaderCircle size={19} className="animate-spin" />
                            Uploading video...
                          </>
                        ) : (
                          <>
                            <Upload size={19} />
                            Upload Video File
                          </>
                        )}

                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          disabled={uploadingVideo !== null}
                          onChange={(e) => {
                            const file = e.target.files?.[0];

                            if (file) {
                              uploadVideo(index, file);
                            }

                            e.target.value = "";
                          }}
                        />
                      </label>

                      <p className="text-xs leading-5 text-slate-500">
                        Upload a video to Cloudinary or paste an existing public
                        video URL. Save Changes after uploading.
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-sm font-medium text-slate-600">
                        Video Preview
                      </p>

                      {item.url ? (
                        <video
                          key={item.url}
                          src={item.url}
                          controls
                          playsInline
                          preload="metadata"
                          className="aspect-video w-full rounded-xl bg-black object-contain"
                        />
                      ) : (
                        <div className="flex aspect-video items-center justify-center rounded-xl bg-slate-950 text-white">
                          <div className="text-center">
                            <Play
                              size={35}
                              className="mx-auto mb-2 text-sky-400"
                            />

                            <p className="text-sm text-slate-400">
                              Video preview will appear here
                            </p>
                          </div>
                        </div>
                      )}

                      {item.url && (
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <span className="truncate text-xs text-green-600">
                            Video ready
                          </span>

                          <button
                            onClick={() =>
                              updateItem("videos", index, "url", "")
                            }
                            className="flex items-center gap-1 text-xs font-semibold text-red-500"
                          >
                            <X size={14} />
                            Remove URL
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}

          {/* PROMOTION */}

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

          {/* DESIGN */}

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

          {/* FOOTER */}

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

          {/* SAVE AND RESET */}

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
              disabled={saving || uploadingVideo !== null}
              className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white hover:bg-sky-600 disabled:opacity-60"
            >
              <Save size={18} />

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-500">
            Homepage settings and video URLs are saved in MongoDB. Uploaded
            video files are stored in Cloudinary.
          </p>
        </div>
      </main>
    </div>
  );
}
