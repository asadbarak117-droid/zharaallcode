import { useEffect, useState } from "react";
import {
  Sparkles,
  Shirt,
  Palette,
  Heart,
  ArrowRight,
  CheckCircle2,
  CalendarDays,
  UserRound,
  Mail,
  MessageCircle,
  Droplets,
  Sun,
  Leaf,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Loader2,
  Phone,
} from "lucide-react";

const BEAUTY_PROBLEMS_API = "http://localhost:5000/api/beauty-problems";
const CONSULTATION_REQUESTS_API =
  "http://localhost:5000/api/consultation-requests";

const services = [
  {
    title: "Personal Styling",
    description:
      "Get personalized fashion advice based on your style, personality, and lifestyle.",
    icon: Shirt,
  },
  {
    title: "Color Consultation",
    description:
      "Discover colors that complement your skin tone and create a beautiful look.",
    icon: Palette,
  },
  {
    title: "Beauty & Fashion",
    description:
      "Receive guidance about skincare, haircare, makeup, and fashion choices.",
    icon: Sparkles,
  },
];

const skinOptions = ["Oily", "Dry", "Combination", "Sensitive", "Normal"];

const hairOptions = ["Oily", "Dry", "Normal", "Curly", "Damaged"];

const concerns = [
  "Acne and pimples",
  "Dark spots and uneven tone",
  "Dryness and dehydration",
  "Hair fall and breakage",
  "Dandruff or itchy scalp",
  "Frizz and split ends",
  "General skin and hair care",
];

const skinTips = {
  Oily: [
    "Use a gentle cleanser twice a day.",
    "Choose lightweight and non-comedogenic products.",
    "Avoid washing your face too many times.",
  ],
  Dry: [
    "Use a gentle moisturizing cleanser.",
    "Apply moisturizer while the skin is slightly damp.",
    "Avoid very hot water.",
  ],
  Combination: [
    "Use gentle products for your entire face.",
    "Use lightweight moisturizer.",
    "Pay special attention to both dry and oily areas.",
  ],
  Sensitive: [
    "Choose fragrance-free products.",
    "Test new products on a small area first.",
    "Avoid harsh scrubs and strong ingredients.",
  ],
  Normal: [
    "Keep a simple skincare routine.",
    "Use moisturizer regularly.",
    "Protect your skin from the sun.",
  ],
};

const hairTips = {
  Oily: [
    "Wash your hair according to your scalp needs.",
    "Avoid applying heavy oils directly to the scalp.",
    "Use lightweight hair products.",
  ],
  Dry: [
    "Use a moisturizing shampoo and conditioner.",
    "Avoid excessive heat styling.",
    "Use a nourishing hair mask regularly.",
  ],
  Normal: [
    "Keep a regular washing routine.",
    "Use conditioner on the lengths.",
    "Protect your hair from excessive heat.",
  ],
  Curly: [
    "Use moisturizing products.",
    "Avoid brushing curly hair when it is completely dry.",
    "Use a wide-tooth comb.",
  ],
  Damaged: [
    "Reduce heat styling.",
    "Use conditioner regularly.",
    "Trim damaged ends when necessary.",
  ],
};

const concernTips = {
  "Acne and pimples": [
    "Keep your skincare routine simple.",
    "Avoid touching or squeezing pimples.",
    "Use non-comedogenic products.",
  ],
  "Dark spots and uneven tone": [
    "Use sunscreen every day.",
    "Avoid picking at pimples.",
    "Introduce brightening products gradually.",
  ],
  "Dryness and dehydration": [
    "Use a gentle cleanser.",
    "Apply moisturizer regularly.",
    "Drink enough water throughout the day.",
  ],
  "Hair fall and breakage": [
    "Avoid tight hairstyles.",
    "Use gentle hair products.",
    "Eat a balanced diet with enough protein.",
  ],
  "Dandruff or itchy scalp": [
    "Keep the scalp clean.",
    "Use an appropriate anti-dandruff shampoo.",
    "Avoid scratching the scalp.",
  ],
  "Frizz and split ends": [
    "Use conditioner regularly.",
    "Reduce excessive heat.",
    "Trim split ends when necessary.",
  ],
  "General skin and hair care": [
    "Keep your routine simple and consistent.",
    "Protect your skin from the sun.",
    "Use products suitable for your skin and hair type.",
  ],
};

