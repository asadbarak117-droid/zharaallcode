import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  X,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/productsection";

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
  const category = product.category || "Skincare";

  return {
    id: String(
      product._id ||
        product.id ||
        product.code ||
        product.productCode ||
        `product-${index}`,
    ),
    name: product.name || product.title || "Unnamed product",
    code: String(product.code || product.productCode || product.sku || ""),
    category,
    image:
      product.image ||
      product.imageUrl ||
      product.photo ||
      categoryImages[category] ||
      categoryImages.Skincare,
    description: product.description || "",
    price: product.price || "",
    badge: product.badge || "",
  };
}

function normalizeConfig(data) {
  const source = data?.data ?? data?.content ?? data ?? {};

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
        ? source.categories
        : defaultCategories,
    products: Array.isArray(source.products) ? source.products : [],
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

  const categorySliderRef = useRef(null);

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
      config.categories.map((name) => ({
        name,
        subtitle:
          name === "Makeup"
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
                          : `${name} collection`,
        image: categoryImages[name] || categoryImages.Skincare,
      })),
    [config.categories],
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch(API_URL, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const result = await response.json();
        const data = normalizeConfig(result);

        setConfig(data);
        setProducts(data.products.map(normalizeProduct));
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Could not load product page:", error);
          setLoadError(
            "Could not load the latest products. Please check that the backend is running.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
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

  const slideCategories = (direction) => {
    categorySliderRef.current?.scrollBy({
      left: direction * 300,
      behavior: "smooth",
    });
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
            background: `linear-gradient(90deg, ${/^#[0-9a-fA-F]{6}$/.test(config.heroColor) ? config.heroColor : "#e0f2fe"}, #ffffff, ${/^#[0-9a-fA-F]{6}$/.test(config.heroColor) ? config.heroColor : "#e0f2fe"})`,
          }}
          className="relative mb-14 overflow-hidden rounded-3xl p-8 md:p-14"
        >
          {config.heroImage && (
            <div
              className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-10"
              style={{
                backgroundImage: `url("${config.heroImage.replace(/"/g, "%22")}")`,
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

        <section className="mb-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-sky-600">
                Explore Our Collection
              </p>
              <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                Shop by Category
              </h2>
              <p className="mt-2 text-slate-500">
                Slide to explore all categories.
              </p>
            </div>

            <div className="hidden shrink-0 gap-2 sm:flex">
              <button
                onClick={() => slideCategories(-1)}
                aria-label="Previous categories"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 transition hover:border-sky-400 hover:bg-sky-50"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={() => slideCategories(1)}
                aria-label="Next categories"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 transition hover:border-sky-400 hover:bg-sky-50"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          <div
            ref={categorySliderRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-5 [scrollbar-width:thin]"
          >
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
                className="group relative h-52 w-64 shrink-0 snap-start overflow-hidden rounded-2xl text-left sm:h-60 sm:w-72"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xs font-medium uppercase tracking-widest text-white/80">
                    {category.subtitle}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 transition group-hover:bg-white group-hover:text-sky-700">
                      <ArrowRight size={18} />
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <p className="text-xs text-slate-400">
            Tip: You can also swipe left or right on mobile.
          </p>
        </section>

        <section className="mb-8">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-widest text-sky-600">
              Find Your Favorites
            </p>
            <h2 className="mt-2 text-2xl font-bold md:text-3xl">
              Our Beauty Collection
            </h2>
            <p className="mt-2 text-slate-500">
              Search by product name, code, or category.
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
                placeholder="Search products, codes, categories..."
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

            <button
              onClick={() => setShowFavorites((current) => !current)}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-4 font-semibold transition ${
                showFavorites
                  ? "border-rose-200 bg-rose-50 text-rose-600"
                  : "border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:text-rose-600"
              }`}
            >
              <Heart size={19} fill={showFavorites ? "currentColor" : "none"} />
              Favorites ({favorites.length})
            </button>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setShowFavorites(false);
                }}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  selectedCategory === category
                    ? "bg-sky-600 text-white shadow-md shadow-sky-100"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-900">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>
            {(searchTerm ||
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
                onClick={() => window.location.reload()}
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
              Need Help Choosing?
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              Have questions about a product? Contact us to learn more about our
              collection.
            </p>
            <a
              href="/connect"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-bold text-slate-900 transition hover:bg-cyan-100"
            >
              Contact Us
              <ArrowRight size={18} />
            </a>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
