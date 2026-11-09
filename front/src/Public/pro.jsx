import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  X,
  MessageCircle,
  Send,
} from "lucide-react";

const API_URL = "https://zharaallcode.onrender.com/api/productsection";

const defaultCategories = [
  "Makeup",
  "Skincare",
  "Viper",
  "Spirulina",
  "Hair Care",
  "Soap & Body",
  "Perfume",
  "Pomegranate",
];

const categoryImages = {
  Makeup:
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80",
  Skincare:
    "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80",
  Viper:
    "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80",
  Spirulina:
    "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80",
  "Hair Care":
    "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80",
  "Soap & Body":
    "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=700&q=80",
  Perfume:
    "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=700&q=80",
  Pomegranate:
    "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80",
};

function normalizeProduct(product, index) {
  const item = product && typeof product === "object" ? product : {};
  const category = item.category || "Skincare";

  return {
    id: String(
      item._id ||
        item.id ||
        item.code ||
        item.productCode ||
        `product-${index}`,
    ),
    name: item.name || item.title || "Unnamed product",
    code: String(item.code || item.productCode || item.sku || ""),
    category,
    image:
      item.image ||
      item.imageUrl ||
      item.photo ||
      categoryImages[category] ||
      categoryImages.Skincare,
    description: item.description || "",
    price: item.price || "",
    badge: item.badge || "",
  };
}

function normalizeConfig(data) {
  let source = data;

  for (let i = 0; i < 5; i++) {
    if (!source || typeof source !== "object" || Array.isArray(source)) {
      break;
    }

    if (Array.isArray(source.products) || Array.isArray(source.categories)) {
      break;
    }

    const nested = source.data ?? source.content ?? source.config;

    if (!nested || typeof nested !== "object") {
      break;
    }

    source = nested;
  }

  if (!source || typeof source !== "object" || Array.isArray(source)) {
    source = {};
  }

  return {
    heroBadge: source.heroBadge ?? "Your Beauty, Your Confidence",
    heroTitle: source.heroTitle ?? "Discover Your New Beauty Favorites",
    heroDescription:
      source.heroDescription ??
      "From everyday essentials to your favorite fragrances, explore products for your personal routine.",
    heroButton: source.heroButton ?? "Explore Products",
    heroImage: source.heroImage ?? "",
    heroColor: source.heroColor ?? "#e0f2fe",
    pageTitle: source.pageTitle ?? "Discover Your Beauty",
    pageDescription:
      source.pageDescription ??
      "Explore makeup, skincare, hair care, perfumes, and more.",
    categories:
      Array.isArray(source.categories) && source.categories.length > 0
        ? source.categories.filter(
            (category) => typeof category === "string" && category.trim(),
          )
        : defaultCategories,
    categoryDetails: Array.isArray(source.categoryDetails)
      ? source.categoryDetails
      : [],
    products: Array.isArray(source.products) ? source.products : [],
    comments: Array.isArray(source.comments) ? source.comments : [],
    searchSection: {
      enabled: source.searchSection?.enabled ?? true,
      badge: source.searchSection?.badge ?? "Find Your Favorites",
      title: source.searchSection?.title ?? "Our Beauty Collection",
      description:
        source.searchSection?.description ??
        "Search by product name, code, or category.",
      placeholder:
        source.searchSection?.placeholder ??
        "Search products, codes, categories...",
      showCategoryFilters: source.searchSection?.showCategoryFilters ?? true,
      showFavorites: source.searchSection?.showFavorites ?? true,
      showResultCount: source.searchSection?.showResultCount ?? true,
      showClearButton: source.searchSection?.showClearButton ?? true,
    },
    contactSection: {
      enabled: source.contactSection?.enabled ?? true,
      title: source.contactSection?.title ?? "Need Help Choosing?",
      description:
        source.contactSection?.description ??
        "Have questions about a product? Contact us to learn more about our collection.",
      buttonText: source.contactSection?.buttonText ?? "Contact Us",
      buttonLink: source.contactSection?.buttonLink ?? "/connect",
    },
  };
}

