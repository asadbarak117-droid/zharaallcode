import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Heart,
  Star,
  Truck,
  ShieldCheck,
  Headphones,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";

const API_URL = "https://zharaallcode.onrender.com/api/home";

const defaultContent = {
  brand: "FASHION",
  heroBackgroundType: "video",
  heroBadge: "Discover Your Beauty",
  heroTitle: "Your Beauty.",
  heroSubtitle: "Your Story.",
  heroDescription:
    "Discover beauty and fashion essentials that express your individuality. Find your favorite products and create a look that feels uniquely yours.",
  heroVideo: "/videos/hero.mp4",
  heroPoster:
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80",
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
  products: [],
  videos: [],
};

const benefits = [
  {
    icon: Truck,
    title: "Easy Shopping",
    description: "A simple shopping experience",
  },
  {
    icon: ShieldCheck,
    title: "Quality First",
    description: "Products selected with care",
  },
  {
    icon: Headphones,
    title: "Friendly Support",
    description: "We're here to help you",
  },
];

function Home() {
  const [content, setContent] = useState(defaultContent);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [mutedVideos, setMutedVideos] = useState({});

  useEffect(() => {
    const controller = new AbortController();

    async function loadHomeContent() {
      try {
        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Homepage request failed: ${response.status}`);
        }

        const result = await response.json();
        const saved = result.content ?? result;

        setContent({
          ...defaultContent,
          ...saved,
          categories:
            Array.isArray(saved.categories) && saved.categories.length > 0
              ? saved.categories
              : defaultContent.categories,
          videos: Array.isArray(saved.videos) ? saved.videos : [],
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Could not load homepage content:", error);
        }
      }
    }

    loadHomeContent();

    return () => controller.abort();
  }, []);

  const getVideoUrl = (video) => {
    if (typeof video === "string") return video;

    return (
      video?.url ||
      video?.video ||
      video?.videoUrl ||
      video?.src ||
      video?.file ||
      ""
    );
  };

  const getVideoTitle = (video, index) => {
    if (typeof video === "string") return `Beauty Video ${index + 1}`;

    return (
      video?.title ||
      video?.name ||
      video?.description ||
      `Beauty Video ${index + 1}`
    );
  };

  const getVideoDescription = (video) => {
    if (typeof video === "string") return "Discover beauty and fashion.";

    return (
      video?.description || video?.subtitle || "Discover beauty and fashion."
    );
  };

  const getVideoPoster = (video) => {
    if (typeof video === "string") return "";

    return video?.thumbnail || video?.poster || video?.image || "";
  };

  const toggleVideo = (index) => {
    setPlayingVideo((current) => (current === index ? null : index));
  };

  const toggleMute = (index) => {
    setMutedVideos((current) => ({
      ...current,
      [index]: !current[index],
    }));
  };

  return (
    <main
      className="overflow-hidden bg-white text-slate-800"
      style={{
        backgroundColor: content.backgroundColor || "#ffffff",
        color: content.textColor || "#1e293b",
      }}
    >
      {/* HERO SECTION */}

      <section className="relative isolate min-h-[650px] overflow-hidden bg-sky-950">
        {content.heroBackgroundType === "video" && content.heroVideo ? (
          <video
            key={content.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={content.heroPoster}
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          >
            <source src={content.heroVideo} type="video/mp4" />
          </video>
        ) : (
          <div
            className="absolute inset-0 -z-20 bg-cover bg-center"
            style={{
              backgroundImage: content.heroPoster
                ? `url("${content.heroPoster}")`
                : "none",
            }}
          />
        )}

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-sky-950/85 via-sky-900/55 to-sky-800/25" />

        <div className="mx-auto flex min-h-[650px] max-w-7xl items-center px-5 py-20 md:px-8">
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-md">
              <Sparkles size={16} />
              {content.heroBadge}
            </div>

            <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              {content.heroTitle}
              <span
                className="mt-2 block"
                style={{ color: content.primaryColor || "#38bdf8" }}
              >
                {content.heroSubtitle}
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/90 sm:text-lg">
              {content.heroDescription}
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <motion.div
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/products"
                  className="inline-flex items-center gap-3 rounded-full px-7 py-4 font-semibold text-white shadow-lg transition hover:brightness-110"
                  style={{
                    backgroundColor: content.primaryColor || "#38bdf8",
                  }}
                >
                  {content.primaryButton}
                  <ArrowRight size={19} />
                </Link>
              </motion.div>

              <Link
                to="/consultation"
                className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur-md transition hover:bg-white hover:text-sky-900"
              >
                {content.secondaryButton}
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-5 text-sm text-white/90">
              <div className="flex items-center gap-2">
                <Star size={17} className="fill-sky-300 text-sky-300" />
                Beauty & Fashion
              </div>

              <span className="hidden h-5 w-px bg-white/40 sm:block" />

              <div className="flex items-center gap-2">
                <Heart size={17} className="text-sky-300" />
                Made for You
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BENEFITS */}

      <section className="border-y border-sky-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-9 sm:grid-cols-2 md:px-8 lg:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
                className="flex items-center gap-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
                  <Icon size={23} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">
                    {benefit.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CATEGORIES */}

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-sky-500">
              Find Your Favorites
            </p>

            <h2 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              Explore Our Categories
            </h2>

            <p className="mt-3 text-slate-500">
              Discover products that fit your style.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 font-semibold text-sky-600 transition hover:text-sky-700"
          >
            All Products <ArrowRight size={18} />
          </Link>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.categories.map((category, index) => (
            <motion.div
              key={category._id || `${category.name}-${index}`}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              whileHover={{ y: -7 }}
            >
              <Link
                to="/products"
                className="group relative block overflow-hidden rounded-3xl bg-sky-50"
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name || "Category"}
                    loading="lazy"
                    className="h-80 w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-80 w-full bg-sky-100" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white">
                  <div>
                    <h3 className="font-serif text-2xl font-bold">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-sm text-white/80">
                      {category.description}
                    </p>
                  </div>

                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sky-600 transition duration-300 group-hover:bg-sky-400 group-hover:text-white">
                    <ArrowRight size={20} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BEAUTY VIDEOS */}

      {content.videos.length > 0 && (
        <section className="bg-sky-50/70 py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12 flex flex-wrap items-end justify-between gap-5"
            >
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-sky-500">
                  Watch & Discover
                </p>

                <h2 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
                  Beauty Videos
                </h2>

                <p className="mt-4 max-w-xl leading-7 text-slate-500">
                  Explore beauty tips, tutorials, skincare routines and
                  inspiration from our collection.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-sky-600">
                <Play size={17} />
                {content.videos.length} Videos
              </div>
            </motion.div>

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {content.videos.map((video, index) => {
                const videoUrl = getVideoUrl(video);
                const isPlaying = playingVideo === index;

                if (!videoUrl) return null;

                return (
                  <motion.article
                    key={video?._id || `${videoUrl}-${index}`}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                    }}
                    whileHover={{ y: -6 }}
                    className="group overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-sky-100"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                      <video
                        key={videoUrl}
                        src={videoUrl}
                        poster={getVideoPoster(video)}
                        controls={isPlaying}
                        playsInline
                        preload="metadata"
                        muted={mutedVideos[index] ?? true}
                        className="h-full w-full object-cover"
                        onPlay={() => setPlayingVideo(index)}
                        onPause={() =>
                          setPlayingVideo((current) =>
                            current === index ? null : current,
                          )
                        }
                      />

                      {!isPlaying && (
                        <button
                          type="button"
                          onClick={() => setPlayingVideo(index)}
                          className="absolute inset-0 flex items-center justify-center bg-black/15 transition hover:bg-black/30"
                          aria-label="Play video"
                        >
                          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/50 bg-white/90 text-sky-600 shadow-xl transition group-hover:scale-110">
                            <Play size={27} fill="currentColor" />
                          </span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleMute(index)}
                        className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
                        aria-label="Toggle mute"
                      >
                        {(mutedVideos[index] ?? true) ? (
                          <VolumeX size={18} />
                        ) : (
                          <Volume2 size={18} />
                        )}
                      </button>

                      <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                        <span className="flex items-center gap-1.5">
                          {isPlaying ? (
                            <>
                              <Pause size={13} />
                              Now Playing
                            </>
                          ) : (
                            <>
                              <Play size={13} />
                              Watch Video
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-500">
                        <Sparkles size={14} />
                        Beauty & Fashion
                      </div>

                      <h3 className="text-lg font-bold text-slate-800">
                        {getVideoTitle(video, index)}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {getVideoDescription(video)}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* PROMOTION */}

      <section className="px-5 py-20 md:px-8 md:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] px-7 py-14 text-center text-white sm:px-14 sm:py-20"
          style={{
            background: `linear-gradient(to bottom right, ${content.primaryColor || "#7dd3fc"}, #60a5fa)`,
          }}
        >
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[40px] border-white/10" />
          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full border-[40px] border-white/10" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <Sparkles size={32} className="mx-auto mb-5" />

            <h2 className="font-serif text-3xl font-bold sm:text-5xl">
              {content.promotionTitle}
            </h2>

            <p className="mx-auto mt-5 max-w-xl leading-7 text-white/90">
              {content.promotionDescription}
            </p>

            <Link
              to="/products"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-semibold text-sky-600 shadow-lg transition hover:-translate-y-1 hover:bg-sky-50"
            >
              Start Shopping <ArrowRight size={19} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}

      <footer className="border-t border-sky-100 bg-sky-50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-8 text-center sm:flex-row sm:text-left md:px-8">
          <Link
            to="/"
            className="font-serif text-2xl font-bold tracking-widest text-slate-900"
          >
            {content.brand}
            <span className="text-sky-400">.</span>
          </Link>

          <p className="text-sm text-slate-500">{content.footerDescription}</p>

          <div className="flex gap-5 text-sm font-medium text-slate-600">
            <Link to="/products" className="transition hover:text-sky-500">
              Products
            </Link>

            <Link to="/consultation" className="transition hover:text-sky-500">
              Consultation
            </Link>

            <Link to="/connect" className="transition hover:text-sky-500">
              Contact
            </Link>
          </div>
        </div>

        <div className="border-t border-sky-100 px-5 py-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {content.brand}. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

export default Home;