const generalTips = [
  {
    title: "Stay Hydrated",
    description:
      "Drinking enough water supports healthy-looking skin and hair.",
    icon: Droplets,
  },
  {
    title: "Protect Your Skin",
    description:
      "Use sunscreen regularly to help protect your skin from sun damage.",
    icon: Sun,
  },
  {
    title: "Choose Gentle Products",
    description:
      "Avoid products that cause irritation, dryness, or discomfort.",
    icon: Leaf,
  },
  {
    title: "Be Consistent",
    description:
      "A simple routine followed consistently is often better than many products.",
    icon: RefreshCw,
  },
  {
    title: "Healthy Lifestyle",
    description:
      "Sleep, nutrition, hydration, and stress management can support your overall appearance.",
    icon: Heart,
  },
  {
    title: "Know Your Skin",
    description:
      "Understanding your skin and hair type helps you choose better products.",
    icon: ShieldCheck,
  },
];

function SkinHairFinder() {
  const [skinType, setSkinType] = useState("");
  const [hairType, setHairType] = useState("");
  const [concern, setConcern] = useState("");

  const getTips = () => {
    if (concern && concernTips[concern]) {
      return concernTips[concern];
    }

    if (skinType && skinTips[skinType]) {
      return skinTips[skinType];
    }

    if (hairType && hairTips[hairType]) {
      return hairTips[hairType];
    }

    return ["Choose your skin or hair type to receive personalized tips."];
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">
            Beauty Finder
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
            Find Tips for Your Skin & Hair
          </h2>

          <p className="text-slate-600 mt-4">
            Select your skin type, hair type, and main concern to receive simple
            beauty recommendations.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Skin Type</h3>

            <div className="space-y-3">
              {skinOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="skinType"
                    value={option}
                    checked={skinType === option}
                    onChange={(e) => setSkinType(e.target.value)}
                    className="accent-blue-600"
                  />

                  <span className="text-slate-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Hair Type</h3>

            <div className="space-y-3">
              {hairOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="hairType"
                    value={option}
                    checked={hairType === option}
                    onChange={(e) => setHairType(e.target.value)}
                    className="accent-blue-600"
                  />

                  <span className="text-slate-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg text-slate-900 mb-4">
              Main Concern
            </h3>

            <select
              value={concern}
              onChange={(e) => setConcern(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Select a concern</option>

              {concerns.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 bg-blue-600 text-white rounded-3xl p-8">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Sparkles size={24} />
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Your Beauty Tips</h3>

              <div className="space-y-3">
                {getTips().map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0" />

                    <p className="text-blue-50">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AdminBeautyProblems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const loadProblems = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(BEAUTY_PROBLEMS_API);

      if (!response.ok) {
        throw new Error("Could not load beauty problems.");
      }

      const data = await response.json();

      const list = Array.isArray(data)
        ? data
        : data.problems || data.data || [];

      const normalized = list.map((item, index) => ({
        id: item._id || item.id || index,
        number: item.number || index + 1,
        category: item.category || "Beauty",
        title: item.title || item.name || "Beauty Concern",
        description:
          item.description || item.problem || "No description available.",
        tips: Array.isArray(item.tips) ? item.tips : item.tip ? [item.tip] : [],
      }));

      setProblems(normalized);
    } catch {
      setError(
        "Unable to load the common skin and hair problems from the server.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProblems();
  }, []);

  const filteredProblems = problems.filter((problem) => {
    const matchesCategory =
      filter === "All" ||
      problem.category.toLowerCase() === filter.toLowerCase();

    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      searchText === "" ||
      problem.title.toLowerCase().includes(searchText) ||
      problem.description.toLowerCase().includes(searchText) ||
      problem.category.toLowerCase().includes(searchText) ||
      problem.tips.some((tip) => tip.toLowerCase().includes(searchText));

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">
            Ledora Beauty Guide
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
            Common Skin & Hair Problems
          </h2>

          <p className="text-slate-600 mt-4">
            Helpful information and beauty tips published by the Ledora
            administration.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skin or hair problems..."
              className="w-full border border-slate-200 rounded-2xl px-5 py-4 pr-12 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 shadow-sm"
            />

            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {["All", "Skin", "Hair"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`px-6 py-2.5 rounded-full font-medium transition ${
                filter === item
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-blue-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center items-center gap-3 py-12 text-slate-500">
            <Loader2 className="animate-spin" size={22} />
            <span>Loading beauty problems...</span>
          </div>
        )}

        {!loading && error && (
          <div className="max-w-xl mx-auto bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
            <AlertCircle className="mx-auto text-red-500 mb-3" size={28} />

            <p className="text-red-700 mb-4">{error}</p>

            <button
              type="button"
              onClick={loadProblems}
              className="inline-flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-xl hover:bg-red-600"
            >
              <RefreshCw size={17} />
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && problems.length === 0 && (
          <div className="text-center bg-slate-50 rounded-2xl p-10">
            <Sparkles className="mx-auto text-blue-500 mb-4" size={35} />

            <h3 className="text-xl font-bold text-slate-900">
              No beauty problems added yet
            </h3>

            <p className="text-slate-600 mt-2">
              The admin can add common skin and hair problems from the admin
              dashboard.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          problems.length > 0 &&
          filteredProblems.length === 0 && (
            <div className="text-center bg-slate-50 rounded-2xl p-10">
              <h3 className="text-xl font-bold text-slate-900">
                No results found
              </h3>

              <p className="text-slate-600 mt-2">
                Try searching for another skin or hair problem.
              </p>
            </div>
          )}

        {!loading && !error && filteredProblems.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.map((problem) => (
              <div
                key={problem.id}
                className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition p-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                    {String(problem.number).padStart(2, "0")}
                  </div>

                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
                    {problem.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {problem.title}
                </h3>

                <p className="text-slate-600 leading-7 mb-5">
                  {problem.description}
                </p>

                {problem.tips.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">
                      Helpful Tips
                    </h4>

                    <div className="space-y-2">
                      {problem.tips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2
                            size={17}
                            className="text-blue-600 mt-1 flex-shrink-0"
                          />

                          <span className="text-sm text-slate-600">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function BeautyTips() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">
            Beauty Advice
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
            Simple Tips for Everyday Beauty
          </h2>

          <p className="text-slate-600 mt-4">
            Small habits can make a big difference in your skin, hair, and
            overall style.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {generalTips.map((tip) => {
            const Icon = tip.icon;

            return (
              <div
                key={tip.title}
                className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                  <Icon size={24} />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {tip.title}
                </h3>

                <p className="text-slate-600 leading-7">{tip.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function Consultation() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    service: "",
    date: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    setForm((previousForm) => ({
      ...previousForm,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setSubmitted(false);
    setSubmitError("");

    try {
      const response = await fetch(CONSULTATION_REQUESTS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Could not save your consultation request.",
        );
      }

      setSubmitted(true);

      setForm({
        name: "",
        email: "",
        whatsapp: "",
        service: "",
        date: "",
        message: "",
      });
    } catch (error) {
      setSubmitError(
        error.message || "Could not connect to the server. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles size={16} />
                Ledora Consultation
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Discover Your
                <span className="text-blue-600"> Beauty & Style</span>
              </h1>

              <p className="text-lg text-slate-600 mt-6 max-w-xl leading-8">
                Get personalized advice for fashion, skincare, haircare, colors,
                and your personal style.
              </p>

              <a
                href="#booking"
                className="inline-flex items-center gap-2 mt-8 bg-blue-600 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Request a Consultation
                <ArrowRight size={19} />
              </a>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85"
                alt="Fashion consultation"
                className="w-full h-[520px] object-cover rounded-[2rem] shadow-2xl"
              />

              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <Sparkles size={21} />
                  </div>

                  <div>
                    <p className="font-bold">Personalized Consultation</p>

                    <p className="text-sm text-slate-500">
                      Beauty • Fashion • Style
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">
              Our Services
            </span>

            <h2 className="text-3xl md:text-4xl font-bold mt-3">
              What Can We Help You With?
            </h2>

            <p className="text-slate-600 mt-4">
              Choose the type of consultation that fits your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="bg-white border border-slate-100 rounded-3xl p-7 shadow-sm hover:shadow-xl transition group"
                >
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition">
                    <Icon size={27} />
                  </div>

                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>

                  <p className="text-slate-600 leading-7">
                    {service.description}
                  </p>

                  <a
                    href="#booking"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold mt-6"
                  >
                    Learn More
                    <ArrowRight size={17} />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SkinHairFinder />
      <AdminBeautyProblems />
      <BeautyTips />

      <section id="booking" className="py-20 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <div>
              <span className="text-blue-400 font-semibold tracking-wider uppercase text-sm">
                Request a Consultation
              </span>

              <h2 className="text-3xl md:text-5xl font-bold mt-4 leading-tight">
                Let&apos;s Create Your Perfect Look
              </h2>

              <p className="text-slate-300 mt-6 leading-8 max-w-lg">
                Fill out the form and tell us what you need. Our team can
                contact you about your consultation.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                    <CalendarDays size={20} />
                  </div>

                  <div>
                    <p className="font-semibold">Flexible Consultation</p>
                    <p className="text-sm text-slate-400">
                      Choose your preferred date.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                    <MessageCircle size={20} />
                  </div>

                  <div>
                    <p className="font-semibold">WhatsApp Contact</p>
                    <p className="text-sm text-slate-400">
                      Add your WhatsApp number so we can contact you.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                    <Heart size={20} />
                  </div>

                  <div>
                    <p className="font-semibold">Personalized Advice</p>
                    <p className="text-sm text-slate-400">
                      Advice based on your needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white text-slate-900 rounded-3xl p-7 md:p-9 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Full Name
                  </label>

                  <div className="relative">
                    <UserRound
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                      className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                      className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    WhatsApp Number
                  </label>

                  <div className="relative">
                    <Phone
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="tel"
                      name="whatsapp"
                      value={form.whatsapp}
                      onChange={handleChange}
                      required
                      placeholder="+93 700 000 000"
                      className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <p className="text-xs text-slate-500 mt-2">
                    Please include your country code.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Consultation Service
                  </label>

                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Select a service</option>

                    {services.map((service) => (
                      <option key={service.title} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Preferred Date
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Message
                  </label>

                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Tell us what you need help with..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={19} className="animate-spin" />
                      Saving Request...
                    </>
                  ) : (
                    <>
                      <MessageCircle size={19} />
                      Request Consultation
                    </>
                  )}
                </button>

                {submitted && (
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 p-4 rounded-xl text-sm">
                    <CheckCircle2 size={19} />
                    Your consultation request has been saved successfully!
                  </div>
                )}

                {submitError && (
                  <div className="flex items-center gap-2 bg-red-50 text-red-700 p-4 rounded-xl text-sm">
                    <AlertCircle size={19} />
                    <span>{submitError}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <Sparkles size={18} />
              </div>

              <span className="font-bold text-xl">Ledora</span>
            </div>

            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Ledora. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
