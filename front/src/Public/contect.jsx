import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  Send,
} from "lucide-react";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";

const API_URL = "http://localhost:5000/api";

const defaultSettings = {
  email: "",
  phone: "",
  location: "Afghanistan",
  instagram: "",
  facebook: "",
  whatsapp: "",
};

function Connect() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [settings, setSettings] = useState(defaultSettings);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${API_URL}/conect`);

        if (!response.ok) {
          throw new Error("Failed to load contact settings.");
        }

        const data = await response.json();

        setSettings({
          ...defaultSettings,
          ...data,
        });
      } catch (error) {
        console.error("Contact settings error:", error);
        setStatus(
          "Unable to load contact information. Please check the backend.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setSending(true);

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to send your message.");
      }

      setStatus("Your message was sent successfully!");
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Message submission error:", error);
      setStatus(
        error.message || "Unable to send your message. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  const contactItems = [
    {
      icon: Mail,
      title: "Email Us",
      value: settings.email || "Email not provided",
      description: "Send us your questions anytime.",
      href: settings.email ? `mailto:${settings.email}` : "",
    },
    {
      icon: Phone,
      title: "Call Us",
      value: settings.phone || "Phone not provided",
      description: "We would love to hear from you.",
      href: settings.phone
        ? `tel:${settings.phone.replace(/[^\d+]/g, "")}`
        : "",
    },
    {
      icon: MapPin,
      title: "Our Location",
      value: settings.location || "Location not provided",
      description: "Beauty and elegance, wherever you are.",
      href: "",
    },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      icon: FaInstagram,
      url: settings.instagram,
    },
    {
      name: "Facebook",
      icon: FaFacebookF,
      url: settings.facebook,
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      url: settings.whatsapp
        ? `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`
        : "",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-50 text-slate-800">
      <section className="relative overflow-hidden px-5 pb-16 pt-20 sm:pt-28">
        <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-4xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm">
            <Sparkles size={16} />
            We are here for you
          </span>

          <h1 className="mt-7 font-serif text-4xl font-bold leading-tight text-slate-900 sm:text-6xl">
            Let's Stay in
            <span className="block text-sky-500">Touch.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Have a question about our products or need beauty advice? Send us a
            message. We would be happy to connect with you.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-20 lg:grid-cols-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-5 lg:col-span-2"
        >
          <div className="rounded-3xl bg-gradient-to-br from-sky-400 to-blue-500 p-8 text-white shadow-xl shadow-sky-200/60">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
              <MessageCircle size={28} />
            </div>

            <h2 className="mt-6 font-serif text-3xl font-bold">Get in Touch</h2>

            <p className="mt-3 leading-7 text-white/85">
              Your thoughts matter to us. Contact Ledora for product
              information, consultations, or any other questions.
            </p>

            <div className="mt-8 flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                if (!social.url) return null;

                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.name}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 transition hover:-translate-y-1 hover:bg-white hover:text-sky-500"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {contactItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-100"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                  <Icon size={22} />
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-800">{item.title}</h3>

                  {item.href ? (
                    <a
                      href={item.href}
                      className="mt-1 block break-words text-sm font-medium text-sky-600 hover:underline"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-1 break-words text-sm font-medium text-sky-600">
                      {loading ? "Loading..." : item.value}
                    </p>
                  )}

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-sky-100 bg-white p-6 shadow-xl shadow-sky-100/70 sm:p-10 lg:col-span-3"
        >
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-500">
              Contact form
            </p>

            <h2 className="mt-3 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              Send Us a Message
            </h2>

            <p className="mt-3 leading-7 text-slate-500">
              Fill in the form below and tell us how we can help.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Your Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-sky-100 bg-sky-50/40 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-sky-100 bg-sky-50/40 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Subject
              </label>

              <input
                id="subject"
                name="subject"
                type="text"
                maxLength={150}
                value={form.subject}
                onChange={handleChange}
                placeholder="What would you like to ask?"
                className="w-full rounded-xl border border-sky-100 bg-sky-50/40 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Your Message
              </label>

              <textarea
                id="message"
                name="message"
                rows={6}
                required
                maxLength={5000}
                value={form.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                className="w-full resize-y rounded-xl border border-sky-100 bg-sky-50/40 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-sky-400 px-6 py-4 font-semibold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-500 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {sending ? "Sending..." : "Send Message"}

              <Send
                size={18}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </button>

            {status && (
              <p
                role="status"
                className="flex items-start gap-2 text-sm leading-6 text-sky-700"
              >
                <CheckCircle2 size={18} className="mt-1 shrink-0" />
                {status}
              </p>
            )}
          </form>
        </motion.div>
      </section>

      <section className="px-5 pb-16">
        <div className="mx-auto max-w-7xl rounded-3xl border border-sky-100 bg-white/80 px-6 py-10 text-center shadow-sm sm:px-10">
          <Sparkles className="mx-auto text-sky-400" size={28} />

          <h2 className="mt-4 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
            Thank You for Choosing Ledora
          </h2>

          <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-500">
            Your beauty journey matters to us. We look forward to hearing from
            you.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Connect;
