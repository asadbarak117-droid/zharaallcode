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
  Video,
  MessageSquare,
  Search,
  Phone,
  LayoutGrid,
  Star,
  ExternalLink,
  EyeOff,
} from "lucide-react";

const API_URL = "https://zharaallcode.onrender.com/api/productsection";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const DEFAULT_CATEGORIES = [
  "Makeup",
  "Skincare",
  "Viper",
  "Spirulina",
  "Hair Care",
  "Soap & Body",
  "Perfume",
  "Pomegranate",
];

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

  categories: DEFAULT_CATEGORIES,
  categoryDetails: [],
  products: [],
  videos: [],
  comments: [],

  searchSection: {
    enabled: true,
    title: "Find Your Beauty Favorites",
    description: "Search and discover products for your routine.",
    showSearch: true,
    showCategoryFilters: true,
    showFavorites: true,
    showProductCount: true,
  },

  contactSection: {
    enabled: true,
    title: "Need Help Choosing?",
    description:
      "Contact us for product information and personalized beauty recommendations.",
    buttonText: "Contact Us",
    buttonLink: "/connect",
  },

  commentsSection: {
    enabled: true,
    title: "Customer Reviews",
    description: "Share your experience with our beauty collection.",
    showForm: true,
  },

  categoryDesign: {
    title: "Shop by Category",
    description: "Explore our beauty collections.",
    columns: "4",
    cardStyle: "rounded",
  },
};

const emptyProduct = {
  name: "",
  code: "",
  category: "Makeup",
  image: "",
  description: "",
  price: "",
  badge: "",
};

const emptyVideo = {
  title: "",
  description: "",
  url: "",
};

const emptyComment = {
  name: "",
  message: "",
  rating: 5,
  approved: true,
};

const tabs = [
  { id: "hero", label: "Product Hero", icon: Layers },
  { id: "content", label: "Page Content", icon: Type },
  { id: "categories", label: "Categories", icon: ImageIcon },
  { id: "products", label: "Products", icon: ShoppingBag },
  { id: "design", label: "Colors & Design", icon: Palette },
  { id: "videos", label: "Beauty Videos", icon: Video },
  { id: "comments", label: "Customer Comments", icon: MessageSquare },
  { id: "search", label: "Search & Filters", icon: Search },
  { id: "contact", label: "Contact Section", icon: Phone },
  { id: "categoryDesign", label: "Category Design", icon: LayoutGrid },
];

function normalizeConfig(data) {
  const source = data?.data ?? data?.content ?? data;

  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return {
      ...initialConfig,
      categories: [...DEFAULT_CATEGORIES],
      products: [],
      videos: [],
      comments: [],
      categoryDetails: [],
    };
  }

  return {
    ...initialConfig,
    ...source,

    categories: Array.isArray(source.categories)
      ? source.categories.filter((item) => typeof item === "string")
      : [...DEFAULT_CATEGORIES],

    products: Array.isArray(source.products) ? source.products : [],
    videos: Array.isArray(source.videos) ? source.videos : [],
    comments: Array.isArray(source.comments) ? source.comments : [],

    categoryDetails: Array.isArray(source.categoryDetails)
      ? source.categoryDetails
      : [],

    searchSection: {
      ...initialConfig.searchSection,
      ...(source.searchSection || {}),
    },

    contactSection: {
      ...initialConfig.contactSection,
      ...(source.contactSection || {}),
    },

    commentsSection: {
      ...initialConfig.commentsSection,
      ...(source.commentsSection || {}),
    },

    categoryDesign: {
      ...initialConfig.categoryDesign,
      ...(source.categoryDesign || {}),
    },
  };
}

function createId(prefix = "item") {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getItemId(item) {
  return String(item?._id ?? item?.id ?? "");
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read image."));

    reader.readAsDataURL(file);
  });
}

async function readResponse(response) {
  const text = await response.text();

  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("The server did not return valid JSON.");
  }
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

