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
  ExternalLink,
  EyeOff,
} from "lucide-react";

const API_URL = "https://zharaallcode.onrender.com/api/productsection";

const CLOUDINARY_CLOUD_NAME = "YOUR_CLOUD_NAME";
const CLOUDINARY_UPLOAD_PRESET = "YOUR_UPLOAD_PRESET";
const CLOUDINARY_VIDEO_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`;

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
    badge: "Find Your Favorites",
    title: "Our Beauty Collection",
    description: "Search by product name, code, or category.",
    placeholder: "Search products, codes, categories...",
    showCategoryFilters: true,
    showFavorites: true,
    showResultCount: true,
    showClearButton: true,
  },

  contactSection: {
    enabled: true,
    title: "Need Help Choosing?",
    description:
      "Contact us for product information and personalized beauty recommendations.",
    buttonText: "Contact Us",
    buttonLink: "/connect",
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
];

function normalizeConfig(data) {
  let source = data?.data ?? data?.content ?? data?.config ?? data;

  if (source?.data && typeof source.data === "object") {
    source = source.data;
  }

  if (!source || typeof source !== "object" || Array.isArray(source)) {
    source = {};
  }

  return {
    ...initialConfig,
    ...source,

    categories: Array.isArray(source.categories)
      ? source.categories.filter((item) => typeof item === "string")
      : [...DEFAULT_CATEGORIES],

    products: Array.isArray(source.products) ? source.products : [],

    videos: Array.isArray(source.videos)
      ? source.videos.filter(
          (video) =>
            video &&
            typeof video === "object" &&
            typeof video.url === "string" &&
            video.url.trim() !== "",
        )
      : [],

    comments: Array.isArray(source.comments) ? source.comments : [],

    categoryDetails: Array.isArray(source.categoryDetails)
      ? source.categoryDetails
      : [],

    searchSection: {
      ...initialConfig.searchSection,
      ...(source.searchSection || {}),
      enabled: source.searchSection?.enabled ?? true,
      badge:
        typeof source.searchSection?.badge === "string"
          ? source.searchSection.badge
          : initialConfig.searchSection.badge,
      title:
        typeof source.searchSection?.title === "string"
          ? source.searchSection.title
          : initialConfig.searchSection.title,
      description:
        typeof source.searchSection?.description === "string"
          ? source.searchSection.description
          : initialConfig.searchSection.description,
      placeholder:
        typeof source.searchSection?.placeholder === "string"
          ? source.searchSection.placeholder
          : initialConfig.searchSection.placeholder,
      showCategoryFilters: source.searchSection?.showCategoryFilters ?? true,
      showFavorites: source.searchSection?.showFavorites ?? true,
      showResultCount: source.searchSection?.showResultCount ?? true,
      showClearButton: source.searchSection?.showClearButton ?? true,
    },

    contactSection: {
      ...initialConfig.contactSection,
      ...(source.contactSection || {}),
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

  const [videoFiles, setVideoFiles] = useState([]);
  const [videoUploading, setVideoUploading] = useState(false);

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

        const loadedConfig = normalizeConfig(data);

        setConfig(loadedConfig);

        console.log("Loaded videos:", loadedConfig.videos);
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

  async function saveConfigToServer(nextConfig) {
    const payload = {
      ...nextConfig,
      videos: Array.isArray(nextConfig.videos)
        ? nextConfig.videos
            .filter(
              (video) =>
                video &&
                typeof video.url === "string" &&
                video.url.trim() !== "",
            )
            .map((video) => ({
              id: video.id || "",
              title: video.title || "",
              description: video.description || "",
              url: video.url.trim(),
              publicId: video.publicId || "",
            }))
        : [],
      products: Array.isArray(nextConfig.products) ? nextConfig.products : [],
      categories: Array.isArray(nextConfig.categories)
        ? nextConfig.categories
        : [],
      comments: Array.isArray(nextConfig.comments) ? nextConfig.comments : [],
      categoryDetails: Array.isArray(nextConfig.categoryDetails)
        ? nextConfig.categoryDetails
        : [],
    };

    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(payload),
    });

    const data = await readResponse(response);

    if (!response.ok) {
      throw new Error(
        data?.message || data?.error || `Save failed: ${response.status}`,
      );
    }

    const verifyResponse = await fetch(API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const verifyData = await readResponse(verifyResponse);

    if (!verifyResponse.ok) {
      throw new Error("Could not verify saved settings.");
    }

    const verifiedConfig = normalizeConfig(verifyData);

    const savedUrls = new Set(
      verifiedConfig.videos.map((video) => video.url?.trim()).filter(Boolean),
    );

    const missingVideos = payload.videos.filter(
      (video) => !savedUrls.has(video.url),
    );

    if (missingVideos.length > 0) {
      throw new Error(
        `${missingVideos.length} video(s) could not be verified after saving. Please check the backend.`,
      );
    }

    return verifiedConfig;
  }

  async function save() {
    if (saving || videoUploading) return;

    try {
      setSaving(true);
      setMessage("");

      const verifiedConfig = await saveConfigToServer(config);

      setConfig(verifiedConfig);

      notify("Changes saved and verified successfully.", "success");
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

  function openAddVideo() {
    setEditingVideoId(null);
    setVideoForm(emptyVideo);
    setVideoFiles([]);
    setShowVideoForm(true);
  }

  function openEditVideo(video) {
    setEditingVideoId(getItemId(video));

    setVideoForm({
      title: video.title ?? "",
      description: video.description ?? "",
      url: video.url ?? "",
    });

    setVideoFiles([]);
    setShowVideoForm(true);
  }

  async function uploadVideoToCloudinary(file) {
    if (
      CLOUDINARY_CLOUD_NAME === "YOUR_CLOUD_NAME" ||
      CLOUDINARY_UPLOAD_PRESET === "YOUR_UPLOAD_PRESET"
    ) {
      throw new Error(
        "Please enter your real Cloudinary Cloud Name and Upload Preset.",
      );
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_VIDEO_URL, {
      method: "POST",
      body: formData,
    });

    const data = await readResponse(response);

    if (!response.ok) {
      throw new Error(data.error?.message || "Video upload failed.");
    }

    if (!data.secure_url) {
      throw new Error("Cloudinary did not return a video URL.");
    }

    return {
      url: data.secure_url,
      publicId: data.public_id || "",
    };
  }

  async function saveVideo(event) {
    event.preventDefault();

    if (videoUploading || saving) return;

    if (!videoForm.title.trim() && videoFiles.length === 0) {
      return notify("Video title is required.", "error");
    }

    if (!videoForm.url.trim() && videoFiles.length === 0) {
      return notify("Select a video from your device or enter a URL.", "error");
    }

    try {
      setVideoUploading(true);
      setMessage("");

      let newVideos = [];

      if (videoFiles.length > 0) {
        for (let index = 0; index < videoFiles.length; index++) {
          const file = videoFiles[index];

          if (!file.type.startsWith("video/")) {
            throw new Error(`${file.name} is not a video file.`);
          }

          const uploaded = await uploadVideoToCloudinary(file);
          const defaultTitle = file.name.replace(/\.[^/.]+$/, "");

          newVideos.push({
            id: createId("video"),
            title:
              videoFiles.length > 1
                ? `${videoForm.title.trim() || defaultTitle} ${index + 1}`
                : videoForm.title.trim() || defaultTitle,
            description: videoForm.description.trim(),
            url: uploaded.url,
            publicId: uploaded.publicId,
            originalFileName: file.name,
          });
        }
      } else {
        let url;

        try {
          const parsedUrl = new URL(videoForm.url.trim());

          if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            throw new Error();
          }

          url = parsedUrl.href;
        } catch {
          throw new Error("Enter a valid video URL.");
        }

        newVideos.push({
          id: editingVideoId || createId("video"),
          title: videoForm.title.trim(),
          description: videoForm.description.trim(),
          url,
        });
      }

      const currentVideos = [...config.videos];

      if (editingVideoId !== null && videoFiles.length === 0) {
        const index = currentVideos.findIndex(
          (item) => getItemId(item) === editingVideoId,
        );

        if (index !== -1) {
          currentVideos[index] = {
            ...currentVideos[index],
            ...newVideos[0],
            id: currentVideos[index].id || editingVideoId,
          };
        } else {
          currentVideos.push(newVideos[0]);
        }
      } else {
        currentVideos.push(...newVideos);
      }

      const nextConfig = {
        ...config,
        videos: currentVideos,
      };

      setSaving(true);

      const verifiedConfig = await saveConfigToServer(nextConfig);

      setConfig(verifiedConfig);

      setShowVideoForm(false);
      setEditingVideoId(null);
      setVideoFiles([]);
      setVideoForm(emptyVideo);

      notify(
        `${newVideos.length} video(s) uploaded and saved successfully.`,
        "success",
      );
    } catch (error) {
      console.error("Video upload error:", error);

      notify(error.message || "Could not upload and save videos.", "error");
    } finally {
      setVideoUploading(false);
      setSaving(false);
    }
  }

  function deleteVideo(video) {
    if (!window.confirm(`Delete video "${video.title}"?`)) return;

    const id = getItemId(video);

    setConfig((current) => ({
      ...current,
      videos: current.videos.filter((item) => getItemId(item) !== id),
    }));

    notify(
      "Video removed from the list. Click Save Changes to update the website.",
      "info",
    );
  }

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
    setVideoFiles([]);

    notify("Default settings loaded. Click Save Changes.", "info");
  }
  function renderPreview() {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white px-6 py-5">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {config.pageTitle}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {config.pageDescription}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPreview(false)}
              className={buttonClass}
            >
              <X size={17} />
              Close Preview
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl space-y-12 px-5 py-10">
          <section
            className="grid items-center gap-8 overflow-hidden rounded-3xl p-8 md:grid-cols-2 md:p-12"
            style={{ backgroundColor: config.heroColor }}
          >
            <div>
              <span className="inline-block rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700">
                {config.heroBadge}
              </span>

              <h2 className="mt-5 text-4xl font-bold leading-tight text-slate-800 md:text-5xl">
                {config.heroTitle}
              </h2>

              <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
                {config.heroDescription}
              </p>

              <a
                href="/products"
                className="mt-7 inline-flex rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white"
              >
                {config.heroButton}
              </a>
            </div>

            {config.heroImage && (
              <img
                src={config.heroImage}
                alt="Beauty"
                className="h-80 w-full rounded-2xl object-cover"
              />
            )}
          </section>

          <section>
            <h2 className="text-3xl font-bold text-slate-800">
              Shop by Category
            </h2>

            <p className="mt-2 text-slate-500">
              Explore our beauty collections.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {config.categories.map((category) => {
                const detail = getCategoryDetail(category);

                return (
                  <div
                    key={category}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    {detail.image ? (
                      <img
                        src={detail.image}
                        alt={category}
                        className="h-40 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-40 items-center justify-center bg-sky-50">
                        <ShoppingBag size={35} className="text-sky-400" />
                      </div>
                    )}

                    <div className="p-4">
                      <h3 className="font-bold text-slate-800">{category}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {detail.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-slate-800">
              {config.searchSection.title}
            </h2>

            <p className="mt-2 text-slate-500">
              {config.searchSection.description}
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {config.products.map((product) => (
                <article
                  key={getItemId(product)}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-56 w-full object-cover"
                    />
                  )}

                  <div className="p-5">
                    {product.badge && (
                      <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                        {product.badge}
                      </span>
                    )}

                    <h3 className="mt-3 text-lg font-bold text-slate-800">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      {product.description}
                    </p>

                    <p className="mt-4 font-bold text-slate-800">
                      {product.price}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {config.videos.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-slate-800">
                Beauty Videos
              </h2>

              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {config.videos.map((video) => (
                  <article
                    key={getItemId(video)}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    <video
                      src={video.url}
                      controls
                      playsInline
                      className="aspect-video w-full bg-black object-contain"
                    />

                    <div className="p-4">
                      <h3 className="font-bold text-slate-800">
                        {video.title}
                      </h3>

                      <p className="mt-2 text-sm text-slate-500">
                        {video.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-3xl font-bold text-slate-800">
              Community Feedback
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {config.comments
                .filter((comment) => comment.approved !== false)
                .map((comment) => (
                  <article
                    key={getItemId(comment)}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {comment.message}
                    </p>

                    <p className="mt-4 font-bold text-slate-800">
                      {comment.name}
                    </p>
                  </article>
                ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (preview) {
    return renderPreview();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <LoaderCircle
            size={42}
            className="mx-auto animate-spin text-sky-500"
          />
          <p className="mt-4 font-medium text-slate-600">
            Loading Product Management...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-r border-slate-200 bg-white lg:w-72">
          <div className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                <ShoppingBag size={25} />
              </div>

              <div>
                <h1 className="text-xl font-bold">Product Manager</h1>
                <p className="text-xs text-slate-500">
                  LEDORA Website Management
                </p>
              </div>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto p-4 lg:flex-col">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                    active
                      ? "bg-sky-500 text-white shadow-md shadow-sky-100"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="hidden border-t border-slate-200 p-5 lg:block">
            <div className="rounded-2xl bg-sky-50 p-4">
              <p className="text-sm font-bold text-sky-800">
                Website Management
              </p>

              <p className="mt-2 text-xs leading-5 text-sky-700">
                Manage your Products page, categories, videos, and customer
                content.
              </p>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {tabs.find((tab) => tab.id === activeTab)?.label}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Manage your public Products page
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
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
                  onClick={resetSettings}
                  disabled={saving || videoUploading}
                  className={secondaryButtonClass}
                >
                  <RotateCcw size={17} />
                  Reset
                </button>

                <button
                  type="button"
                  onClick={save}
                  disabled={saving || videoUploading}
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
            </div>

            {message && (
              <div
                className={`mt-4 rounded-xl border px-4 py-3 text-sm ${messageClass}`}
              >
                {message}
              </div>
            )}
          </header>

          <div className="mx-auto max-w-6xl space-y-6 p-5 md:p-8">
            {activeTab === "hero" && (
              <section className={cardClass}>
                <div className="mb-6">
                  <h3 className="text-xl font-bold">Hero Section</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Edit the main banner displayed on the Products page.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Field
                    label="Hero Badge"
                    value={config.heroBadge}
                    onChange={(value) => updateField("heroBadge", value)}
                  />

                  <Field
                    label="Hero Button"
                    value={config.heroButton}
                    onChange={(value) => updateField("heroButton", value)}
                  />

                  <div className="md:col-span-2">
                    <Field
                      label="Hero Title"
                      value={config.heroTitle}
                      onChange={(value) => updateField("heroTitle", value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Field
                      label="Hero Description"
                      value={config.heroDescription}
                      onChange={(value) =>
                        updateField("heroDescription", value)
                      }
                      multiline
                    />
                  </div>

                  <ImagePicker
                    label="Hero Image"
                    value={config.heroImage}
                    onChange={(value) => updateField("heroImage", value)}
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-600">
                      Hero Background Color
                    </label>

                    <div className="mt-3 flex items-center gap-3">
                      <input
                        type="color"
                        value={config.heroColor || "#e0f2fe"}
                        onChange={(event) =>
                          updateField("heroColor", event.target.value)
                        }
                        className="h-14 w-20 cursor-pointer rounded-lg border-0"
                      />

                      <span className="text-sm text-slate-500">
                        {config.heroColor}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "content" && (
              <section className={cardClass}>
                <h3 className="text-xl font-bold">Page Content</h3>

                <p className="mt-1 text-sm text-slate-500">
                  Edit the main heading and description.
                </p>

                <div className="mt-6 space-y-5">
                  <Field
                    label="Page Title"
                    value={config.pageTitle}
                    onChange={(value) => updateField("pageTitle", value)}
                  />

                  <Field
                    label="Page Description"
                    value={config.pageDescription}
                    onChange={(value) => updateField("pageDescription", value)}
                    multiline
                  />
                </div>
              </section>
            )}

            {activeTab === "categories" && (
              <section className={cardClass}>
                <h3 className="text-xl font-bold">Categories Management</h3>

                <p className="mt-1 text-sm text-slate-500">
                  Add, edit images, and remove product categories.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <input
                    value={categoryInput}
                    onChange={(event) => setCategoryInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") addCategory();
                    }}
                    placeholder="Enter new category"
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
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

                <div className="mt-7 space-y-5">
                  {config.categories.map((category) => {
                    const detail = getCategoryDetail(category);

                    return (
                      <div
                        key={category}
                        className="grid gap-5 rounded-2xl border border-slate-200 p-5 md:grid-cols-2"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-3">
                            <h4 className="font-bold">{category}</h4>

                            <button
                              type="button"
                              onClick={() => deleteCategory(category)}
                              className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <div className="mt-4">
                            <Field
                              label="Category Subtitle"
                              value={detail.subtitle}
                              onChange={(value) =>
                                updateCategoryDetail(
                                  category,
                                  "subtitle",
                                  value,
                                )
                              }
                            />
                          </div>
                        </div>

                        <ImagePicker
                          label={`${category} Image`}
                          value={detail.image}
                          onChange={(value) =>
                            updateCategoryDetail(category, "image", value)
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {activeTab === "products" && (
              <section className={cardClass}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">Products</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Manage products displayed on your website.
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
                    className="mt-7 space-y-5 rounded-2xl border border-sky-200 bg-sky-50/50 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold">
                        {editingId !== null ? "Edit Product" : "New Product"}
                      </h4>

                      <button
                        type="button"
                        onClick={() => setShowProductForm(false)}
                        className="rounded-lg p-2 hover:bg-white"
                      >
                        <X size={19} />
                      </button>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <Field
                        label="Product Name"
                        value={productForm.name}
                        onChange={(value) =>
                          setProductForm((current) => ({
                            ...current,
                            name: value,
                          }))
                        }
                      />

                      <Field
                        label="Product Code"
                        value={productForm.code}
                        onChange={(value) =>
                          setProductForm((current) => ({
                            ...current,
                            code: value,
                          }))
                        }
                      />

                      <label className="block space-y-2">
                        <span className="text-sm font-medium text-slate-600">
                          Category
                        </span>

                        <select
                          value={productForm.category}
                          onChange={(event) =>
                            setProductForm((current) => ({
                              ...current,
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
                        </select>
                      </label>

                      <Field
                        label="Price"
                        value={productForm.price}
                        onChange={(value) =>
                          setProductForm((current) => ({
                            ...current,
                            price: value,
                          }))
                        }
                      />

                      <Field
                        label="Product Badge"
                        value={productForm.badge}
                        onChange={(value) =>
                          setProductForm((current) => ({
                            ...current,
                            badge: value,
                          }))
                        }
                      />

                      <div className="md:col-span-2">
                        <Field
                          label="Product Description"
                          value={productForm.description}
                          onChange={(value) =>
                            setProductForm((current) => ({
                              ...current,
                              description: value,
                            }))
                          }
                          multiline
                        />
                      </div>

                      <div className="md:col-span-2">
                        <ImagePicker
                          label="Product Image"
                          value={productForm.image}
                          onChange={(value) =>
                            setProductForm((current) => ({
                              ...current,
                              image: value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
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

                <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {config.products.map((product) => (
                    <article
                      key={getItemId(product)}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-48 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-48 items-center justify-center bg-slate-100">
                          <ImageIcon size={35} className="text-slate-400" />
                        </div>
                      )}

                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="font-bold">{product.name}</h4>
                            <p className="mt-1 text-xs text-slate-500">
                              {product.category}
                            </p>
                          </div>

                          <span className="text-sm font-bold text-sky-600">
                            {product.price}
                          </span>
                        </div>

                        <p className="mt-3 line-clamp-2 text-sm text-slate-500">
                          {product.description}
                        </p>

                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEditProduct(product)}
                            className={`${secondaryButtonClass} flex-1`}
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteProduct(product)}
                            className="rounded-xl border border-red-200 px-4 py-3 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {config.products.length === 0 && (
                  <div className="mt-7 rounded-2xl bg-slate-50 p-10 text-center">
                    <ShoppingBag size={35} className="mx-auto text-slate-400" />
                    <p className="mt-3 font-semibold text-slate-600">
                      No products yet.
                    </p>
                  </div>
                )}
              </section>
            )}

            {activeTab === "design" && (
              <section className={cardClass}>
                <h3 className="text-xl font-bold">Colors & Design</h3>

                <p className="mt-1 text-sm text-slate-500">
                  Customize the visual appearance of the Products page.
                </p>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-600">
                      Hero Background Color
                    </label>

                    <input
                      type="color"
                      value={config.heroColor || "#e0f2fe"}
                      onChange={(event) =>
                        updateField("heroColor", event.target.value)
                      }
                      className="mt-3 h-16 w-full cursor-pointer rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600">
                      Current Color
                    </label>

                    <div
                      className="mt-3 flex h-16 items-center justify-center rounded-xl border border-slate-200 font-semibold"
                      style={{
                        backgroundColor: config.heroColor || "#e0f2fe",
                      }}
                    >
                      {config.heroColor}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "videos" && (
              <section className={cardClass}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">Beauty Videos</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Upload videos to Cloudinary and save them to your website
                      database.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openAddVideo}
                    disabled={videoUploading || saving}
                    className={buttonClass}
                  >
                    <Plus size={17} />
                    Add Video
                  </button>
                </div>

                {showVideoForm && (
                  <form
                    onSubmit={saveVideo}
                    className="mt-7 space-y-5 rounded-2xl border border-sky-200 bg-sky-50/50 p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="font-bold">
                        {editingVideoId !== null
                          ? "Edit Video"
                          : "Upload New Video"}
                      </h4>

                      <button
                        type="button"
                        onClick={() => {
                          setShowVideoForm(false);
                          setVideoFiles([]);
                          setVideoForm(emptyVideo);
                          setEditingVideoId(null);
                        }}
                        disabled={videoUploading}
                        className="rounded-lg p-2 hover:bg-white"
                      >
                        <X size={19} />
                      </button>
                    </div>

                    <Field
                      label="Video Title"
                      value={videoForm.title}
                      onChange={(value) =>
                        setVideoForm((current) => ({
                          ...current,
                          title: value,
                        }))
                      }
                      placeholder="Enter video title"
                    />

                    <Field
                      label="Video Description"
                      value={videoForm.description}
                      onChange={(value) =>
                        setVideoForm((current) => ({
                          ...current,
                          description: value,
                        }))
                      }
                      multiline
                      placeholder="Describe this video"
                    />

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600">
                        Select Video Files
                      </label>

                      <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-6">
                        <Video size={35} className="mx-auto text-sky-500" />

                        <p className="mt-3 text-center text-sm font-semibold">
                          Choose videos from your device
                        </p>

                        <p className="mt-1 text-center text-xs text-slate-500">
                          Videos will upload to Cloudinary.
                        </p>

                        <label className="mx-auto mt-4 flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white">
                          <Plus size={17} />
                          Select Videos
                          <input
                            type="file"
                            accept="video/*"
                            multiple
                            disabled={videoUploading || saving}
                            onChange={(event) => {
                              const files = Array.from(
                                event.target.files || [],
                              );

                              setVideoFiles(files);
                              event.target.value = "";
                            }}
                            className="hidden"
                          />
                        </label>

                        {videoFiles.length > 0 && (
                          <div className="mt-5 space-y-2">
                            {videoFiles.map((file, index) => (
                              <div
                                key={`${file.name}-${index}`}
                                className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"
                              >
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium">
                                    {file.name}
                                  </p>

                                  <p className="text-xs text-slate-500">
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  disabled={videoUploading}
                                  onClick={() =>
                                    setVideoFiles((current) =>
                                      current.filter(
                                        (_, itemIndex) => itemIndex !== index,
                                      ),
                                    )
                                  }
                                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                >
                                  <X size={17} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="relative flex items-center gap-3">
                      <div className="h-px flex-1 bg-slate-200" />
                      <span className="text-xs text-slate-400">
                        OR USE A VIDEO URL
                      </span>
                      <div className="h-px flex-1 bg-slate-200" />
                    </div>

                    <Field
                      label="Video URL"
                      value={videoForm.url}
                      onChange={(value) =>
                        setVideoForm((current) => ({
                          ...current,
                          url: value,
                        }))
                      }
                      placeholder="https://example.com/video.mp4"
                    />

                    <p className="text-xs leading-5 text-slate-500">
                      Select files to upload them to Cloudinary. If you enter a
                      video URL without selecting files, the URL will be saved
                      directly.
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={videoUploading || saving}
                        className={buttonClass}
                      >
                        {videoUploading || saving ? (
                          <LoaderCircle size={17} className="animate-spin" />
                        ) : (
                          <Save size={17} />
                        )}

                        {videoUploading
                          ? "Uploading..."
                          : saving
                            ? "Saving..."
                            : "Upload & Save Video"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowVideoForm(false);
                          setVideoFiles([]);
                          setVideoForm(emptyVideo);
                          setEditingVideoId(null);
                        }}
                        disabled={videoUploading || saving}
                        className={secondaryButtonClass}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="mt-7 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {config.videos.map((video) => (
                    <article
                      key={getItemId(video)}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                    >
                      <video
                        src={video.url}
                        controls
                        playsInline
                        preload="metadata"
                        className="aspect-video w-full bg-black object-contain"
                      />

                      <div className="p-4">
                        <h4 className="font-bold text-slate-800">
                          {video.title}
                        </h4>

                        <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                          {video.description}
                        </p>

                        <p className="mt-3 break-all text-xs text-slate-400">
                          {video.url}
                        </p>

                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEditVideo(video)}
                            disabled={videoUploading || saving}
                            className={`${secondaryButtonClass} flex-1`}
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteVideo(video)}
                            disabled={videoUploading || saving}
                            className="rounded-xl border border-red-200 px-4 py-3 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {config.videos.length === 0 && (
                  <div className="mt-7 rounded-2xl bg-slate-50 p-10 text-center">
                    <Video size={38} className="mx-auto text-slate-400" />

                    <p className="mt-3 font-semibold text-slate-600">
                      No videos added yet.
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Upload your first beauty video.
                    </p>
                  </div>
                )}
              </section>
            )}

            {activeTab === "comments" && (
              <section className={cardClass}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">Customer Comments</h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Manage customer reviews and approval status.
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

                {showCommentForm && (
                  <form
                    onSubmit={saveComment}
                    className="mt-7 space-y-5 rounded-2xl border border-sky-200 bg-sky-50/50 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold">
                        {editingCommentId !== null
                          ? "Edit Comment"
                          : "New Comment"}
                      </h4>

                      <button
                        type="button"
                        onClick={() => setShowCommentForm(false)}
                        className="rounded-lg p-2 hover:bg-white"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <Field
                      label="Customer Name"
                      value={commentForm.name}
                      onChange={(value) =>
                        setCommentForm((current) => ({
                          ...current,
                          name: value,
                        }))
                      }
                    />

                    <Field
                      label="Customer Message"
                      value={commentForm.message}
                      onChange={(value) =>
                        setCommentForm((current) => ({
                          ...current,
                          message: value,
                        }))
                      }
                      multiline
                    />

                    <Toggle
                      label="Approved"
                      checked={commentForm.approved}
                      onChange={(value) =>
                        setCommentForm((current) => ({
                          ...current,
                          approved: value,
                        }))
                      }
                    />

                    <button type="submit" className={buttonClass}>
                      <Save size={17} />
                      Save Comment
                    </button>
                  </form>
                )}

                <div className="mt-7 space-y-4">
                  {config.comments.map((comment) => (
                    <article
                      key={getItemId(comment)}
                      className="rounded-2xl border border-slate-200 p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold">{comment.name}</h4>

                            {comment.approved === false ? (
                              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                                Pending
                              </span>
                            ) : (
                              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                                Approved
                              </span>
                            )}
                          </div>

                          <p className="mt-3 text-sm leading-6 text-slate-600">
                            {comment.message}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => toggleCommentApproval(comment)}
                            title={
                              comment.approved === false ? "Approve" : "Hide"
                            }
                            className="rounded-xl border border-slate-200 p-3 text-slate-600 hover:bg-slate-50"
                          >
                            {comment.approved === false ? (
                              <Eye size={17} />
                            ) : (
                              <EyeOff size={17} />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditComment(comment)}
                            className="rounded-xl border border-slate-200 p-3 text-slate-600 hover:bg-slate-50"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteComment(comment)}
                            className="rounded-xl border border-red-200 p-3 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "search" && (
              <section className={cardClass}>
                <h3 className="text-xl font-bold">Search & Filters</h3>

                <p className="mt-1 text-sm text-slate-500">
                  Configure the search and filtering section.
                </p>

                <div className="mt-6 space-y-4">
                  <Field
                    label="Section Badge"
                    value={config.searchSection.badge}
                    onChange={(value) =>
                      updateNested("searchSection", "badge", value)
                    }
                  />

                  <Field
                    label="Section Title"
                    value={config.searchSection.title}
                    onChange={(value) =>
                      updateNested("searchSection", "title", value)
                    }
                  />

                  <Field
                    label="Section Description"
                    value={config.searchSection.description}
                    onChange={(value) =>
                      updateNested("searchSection", "description", value)
                    }
                    multiline
                  />

                  <Field
                    label="Search Placeholder"
                    value={config.searchSection.placeholder}
                    onChange={(value) =>
                      updateNested("searchSection", "placeholder", value)
                    }
                  />

                  <Toggle
                    label="Enable Search Section"
                    checked={config.searchSection.enabled}
                    onChange={(value) =>
                      updateNested("searchSection", "enabled", value)
                    }
                  />

                  <Toggle
                    label="Show Category Filters"
                    checked={config.searchSection.showCategoryFilters}
                    onChange={(value) =>
                      updateNested(
                        "searchSection",
                        "showCategoryFilters",
                        value,
                      )
                    }
                  />

                  <Toggle
                    label="Show Favorites"
                    checked={config.searchSection.showFavorites}
                    onChange={(value) =>
                      updateNested("searchSection", "showFavorites", value)
                    }
                  />

                  <Toggle
                    label="Show Result Count"
                    checked={config.searchSection.showResultCount}
                    onChange={(value) =>
                      updateNested("searchSection", "showResultCount", value)
                    }
                  />

                  <Toggle
                    label="Show Clear Filters Button"
                    checked={config.searchSection.showClearButton}
                    onChange={(value) =>
                      updateNested("searchSection", "showClearButton", value)
                    }
                  />
                </div>
              </section>
            )}

            {activeTab === "contact" && (
              <section className={cardClass}>
                <h3 className="text-xl font-bold">Contact Section</h3>

                <p className="mt-1 text-sm text-slate-500">
                  Edit the contact area displayed on your Products page.
                </p>

                <div className="mt-6 space-y-5">
                  <Field
                    label="Contact Title"
                    value={config.contactSection.title}
                    onChange={(value) =>
                      updateNested("contactSection", "title", value)
                    }
                  />

                  <Field
                    label="Contact Description"
                    value={config.contactSection.description}
                    onChange={(value) =>
                      updateNested("contactSection", "description", value)
                    }
                    multiline
                  />

                  <Field
                    label="Button Text"
                    value={config.contactSection.buttonText}
                    onChange={(value) =>
                      updateNested("contactSection", "buttonText", value)
                    }
                  />

                  <Field
                    label="Button Link"
                    value={config.contactSection.buttonLink}
                    onChange={(value) =>
                      updateNested("contactSection", "buttonLink", value)
                    }
                  />

                  <Toggle
                    label="Enable Contact Section"
                    checked={config.contactSection.enabled}
                    onChange={(value) =>
                      updateNested("contactSection", "enabled", value)
                    }
                  />
                </div>
              </section>
            )}

            <footer className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5">
              <div>
                <p className="font-semibold text-slate-800">
                  Product Management
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Remember to save your changes before leaving this page.
                </p>
              </div>

              <button
                type="button"
                onClick={save}
                disabled={saving || videoUploading}
                className={buttonClass}
              >
                {saving ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <Save size={17} />
                )}

                {saving ? "Saving..." : "Save Changes"}
              </button>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