export default function Products() {
  const [config, setConfig] = useState(() => normalizeConfig({}));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentMessage, setCommentMessage] = useState("");

  const categories = useMemo(
    () => [
      "All Products",
      ...config.categories.filter(
        (category, index, array) =>
          category !== "All Products" && array.indexOf(category) === index,
      ),
    ],
    [config.categories],
  );

  const categoryCards = useMemo(
    () =>
      config.categories.map((name) => {
        const details = config.categoryDetails.find(
          (item) =>
            String(item.name || "")
              .trim()
              .toLowerCase() === name.trim().toLowerCase(),
        );

        return {
          name,
          subtitle:
            details?.subtitle ||
            (name === "Makeup"
              ? "Makeup essentials"
              : name === "Skincare"
                ? "Your skincare routine"
                : name === "Viper"
                  ? "Viper collection"
                  : name === "Spirulina"
                    ? "Face masks"
                    : name === "Hair Care"
                      ? "Hair care essentials"
                      : name === "Soap & Body"
                        ? "Body care"
                        : name === "Perfume"
                          ? "Find your fragrance"
                          : name === "Pomegranate"
                            ? "Pomegranate collection"
                            : `${name} collection`),
          image:
            details?.image || categoryImages[name] || categoryImages.Skincare,
        };
      }),
    [config.categories, config.categoryDetails],
  );

  const loadProductSection = async () => {
    try {
      setLoading(true);
      setLoadError("");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const result = await response.json();
      const data = normalizeConfig(result);

      setConfig(data);

      setProducts(
        data.products.map((product, index) => normalizeProduct(product, index)),
      );

      setComments(
        data.comments
          .filter((comment) => comment.approved !== false)
          .map((comment, index) => ({
            id: String(comment._id || comment.id || index),
            name: comment.name || "Customer",
            text: comment.message || comment.text || "",
            date: comment.createdAt
              ? new Date(comment.createdAt).toLocaleDateString()
              : "",
          })),
      );
    } catch (error) {
      console.error("Could not load product section:", error);
      setLoadError("Could not load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductSection();
  }, []);

  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All Products" ||
        product.category === selectedCategory;

      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search) ||
        product.code.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search);

      const matchesFavorites = !showFavorites || favorites.includes(product.id);

      return matchesCategory && matchesSearch && matchesFavorites;
    });
  }, [products, searchTerm, selectedCategory, favorites, showFavorites]);

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const openInquiry = (product) => {
    window.location.href =
      "/connect?product=" + encodeURIComponent(product.name);
  };

  const scrollToProducts = () => {
    document.getElementById("product-grid")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const addComment = (event) => {
    event.preventDefault();

    if (!commentName.trim() || !commentText.trim()) {
      return;
    }

    setComments((current) => [
      {
        id: Date.now().toString(),
        name: commentName.trim(),
        text: commentText.trim(),
        date: new Date().toLocaleDateString(),
      },
      ...current,
    ]);

    setCommentName("");
    setCommentText("");
    setCommentMessage("Your comment was added to this page.");
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
            <Sparkles size={16} />
            Beauty & Care Collection
          </span>

          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            {config.pageTitle}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-500">
            {config.pageDescription}
          </p>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            background: `linear-gradient(90deg, ${
              /^#[0-9a-fA-F]{6}$/.test(config.heroColor)
                ? config.heroColor
                : "#e0f2fe"
            }, #ffffff, ${
              /^#[0-9a-fA-F]{6}$/.test(config.heroColor)
                ? config.heroColor
                : "#e0f2fe"
            })`,
          }}
          className="relative mb-14 overflow-hidden rounded-3xl p-8 md:p-14"
        >
          {config.heroImage && (
            <div
              className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-10"
              style={{
                backgroundImage: `url("${config.heroImage.replace(
                  /"/g,
                  "%22",
                )}")`,
              }}
            />
          )}

          <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-sky-200/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 right-1/4 h-52 w-52 rounded-full bg-cyan-200/50 blur-3xl" />

          <div className="relative z-10 max-w-xl">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-sky-700">
              {config.heroBadge}
            </span>

            <h2 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
              {config.heroTitle}
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              {config.heroDescription}
            </p>

            <button
              onClick={scrollToProducts}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-sky-600 px-7 py-3 font-semibold text-white transition hover:bg-sky-700 hover:shadow-lg"
            >
              {config.heroButton}
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.section>

        <section className="mb-16">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-widest text-sky-600">
              Explore Our Collection
            </p>

            <h2 className="mt-2 text-2xl font-bold md:text-3xl">
              Shop by Category
            </h2>

            <p className="mt-2 text-slate-500">
              Discover your favorite beauty and care collections.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categoryCards.map((category, index) => (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedCategory(category.name);
                  setShowFavorites(false);
                  setSearchTerm("");
                  scrollToProducts();
                }}
                className="group relative h-48 overflow-hidden rounded-2xl text-left sm:h-56 lg:h-64"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                  <p className="text-xs font-medium uppercase tracking-widest text-white/80">
                    {category.subtitle}
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <h3 className="text-lg font-bold sm:text-xl">
                      {category.name}
                    </h3>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 transition group-hover:bg-white group-hover:text-sky-700">
                      <ArrowRight size={18} />
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {config.searchSection.enabled && (
          <section className="mb-8">
            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-widest text-sky-600">
                {config.searchSection.badge}
              </p>

              <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                {config.searchSection.title}
              </h2>

              <p className="mt-2 text-slate-500">
                {config.searchSection.description}
              </p>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="relative flex-1">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={config.searchSection.placeholder}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-12 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />

                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {config.searchSection.showFavorites && (
                <button
                  onClick={() => setShowFavorites((current) => !current)}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-4 font-semibold transition ${
                    showFavorites
                      ? "border-rose-200 bg-rose-50 text-rose-600"
                      : "border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:text-rose-600"
                  }`}
                >
                  <Heart
                    size={19}
                    fill={showFavorites ? "currentColor" : "none"}
                  />
                  Favorites ({favorites.length})
                </button>
              )}
            </div>

            {config.searchSection.showCategoryFilters && (
              <div className="mt-5 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowFavorites(false);
                    }}
                    className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                      selectedCategory === category
                        ? "bg-sky-600 text-white shadow-md shadow-sky-100"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              {config.searchSection.showResultCount && (
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-bold text-slate-900">
                    {filteredProducts.length}
                  </span>{" "}
                  products
                </p>
              )}

              {config.searchSection.showClearButton &&
                (searchTerm ||
                  selectedCategory !== "All Products" ||
                  showFavorites) && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All Products");
                      setShowFavorites(false);
                    }}
                    className="text-sm font-semibold text-sky-700 hover:text-sky-900"
                  >
                    Clear all filters
                  </button>
                )}
            </div>
          </section>
        )}

        <section id="product-grid" className="scroll-mt-8">
          {loading ? (
            <div className="rounded-3xl bg-slate-50 px-6 py-16 text-center">
              <p className="font-semibold text-slate-600">
                Loading products...
              </p>
            </div>
          ) : loadError && products.length === 0 ? (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 px-6 py-16 text-center">
              <p className="font-semibold text-amber-800">{loadError}</p>

              <button
                onClick={loadProductSection}
                className="mt-5 rounded-full bg-sky-600 px-6 py-3 font-semibold text-white hover:bg-sky-700"
              >
                Try Again
              </button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{
                    duration: 0.35,
                    delay: (index % 4) * 0.05,
                  }}
                  className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-100/60"
                >
                  <div className="relative h-64 overflow-hidden bg-slate-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {product.badge && (
                      <span className="absolute bottom-3 left-3 rounded-full bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                        {product.badge}
                      </span>
                    )}

                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                      {product.category}
                    </span>

                    <button
                      onClick={() => toggleFavorite(product.id)}
                      aria-label={
                        favorites.includes(product.id)
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                      className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full shadow-sm backdrop-blur transition ${
                        favorites.includes(product.id)
                          ? "bg-rose-500 text-white"
                          : "bg-white/95 text-slate-600 hover:bg-rose-50 hover:text-rose-500"
                      }`}
                    >
                      <Heart
                        size={19}
                        fill={
                          favorites.includes(product.id)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                        Code: {product.code || "N/A"}
                      </span>

                      <Sparkles size={16} className="text-sky-400" />
                    </div>

                    <h3 className="min-h-14 text-base font-bold leading-7 text-slate-800">
                      {product.name}
                    </h3>

                    {product.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {product.description}
                      </p>
                    )}

                    <p className="mt-2 text-sm font-medium text-slate-600">
                      {product.price
                        ? `Price: ${product.price}`
                        : "Price available on request"}
                    </p>

                    <button
                      onClick={() => openInquiry(product)}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-50 px-4 py-3 font-semibold text-sky-700 transition hover:bg-sky-600 hover:text-white"
                    >
                      <ShoppingBag size={18} />
                      Ask About Product
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
              <Search size={42} className="mx-auto text-slate-300" />

              <h3 className="mt-4 text-xl font-bold text-slate-800">
                No products found
              </h3>

              <p className="mt-2 text-slate-500">
                Try another search term or choose a different category.
              </p>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All Products");
                  setShowFavorites(false);
                }}
                className="mt-6 rounded-full bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700"
              >
                Show All Products
              </button>
            </div>
          )}
        </section>

        <section className="mt-20">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-sky-600">
              Your Experience Matters
            </p>

            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Customer Comments
            </h2>

            <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-500">
              Share your experience, feedback and thoughts about LEDORA.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <form
              onSubmit={addComment}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-sky-100 p-3 text-sky-600">
                  <MessageCircle size={23} />
                </div>

                <div>
                  <h3 className="text-xl font-bold">Write a Comment</h3>
                  <p className="text-sm text-slate-500">
                    Tell us about your experience.
                  </p>
                </div>
              </div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Your Name
              </label>

              <input
                type="text"
                value={commentName}
                onChange={(event) => setCommentName(event.target.value)}
                placeholder="Enter your name"
                maxLength={60}
                required
                className="mb-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Your Comment
              </label>

              <textarea
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Write your experience here..."
                rows={5}
                maxLength={1000}
                required
                className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />

              <button
                type="submit"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3.5 font-semibold text-white transition hover:bg-sky-700"
              >
                <Send size={18} />
                Submit Comment
              </button>

              {commentMessage && (
                <p className="mt-3 text-center text-sm text-emerald-600">
                  {commentMessage}
                </p>
              )}
            </form>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Community Feedback</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {comments.length} comments
                  </p>
                </div>

                <div className="rounded-xl bg-sky-50 p-3 text-sky-600">
                  <MessageCircle size={23} />
                </div>
              </div>

              {comments.length > 0 ? (
                <div className="max-h-[450px] space-y-4 overflow-y-auto pr-2">
                  {comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl bg-slate-50 p-5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-700">
                          {comment.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-800">
                            {comment.name}
                          </h4>

                          <p className="text-xs text-slate-400">
                            {comment.date}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-7 text-slate-600">
                        {comment.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl bg-slate-50 px-5 text-center">
                  <MessageCircle size={38} className="text-slate-300" />

                  <h4 className="mt-4 font-bold text-slate-700">
                    No Comments Yet
                  </h4>

                  <p className="mt-2 text-sm text-slate-500">
                    Be the first to share your experience with us.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {config.contactSection.enabled && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mt-16 overflow-hidden rounded-3xl bg-slate-900 px-6 py-12 text-center text-white md:px-12 md:py-16"
          >
            <div className="pointer-events-none absolute -left-12 -top-16 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-2xl">
              <Sparkles size={30} className="mx-auto text-cyan-300" />

              <h2 className="mt-5 text-3xl font-bold md:text-4xl">
                {config.contactSection.title}
              </h2>

              <p className="mt-4 leading-7 text-slate-300">
                {config.contactSection.description}
              </p>

              <a
                href={config.contactSection.buttonLink}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-bold text-slate-900 transition hover:bg-cyan-100"
              >
                {config.contactSection.buttonText}
                <ArrowRight size={18} />
              </a>
            </div>
          </motion.section>
        )}
      </div>
    </main>
  );
}