function Toggle({ label, checked, onChange, description }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
      <span>
        <span className="block text-sm font-semibold text-slate-700">
          {label}
        </span>

        {description && (
          <span className="mt-1 block text-xs text-slate-500">
            {description}
          </span>
        )}
      </span>

      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-sky-500"
      />
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

      const base64 = await fileToBase64(file);
      onChange(base64);
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
      setImageError("Please enter a valid image URL.");
    }
  }

  return (
    <div className="space-y-3">
      <span className="block text-sm font-medium text-slate-600">{label}</span>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSource("url")}
          className={`rounded-xl px-4 py-3 text-sm font-semibold ${
            source === "url"
              ? "bg-sky-500 text-white"
              : "border border-slate-200 bg-white text-slate-700"
          }`}
        >
          <ImageIcon size={16} className="mr-2 inline" />
          Image URL
        </button>

        <button
          type="button"
          onClick={() => setSource("device")}
          className={`rounded-xl px-4 py-3 text-sm font-semibold ${
            source === "device"
              ? "bg-sky-500 text-white"
              : "border border-slate-200 bg-white text-slate-700"
          }`}
        >
          <Plus size={16} className="mr-2 inline" />
          Upload Image
        </button>
      </div>

      <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-5">
        {value ? (
          <img
            src={value}
            alt={label}
            onError={() => setImageError("Could not display this image.")}
            className="mb-4 h-52 w-full rounded-xl bg-white object-contain"
          />
        ) : (
          <div className="mb-4 flex h-36 flex-col items-center justify-center rounded-xl bg-white text-slate-400">
            <ImageIcon size={32} />
            <p className="mt-2 text-sm">No image selected</p>
          </div>
        )}

        {source === "url" ? (
          <div className="space-y-3">
            <input
              type="url"
              value={urlInput}
              onChange={(event) => {
                setUrlInput(event.target.value);
                setImageError("");
              }}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-sky-400"
            />

            <button
              type="button"
              onClick={applyUrl}
              className="rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white"
            >
              <Check size={16} className="mr-2 inline" />
              Use Image URL
            </button>
          </div>
        ) : (
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white">
            {reading ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Plus size={17} />
            )}

            {reading ? "Reading..." : "Choose Image"}

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={reading}
              className="hidden"
            />
          </label>
        )}

        {imageError && (
          <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {imageError}
          </p>
        )}

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setUrlInput("");
              setImageError("");
            }}
            className="mt-4 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600"
          >
            <Trash2 size={16} className="mr-2 inline" />
            Remove Image
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProductManagement() {
  const [config, setConfig] = useState(() => normalizeConfig(initialConfig));

  const [activeTab, setActiveTab] = useState("hero");
  const [categoryInput, setCategoryInput] = useState("");

  const [productForm, setProductForm] = useState(emptyProduct);
  const [videoForm, setVideoForm] = useState(emptyVideo);
  const [commentForm, setCommentForm] = useState(emptyComment);

  const [editingId, setEditingId] = useState(null);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);

  const [showProductForm, setShowProductForm] = useState(false);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const cardClass =
    "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7";

  const buttonClass =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60";

  const secondaryButtonClass =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50";

  const messageClass =
    messageType === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : messageType === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-sky-200 bg-sky-50 text-sky-800";

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

        const data = await readResponse(response);

        if (!response.ok) {
          throw new Error(
            data.message || data.error || `Request failed: ${response.status}`,
          );
        }

        setConfig(normalizeConfig(data));
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Load error:", error);
          notify(`Could not load settings: ${error.message}`, "error");
        }
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

  function updateNested(section, key, value) {
    setConfig((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: value,
      },
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

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data.message || data.error || `Save failed: ${response.status}`,
        );
      }

      // Only replace local state if the server actually returned config data.
      // Some APIs return only { message: "Updated successfully" }.
      const returnedConfig = data?.data ?? data?.content ?? data;

      if (
        returnedConfig &&
        typeof returnedConfig === "object" &&
        !Array.isArray(returnedConfig) &&
        (Array.isArray(returnedConfig.products) ||
          Array.isArray(returnedConfig.categories) ||
          returnedConfig.heroTitle !== undefined)
      ) {
        setConfig(normalizeConfig(returnedConfig));
      }

      notify("Changes saved successfully.", "success");
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
      return notify("Enter a category name first.", "error");
    }

    const exists = config.categories.some(
      (category) => category.toLowerCase() === name.toLowerCase(),
    );

    if (exists) {
      return notify("This category already exists.", "error");
    }

    updateField("categories", [...config.categories, name]);
    setCategoryInput("");

    notify("Category added. Save your changes.", "success");
  }

  function deleteCategory(name) {
    const used = config.products.some((product) => product.category === name);

    const confirmed = window.confirm(
      used
        ? `This category is used by products. Delete "${name}" anyway?`
        : `Delete "${name}"?`,
    );

    if (!confirmed) return;

    setConfig((current) => ({
      ...current,
      categories: current.categories.filter((item) => item !== name),
      categoryDetails: current.categoryDetails.filter(
        (item) => item.name !== name,
      ),
    }));

    notify("Category removed. Save your changes.", "info");
  }

  function getCategoryDetail(name) {
    return (
      config.categoryDetails.find((item) => item.name === name) || {
        name,
        subtitle: "",
        image: "",
      }
    );
  }

  function updateCategoryDetail(name, key, value) {
    setConfig((current) => {
      const details = [...current.categoryDetails];
      const index = details.findIndex((item) => item.name === name);

      if (index === -1) {
        details.push({
          name,
          subtitle: "",
          image: "",
          [key]: value,
        });
      } else {
        details[index] = {
          ...details[index],
          [key]: value,
        };
      }

      return {
        ...current,
        categoryDetails: details,
      };
    });

    setMessage("");
  }

  // PRODUCTS

  function openAddProduct() {
    setEditingId(null);

    setProductForm({
      ...emptyProduct,
      category: config.categories[0] || "Makeup",
    });

    setShowProductForm(true);
  }

  function openEditProduct(product) {
    setEditingId(getItemId(product));

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
      return notify("Product name is required.", "error");
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
          (item) => getItemId(item) === editingId,
        );

        if (index !== -1) {
          products[index] = {
            ...products[index],
            ...product,
          };
        } else {
          products.push({
            ...product,
            id: createId("product"),
          });
        }
      } else {
        products.push({
          ...product,
          id: createId("product"),
        });
      }

      return {
        ...current,
        products,
      };
    });

    setShowProductForm(false);
    setEditingId(null);

    notify("Product updated. Click Save Changes.", "info");
  }

  function deleteProduct(product) {
    if (!window.confirm(`Delete "${product.name}"?`)) return;

    const id = getItemId(product);

    setConfig((current) => ({
      ...current,
      products: current.products.filter((item) => getItemId(item) !== id),
    }));

    notify("Product deleted. Click Save Changes.", "info");
  }

  // VIDEOS

  function openAddVideo() {
    setEditingVideoId(null);
    setVideoForm(emptyVideo);
    setShowVideoForm(true);
  }

  function openEditVideo(video) {
    setEditingVideoId(getItemId(video));

    setVideoForm({
      title: video.title ?? "",
      description: video.description ?? "",
      url: video.url ?? "",
    });

    setShowVideoForm(true);
  }

  function saveVideo(event) {
    event.preventDefault();

    if (!videoForm.title.trim()) {
      return notify("Video title is required.", "error");
    }

    if (!videoForm.url.trim()) {
      return notify("Video URL is required.", "error");
    }

    try {
      const url = new URL(videoForm.url.trim());

      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error();
      }
    } catch {
      return notify("Enter a valid video URL.", "error");
    }

    const video = {
      ...videoForm,
      title: videoForm.title.trim(),
      description: videoForm.description.trim(),
      url: videoForm.url.trim(),
    };

    setConfig((current) => {
      const videos = [...current.videos];

      if (editingVideoId !== null) {
        const index = videos.findIndex(
          (item) => getItemId(item) === editingVideoId,
        );

        if (index !== -1) {
          videos[index] = {
            ...videos[index],
            ...video,
          };
        } else {
          videos.push({
            ...video,
            id: createId("video"),
          });
        }
      } else {
        videos.push({
          ...video,
          id: createId("video"),
        });
      }

      return {
        ...current,
        videos,
      };
    });

    setShowVideoForm(false);
    setEditingVideoId(null);

    notify("Video updated. Click Save Changes.", "info");
  }

  function deleteVideo(video) {
    if (!window.confirm(`Delete video "${video.title}"?`)) return;

    const id = getItemId(video);

    setConfig((current) => ({
      ...current,
      videos: current.videos.filter((item) => getItemId(item) !== id),
    }));

    notify("Video deleted. Click Save Changes.", "info");
  }

  // COMMENTS

  function openAddComment() {
    setEditingCommentId(null);
    setCommentForm(emptyComment);
    setShowCommentForm(true);
  }

  function openEditComment(comment) {
    setEditingCommentId(getItemId(comment));

    setCommentForm({
      name: comment.name ?? "",
      message: comment.message ?? "",
      rating: Number(comment.rating ?? 5),
      approved: comment.approved !== false,
    });

    setShowCommentForm(true);
  }

  function saveComment(event) {
    event.preventDefault();

    if (!commentForm.name.trim() || !commentForm.message.trim()) {
      return notify("Customer name and comment are required.", "error");
    }

    const comment = {
      ...commentForm,
      name: commentForm.name.trim(),
      message: commentForm.message.trim(),
      rating: Number(commentForm.rating),
    };

    setConfig((current) => {
      const comments = [...current.comments];

      if (editingCommentId !== null) {
        const index = comments.findIndex(
          (item) => getItemId(item) === editingCommentId,
        );

        if (index !== -1) {
          comments[index] = {
            ...comments[index],
            ...comment,
          };
        } else {
          comments.push({
            ...comment,
            id: createId("comment"),
          });
        }
      } else {
        comments.push({
          ...comment,
          id: createId("comment"),
        });
      }

      return {
        ...current,
        comments,
      };
    });

    setShowCommentForm(false);
    setEditingCommentId(null);

    notify("Comment updated. Click Save Changes.", "info");
  }

  function deleteComment(comment) {
    if (!window.confirm(`Delete comment from "${comment.name}"?`)) return;

    const id = getItemId(comment);

    setConfig((current) => ({
      ...current,
      comments: current.comments.filter((item) => getItemId(item) !== id),
    }));

    notify("Comment deleted. Click Save Changes.", "info");
  }

  function toggleCommentApproval(comment) {
    const id = getItemId(comment);

    setConfig((current) => ({
      ...current,
      comments: current.comments.map((item) =>
        getItemId(item) === id
          ? {
              ...item,
              approved: item.approved === false,
            }
          : item,
      ),
    }));
  }

  function resetSettings() {
    const confirmed = window.confirm(
      "Restore all default settings and remove products, videos, and comments? Save Changes will store this reset.",
    );

    if (!confirmed) return;

    setConfig(normalizeConfig(initialConfig));

    setCategoryInput("");
    setShowProductForm(false);
    setShowVideoForm(false);
    setShowCommentForm(false);

    setEditingId(null);
    setEditingVideoId(null);
    setEditingCommentId(null);

    notify("Default settings loaded. Click Save Changes.", "info");
  }

  // PREVIEW

  function renderPreview() {
    const search = config.searchSection;
    const contact = config.contactSection;
    const commentsSection = config.commentsSection;
    const design = config.categoryDesign;

    return (
      <div className="min-h-screen bg-white text-slate-800">
        <div className="sticky top-0 z-30 flex items-center justify-between bg-slate-950 px-5 py-3 text-white">
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

        <header className="px-6 py-8 text-center">
          <h2 className="text-3xl font-bold">{config.pageTitle}</h2>
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
          <h2 className="text-3xl font-bold">{design.title}</h2>
          <p className="mt-2 text-slate-500">{design.description}</p>

          <div
            className={`mt-7 grid gap-5 ${
              design.columns === "2"
                ? "sm:grid-cols-2"
                : design.columns === "3"
                  ? "sm:grid-cols-2 lg:grid-cols-3"
                  : "sm:grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {config.categories.map((category, index) => {
              const detail = getCategoryDetail(category);

              return (
                <article
                  key={`${category}-${index}`}
                  className={`overflow-hidden border border-slate-200 bg-white ${
                    design.cardStyle === "square"
                      ? "rounded-none"
                      : design.cardStyle === "soft"
                        ? "rounded-xl"
                        : "rounded-2xl"
                  }`}
                >
                  {detail.image ? (
                    <img
                      src={detail.image}
                      alt={category}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-36 items-center justify-center bg-sky-50 text-sky-400">
                      <ImageIcon size={32} />
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="font-bold">{category}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {detail.subtitle}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {config.videos.length > 0 && (
          <section className="bg-slate-50 px-6 py-12">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-3xl font-bold">Beauty Videos</h2>

              <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {config.videos.map((video, index) => (
                  <article
                    key={getItemId(video) || index}
                    className="overflow-hidden rounded-2xl border bg-white"
                  >
                    <video
                      src={video.url}
                      controls
                      className="aspect-video w-full bg-black"
                    />

                    <div className="p-4">
                      <h3 className="font-bold">{video.title}</h3>
                      <p className="mt-2 text-sm text-slate-500">
                        {video.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {search.enabled && (
          <section className="mx-auto max-w-7xl px-6 py-12">
            <h2 className="text-3xl font-bold">{search.title}</h2>
            <p className="mt-2 text-slate-500">{search.description}</p>

            {search.showSearch && (
              <div className="mt-5 flex max-w-xl items-center gap-3 rounded-xl border p-3">
                <Search size={19} />
                <span className="text-sm text-slate-400">
                  Search products...
                </span>
              </div>
            )}

            {search.showCategoryFilters && (
              <div className="mt-5 flex flex-wrap gap-2">
                {config.categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full border px-4 py-2 text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}

            {search.showProductCount && (
              <p className="mt-5 text-sm text-slate-500">
                {config.products.length} products
              </p>
            )}

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {config.products.map((product, index) => (
                <article
                  key={getItemId(product) || index}
                  className="overflow-hidden rounded-2xl border p-3"
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

                  <p className="mt-3 text-xs uppercase text-sky-600">
                    {product.category}
                  </p>

                  <h3 className="mt-2 font-semibold">{product.name}</h3>

                  <p className="mt-2 font-bold">
                    {product.price || "Price on request"}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    {product.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        {commentsSection.enabled && (
          <section className="bg-slate-50 px-6 py-12">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-3xl font-bold">{commentsSection.title}</h2>

              <p className="mt-2 text-slate-500">
                {commentsSection.description}
              </p>

              <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {config.comments
                  .filter((comment) => comment.approved !== false)
                  .map((comment, index) => (
                    <article
                      key={getItemId(comment) || index}
                      className="rounded-2xl border bg-white p-5"
                    >
                      <div className="flex gap-1 text-amber-400">
                        {Array.from({
                          length: Math.min(
                            5,
                            Math.max(1, Number(comment.rating || 5)),
                          ),
                        }).map((_, i) => (
                          <Star key={i} size={16} fill="currentColor" />
                        ))}
                      </div>

                      <p className="mt-3 text-slate-600">{comment.message}</p>

                      <p className="mt-4 font-semibold">{comment.name}</p>
                    </article>
                  ))}
              </div>

              {commentsSection.showForm && (
                <p className="mt-6 text-sm text-slate-500">
                  Customer comment form is enabled on the public page.
                </p>
              )}
            </div>
          </section>
        )}

        {contact.enabled && (
          <section className="px-6 py-16 text-center">
            <h2 className="text-3xl font-bold">{contact.title}</h2>

            <p className="mx-auto mt-3 max-w-2xl text-slate-500">
              {contact.description}
            </p>

            <a
              href={contact.buttonLink}
              className="mt-6 inline-flex rounded-full bg-sky-500 px-7 py-3 font-semibold text-white"
            >
              {contact.buttonText}
            </a>
          </section>
        )}
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
      {/* SIDEBAR */}

      <aside className="bg-slate-950 p-5 text-white md:min-h-screen md:w-72 md:shrink-0">
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

          <p className="mt-3 text-2xl font-bold">{config.videos.length}</p>
          <p className="text-xs text-slate-400">Videos</p>

          <p className="mt-3 text-2xl font-bold">{config.comments.length}</p>
          <p className="text-xs text-slate-400">Comments</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}

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
                Manage all sections of your public Products page.
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

          {/* HERO */}

          {activeTab === "hero" && (
            <section className={`${cardClass} space-y-5`}>
              <div>
                <h3 className="text-lg font-bold">Product Hero Section</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Edit the main banner on the Products page.
                </p>
              </div>

              <Field
                label="Small heading"
                value={config.heroBadge}
                onChange={(value) => updateField("heroBadge", value)}
              />

              <Field
                label="Hero title"
                value={config.heroTitle}
                onChange={(value) => updateField("heroTitle", value)}
                multiline
              />

              <Field
                label="Hero description"
                value={config.heroDescription}
                onChange={(value) => updateField("heroDescription", value)}
                multiline
              />

              <Field
                label="Button text"
                value={config.heroButton}
                onChange={(value) => updateField("heroButton", value)}
              />

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
            </section>
          )}

          {/* PAGE CONTENT */}

          {activeTab === "content" && (
            <section className={`${cardClass} space-y-5`}>
              <h3 className="text-lg font-bold">Page Content</h3>

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

          {/* CATEGORIES */}

          {activeTab === "categories" && (
            <section className="space-y-5">
              <div>
                <h3 className="text-lg font-bold">Manage Categories</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Add and remove product categories.
                </p>
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
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-sky-400"
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

              {config.categories.map((category, index) => (
                <article
                  key={category}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-sky-100 p-3 text-sky-700">
                      <ImageIcon size={20} />
                    </div>

                    <div>
                      <p className="font-semibold">{category}</p>
                      <p className="text-xs text-slate-500">
                        Category {index + 1}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteCategory(category)}
                    className="rounded-xl p-2.5 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </article>
              ))}

              {config.categories.length === 0 && (
                <p className="rounded-xl bg-white p-6 text-center text-slate-500">
                  No categories yet.
                </p>
              )}
            </section>
          )}

          {/* PRODUCTS */}

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
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">
                      {editingId === null ? "Add Product" : "Edit Product"}
                    </h3>

                    <button
                      type="button"
                      onClick={() => setShowProductForm(false)}
                      className="rounded-lg p-2 hover:bg-slate-100"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="Product name"
                      value={productForm.name}
                      onChange={(value) =>
                        setProductForm((old) => ({
                          ...old,
                          name: value,
                        }))
                      }
                    />

                    <Field
                      label="Product code"
                      value={productForm.code}
                      onChange={(value) =>
                        setProductForm((old) => ({
                          ...old,
                          code: value,
                        }))
                      }
                    />

                    <Field
                      label="Price"
                      value={productForm.price}
                      onChange={(value) =>
                        setProductForm((old) => ({
                          ...old,
                          price: value,
                        }))
                      }
                    />

                    <Field
                      label="Badge"
                      value={productForm.badge}
                      onChange={(value) =>
                        setProductForm((old) => ({
                          ...old,
                          badge: value,
                        }))
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"
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
                      setProductForm((old) => ({
                        ...old,
                        image: value,
                      }))
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

              {config.products.map((product, index) => (
                <article
                  key={getItemId(product) || index}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-24 w-24 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-slate-100">
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

                    <p className="mt-1 text-sm text-slate-500">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditProduct(product)}
                      className="rounded-xl border border-slate-200 p-2.5"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteProduct(product)}
                      className="rounded-xl border border-red-100 p-2.5 text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </article>
              ))}

              {config.products.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                  <ShoppingBag size={30} className="mx-auto mb-3" />
                  No products yet. Click Add Product.
                </div>
              )}
            </section>
          )}

          {/* COLORS AND DESIGN */}

          {activeTab === "design" && (
            <section className={`${cardClass} space-y-5`}>
              <h3 className="text-lg font-bold">Colors & Design</h3>

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
                  className="h-11 w-14 cursor-pointer"
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

          {/* VIDEOS */}

          {activeTab === "videos" && (
            <section className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">Beauty Videos</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Add tutorials, beauty tips, and product videos.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openAddVideo}
                  className={buttonClass}
                >
                  <Plus size={17} />
                  Add Video
                </button>
              </div>

              {showVideoForm && (
                <form
                  onSubmit={saveVideo}
                  className={`${cardClass} space-y-5 border-sky-200`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold">
                      {editingVideoId === null ? "Add Video" : "Edit Video"}
                    </h3>

                    <button
                      type="button"
                      onClick={() => setShowVideoForm(false)}
                      className="rounded-lg p-2 hover:bg-slate-100"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <Field
                    label="Video title"
                    value={videoForm.title}
                    onChange={(value) =>
                      setVideoForm((old) => ({
                        ...old,
                        title: value,
                      }))
                    }
                  />

                  <Field
                    label="Video description"
                    value={videoForm.description}
                    onChange={(value) =>
                      setVideoForm((old) => ({
                        ...old,
                        description: value,
                      }))
                    }
                    multiline
                  />

                  <Field
                    label="Video URL"
                    value={videoForm.url}
                    onChange={(value) =>
                      setVideoForm((old) => ({
                        ...old,
                        url: value,
                      }))
                    }
                    placeholder="https://example.com/video.mp4"
                  />

                  {videoForm.url && (
                    <video
                      src={videoForm.url}
                      controls
                      className="aspect-video w-full rounded-xl bg-black"
                    />
                  )}

                  <button type="submit" className={buttonClass}>
                    <Check size={17} />
                    Save Video
                  </button>
                </form>
              )}

              {config.videos.map((video, index) => (
                <article
                  key={getItemId(video) || index}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row"
                >
                  <video
                    src={video.url}
                    controls
                    className="aspect-video w-full rounded-xl bg-black md:w-56"
                  />

                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold">{video.title}</h4>

                    <p className="mt-2 text-sm text-slate-500">
                      {video.description}
                    </p>

                    <a
                      href={video.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-sm text-sky-600"
                    >
                      Open video <ExternalLink size={14} />
                    </a>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditVideo(video)}
                        className={secondaryButtonClass}
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteVideo(video)}
                        className="rounded-xl border border-red-100 px-4 py-3 text-sm font-semibold text-red-600"
                      >
                        <Trash2 size={16} className="mr-2 inline" />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {config.videos.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                  <Video size={30} className="mx-auto mb-3" />
                  No videos yet. Add your first video.
                </div>
              )}
            </section>
          )}

          {/* COMMENTS */}

          {activeTab === "comments" && (
            <section className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">Customer Comments</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Manage feedback, ratings, and comment visibility.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openAddComment}
                  className={buttonClass}
                >
                  <Plus size={17} />
                  Add Comment
                </button>
              </div>

              <div className={`${cardClass} space-y-5`}>
                <Field
                  label="Section title"
                  value={config.commentsSection.title}
                  onChange={(value) =>
                    updateNested("commentsSection", "title", value)
                  }
                />

                <Field
                  label="Section description"
                  value={config.commentsSection.description}
                  onChange={(value) =>
                    updateNested("commentsSection", "description", value)
                  }
                  multiline
                />

                <Toggle
                  label="Show customer comments section"
                  checked={config.commentsSection.enabled}
                  onChange={(value) =>
                    updateNested("commentsSection", "enabled", value)
                  }
                />

                <Toggle
                  label="Show customer comment form"
                  checked={config.commentsSection.showForm}
                  onChange={(value) =>
                    updateNested("commentsSection", "showForm", value)
                  }
                />
              </div>

              {showCommentForm && (
                <form
                  onSubmit={saveComment}
                  className={`${cardClass} space-y-5 border-sky-200`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold">
                      {editingCommentId === null
                        ? "Add Customer Comment"
                        : "Edit Customer Comment"}
                    </h3>

                    <button
                      type="button"
                      onClick={() => setShowCommentForm(false)}
                      className="rounded-lg p-2 hover:bg-slate-100"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <Field
                    label="Customer name"
                    value={commentForm.name}
                    onChange={(value) =>
                      setCommentForm((old) => ({
                        ...old,
                        name: value,
                      }))
                    }
                  />

                  <Field
                    label="Comment"
                    value={commentForm.message}
                    onChange={(value) =>
                      setCommentForm((old) => ({
                        ...old,
                        message: value,
                      }))
                    }
                    multiline
                  />

                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-600">
                      Rating
                    </span>

                    <select
                      value={commentForm.rating}
                      onChange={(event) =>
                        setCommentForm((old) => ({
                          ...old,
                          rating: Number(event.target.value),
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3"
                    >
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating} stars
                        </option>
                      ))}
                    </select>
                  </label>

                  <Toggle
                    label="Approved and visible"
                    checked={commentForm.approved}
                    onChange={(value) =>
                      setCommentForm((old) => ({
                        ...old,
                        approved: value,
                      }))
                    }
                  />

                  <button type="submit" className={buttonClass}>
                    <Check size={17} />
                    Save Comment
                  </button>
                </form>
              )}

              {config.comments.map((comment, index) => (
                <article
                  key={getItemId(comment) || index}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold">{comment.name}</h4>

                      <div className="mt-2 flex gap-1 text-amber-400">
                        {Array.from({
                          length: Math.min(
                            5,
                            Math.max(1, Number(comment.rating || 5)),
                          ),
                        }).map((_, i) => (
                          <Star key={i} size={15} fill="currentColor" />
                        ))}
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        comment.approved === false
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {comment.approved === false ? "Hidden" : "Approved"}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {comment.message}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openEditComment(comment)}
                      className={secondaryButtonClass}
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleCommentApproval(comment)}
                      className={secondaryButtonClass}
                    >
                      {comment.approved === false ? (
                        <Eye size={16} />
                      ) : (
                        <EyeOff size={16} />
                      )}

                      {comment.approved === false ? "Approve" : "Hide"}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteComment(comment)}
                      className="rounded-xl border border-red-100 px-4 py-3 text-sm font-semibold text-red-600"
                    >
                      <Trash2 size={16} className="mr-2 inline" />
                      Delete
                    </button>
                  </div>
                </article>
              ))}

              {config.comments.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                  <MessageSquare size={30} className="mx-auto mb-3" />
                  No customer comments yet.
                </div>
              )}
            </section>
          )}

          {/* SEARCH AND FILTERS */}

          {activeTab === "search" && (
            <section className={`${cardClass} space-y-5`}>
              <div>
                <h3 className="text-lg font-bold">Search & Filters</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Control which search and filter elements appear on your
                  Products page.
                </p>
              </div>

              <Toggle
                label="Enable search and filters section"
                checked={config.searchSection.enabled}
                onChange={(value) =>
                  updateNested("searchSection", "enabled", value)
                }
              />

              <Field
                label="Section title"
                value={config.searchSection.title}
                onChange={(value) =>
                  updateNested("searchSection", "title", value)
                }
              />

              <Field
                label="Section description"
                value={config.searchSection.description}
                onChange={(value) =>
                  updateNested("searchSection", "description", value)
                }
                multiline
              />

              <Toggle
                label="Show search input"
                checked={config.searchSection.showSearch}
                onChange={(value) =>
                  updateNested("searchSection", "showSearch", value)
                }
              />

              <Toggle
                label="Show category filters"
                checked={config.searchSection.showCategoryFilters}
                onChange={(value) =>
                  updateNested("searchSection", "showCategoryFilters", value)
                }
              />

              <Toggle
                label="Show favorites filter"
                checked={config.searchSection.showFavorites}
                onChange={(value) =>
                  updateNested("searchSection", "showFavorites", value)
                }
              />

              <Toggle
                label="Show product count"
                checked={config.searchSection.showProductCount}
                onChange={(value) =>
                  updateNested("searchSection", "showProductCount", value)
                }
              />

              <div className="rounded-xl bg-sky-50 p-4 text-sm text-sky-800">
                These settings control visibility. Your public Products
                component must read these values from the API to apply them.
              </div>
            </section>
          )}

          {/* CONTACT */}

          {activeTab === "contact" && (
            <section className={`${cardClass} space-y-5`}>
              <div>
                <h3 className="text-lg font-bold">Contact Section</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Customize the contact area at the bottom of your Products
                  page.
                </p>
              </div>

              <Toggle
                label="Show contact section"
                checked={config.contactSection.enabled}
                onChange={(value) =>
                  updateNested("contactSection", "enabled", value)
                }
              />

              <Field
                label="Contact title"
                value={config.contactSection.title}
                onChange={(value) =>
                  updateNested("contactSection", "title", value)
                }
              />

              <Field
                label="Contact description"
                value={config.contactSection.description}
                onChange={(value) =>
                  updateNested("contactSection", "description", value)
                }
                multiline
              />

              <Field
                label="Button text"
                value={config.contactSection.buttonText}
                onChange={(value) =>
                  updateNested("contactSection", "buttonText", value)
                }
              />

              <Field
                label="Button link"
                value={config.contactSection.buttonLink}
                onChange={(value) =>
                  updateNested("contactSection", "buttonLink", value)
                }
                placeholder="/connect"
              />

              <div className="rounded-2xl bg-sky-50 p-6 text-center">
                <h3 className="text-2xl font-bold">
                  {config.contactSection.title}
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  {config.contactSection.description}
                </p>

                <span className="mt-4 inline-flex rounded-full bg-sky-500 px-6 py-3 font-semibold text-white">
                  {config.contactSection.buttonText}
                </span>
              </div>
            </section>
          )}

          {/* CATEGORY DESIGN */}

          {activeTab === "categoryDesign" && (
            <section className="space-y-5">
              <div>
                <h3 className="text-lg font-bold">Category Design</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Customize category titles, descriptions, images, and card
                  layout.
                </p>
              </div>

              <div className={`${cardClass} space-y-5`}>
                <Field
                  label="Category section title"
                  value={config.categoryDesign.title}
                  onChange={(value) =>
                    updateNested("categoryDesign", "title", value)
                  }
                />

                <Field
                  label="Category section description"
                  value={config.categoryDesign.description}
                  onChange={(value) =>
                    updateNested("categoryDesign", "description", value)
                  }
                  multiline
                />

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-600">
                    Number of columns
                  </span>

                  <select
                    value={config.categoryDesign.columns}
                    onChange={(event) =>
                      updateNested(
                        "categoryDesign",
                        "columns",
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3"
                  >
                    <option value="2">2 columns</option>
                    <option value="3">3 columns</option>
                    <option value="4">4 columns</option>
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-600">
                    Card style
                  </span>

                  <select
                    value={config.categoryDesign.cardStyle}
                    onChange={(event) =>
                      updateNested(
                        "categoryDesign",
                        "cardStyle",
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3"
                  >
                    <option value="rounded">Rounded</option>
                    <option value="soft">Soft corners</option>
                    <option value="square">Square</option>
                  </select>
                </label>
              </div>

              <div className="space-y-4">
                {config.categories.map((category) => {
                  const detail = getCategoryDetail(category);

                  return (
                    <article
                      key={category}
                      className={`${cardClass} space-y-4`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-sky-100 p-3 text-sky-700">
                          <LayoutGrid size={20} />
                        </div>

                        <div>
                          <h4 className="font-bold">{category}</h4>
                          <p className="text-xs text-slate-500">
                            Category appearance
                          </p>
                        </div>
                      </div>

                      <Field
                        label="Category subtitle"
                        value={detail.subtitle}
                        onChange={(value) =>
                          updateCategoryDetail(category, "subtitle", value)
                        }
                        placeholder="Example: Discover our skincare collection"
                      />

                      <ImagePicker
                        label={`${category} image`}
                        value={detail.image}
                        onChange={(value) =>
                          updateCategoryDetail(category, "image", value)
                        }
                      />
                    </article>
                  );
                })}
              </div>

              {config.categories.length === 0 && (
                <div className="rounded-xl bg-white p-6 text-center text-slate-500">
                  Add categories first to customize their design.
                </div>
              )}
            </section>
          )}

          {/* BOTTOM ACTIONS */}

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
            Settings are sent to your existing productsection API. Your backend
            schema must support videos, comments, categoryDetails,
            searchSection, contactSection, commentsSection, and categoryDesign
            for them to be stored permanently. Your public Products page must
            also read these fields to display the changes.
          </p>
        </div>
      </main>
    </div>
  );
}
