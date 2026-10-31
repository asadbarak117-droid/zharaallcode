import { useEffect, useRef, useState } from "react";
import {
  Bot,
  X,
  Send,
  User,
  Heart,
  Mic,
  MicOff,
  Volume2,
  Languages,
  Square,
  Sparkles,
  Trash2,
  Copy,
  Check,
  ShieldCheck,
  MessageCircle,
  ChevronDown,
} from "lucide-react";

const API_URL = "https://zharaallcode.onrender.com/api";

const INITIAL_MESSAGE = {
  role: "ai",
  text: "سلام! 💙 به دستیار هوشمند LEDORA خوش آمدید.\n\nمن می‌توانم به فارسی/دری و English با شما صحبت کنم. می‌توانید درباره مدیریت فروشگاه، محصولات، زیبایی، بازاریابی یا امکانات پنل از من سؤال کنید.\n\nHello! 💙 I'm your LEDORA Admin AI Assistant. I can communicate with you in both فارسی/دری and English.",
};

const QUICK_ACTIONS = [
  {
    title: "مدیریت محصولات",
    text: "چگونه محصولات فروشگاه را بهتر مدیریت کنم؟",
  },
  {
    title: "Product Management",
    text: "How can I manage my products better?",
  },
  {
    title: "ایده بازاریابی",
    text: "برای افزایش فروش LEDORA چه ایده‌هایی داری؟",
  },
  {
    title: "Marketing Ideas",
    text: "Give me some smart marketing ideas for LEDORA.",
  },
];

const isPersianText = (text = "") => {
  return /[\u0600-\u06FF]/.test(text);
};

const getTextDirection = (text = "") => {
  return isPersianText(text) ? "rtl" : "ltr";
};

const detectSpeechLanguage = (text = "") => {
  return isPersianText(text) ? "fa-IR" : "en-US";
};

export default function AdminAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("fa-IR");

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([INITIAL_MESSAGE]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
  };

  const clearChat = () => {
    stopSpeaking();

    setMessages([INITIAL_MESSAGE]);
    setError("");
    setCopiedIndex(null);
  };

  const copyMessage = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopiedIndex(index);

      setTimeout(() => {
        setCopiedIndex(null);
      }, 1800);
    } catch {
      setError("Could not copy the message.");
    }
  };

  const sendMessage = async (customMessage = null) => {
    const userMessage = (customMessage ?? message).trim();

    if (!userMessage || isLoading) return;

    const token = localStorage.getItem("adminToken");

    if (!token) {
      setError("Please login to your admin account first.");
      return;
    }

    setMessage("");
    setError("");
    stopSpeaking();

    const updatedMessages = [
      ...messages,
      {
        role: "user",
        text: userMessage,
      },
    ];

    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const conversation = updatedMessages
        .filter(
          (item) =>
            (item.role === "user" || item.role === "ai") && item.text?.trim(),
        )
        .map((item) => ({
          role: item.role === "ai" ? "assistant" : "user",
          content: item.text.trim(),
        }));

      const response = await fetch(`${API_URL}/admin-ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: conversation,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        throw new Error("Your admin session has expired. Please login again.");
      }

      if (!response.ok) {
        throw new Error(
          data.message || "The AI service could not process your request.",
        );
      }

      if (!data.answer) {
        throw new Error("The AI returned an empty response.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.answer,
        },
      ]);
    } catch (err) {
      console.error("Admin AI Error:", err);

      setError(
        err.message || "Unable to connect to LEDORA AI. Please try again.",
      );
    } finally {
      setIsLoading(false);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const speakMessage = (text) => {
    if (!("speechSynthesis" in window)) {
      setError("Speech synthesis is not supported in this browser.");
      return;
    }

    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);

    const speechLanguage = detectSpeechLanguage(text);

    utterance.lang = speechLanguage;
    utterance.rate = speechLanguage === "fa-IR" ? 0.88 : 0.92;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();

    const matchingVoice = voices.find((voice) => {
      const voiceLang = voice.lang.toLowerCase();

      if (speechLanguage === "fa-IR") {
        return voiceLang.startsWith("fa");
      }

      return voiceLang.startsWith("en");
    });

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setError("");
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    setError("");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice recognition is not supported. Please use Google Chrome.");
      return;
    }

    recognitionRef.current?.stop();

    const recognition = new SpeechRecognition();

    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setMessage(transcript);
    };

    recognition.onerror = (event) => {
      setIsListening(false);

      if (event.error === "not-allowed") {
        setError(
          "Microphone permission was denied. Please allow microphone access.",
        );
      } else if (event.error === "no-speech") {
        setError("No speech detected. Please try again.");
      } else {
        setError(`Voice recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      setIsListening(false);
      setError("Could not start voice recognition.");
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const changeLanguage = (value) => {
    setLanguage(value);
    setShowLanguageMenu(false);
    setError("");
    stopListening();
  };

  const languageLabel = language === "fa-IR" ? "فارسی / دری" : "English";

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {isOpen && (
        <div
          className="
            absolute bottom-24 right-0
            flex h-[650px] w-[410px]
            max-w-[calc(100vw-28px)]
            flex-col overflow-hidden
            rounded-[28px]
            border border-sky-100
            bg-white
            shadow-[0_25px_80px_rgba(2,132,199,0.20)]
          "
        >
          {/* HEADER */}
          <div
            className="
              relative overflow-hidden
              bg-gradient-to-br
              from-[#0c4a6e]
              via-[#0284c7]
              to-[#38bdf8]
              px-5 py-5
              text-white
            "
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-sky-300/10" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex h-12 w-12
                    items-center justify-center
                    rounded-2xl
                    bg-white/15
                    shadow-lg
                    backdrop-blur-md
                  "
                >
                  <Bot size={27} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold">LEDORA AI</h3>

                    <span
                      className="
                        rounded-full
                        bg-green-400/20
                        px-2 py-0.5
                        text-[9px]
                        font-semibold
                        text-green-100
                      "
                    >
                      ONLINE
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-sky-100">
                    Smart Admin Assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={clearChat}
                  title="Clear conversation"
                  className="
                    rounded-xl p-2
                    text-white/80
                    transition
                    hover:bg-white/15
                    hover:text-white
                  "
                >
                  <Trash2 size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="
                    rounded-xl p-2
                    text-white/80
                    transition
                    hover:bg-white/15
                    hover:text-white
                  "
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="relative mt-4 flex items-center gap-2 text-[11px] text-sky-100">
              <ShieldCheck size={14} />
              <span>Secure admin AI assistant</span>
              <Sparkles size={13} className="ml-auto" />
            </div>
          </div>

          {/* LANGUAGE BAR */}
          <div className="relative flex items-center justify-between border-b border-sky-100 bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-sky-50 p-2 text-sky-600">
                <Languages size={16} />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Voice & Input
                </p>

                <p className="text-xs font-semibold text-gray-700">
                  {languageLabel}
                </p>
              </div>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="
                  flex items-center gap-2
                  rounded-xl
                  border border-sky-100
                  bg-sky-50
                  px-3 py-2
                  text-xs font-semibold
                  text-sky-700
                  transition
                  hover:bg-sky-100
                "
              >
                {language === "fa-IR" ? "فارسی" : "English"}

                <ChevronDown size={14} />
              </button>

              {showLanguageMenu && (
                <div
                  className="
                    absolute right-0 top-11 z-50
                    w-32
                    overflow-hidden
                    rounded-xl
                    border border-sky-100
                    bg-white
                    shadow-xl
                  "
                >
                  <button
                    type="button"
                    onClick={() => changeLanguage("fa-IR")}
                    className="
                      flex w-full items-center
                      justify-between
                      px-3 py-2.5
                      text-xs
                      hover:bg-sky-50
                    "
                  >
                    فارسی / دری
                  </button>

                  <button
                    type="button"
                    onClick={() => changeLanguage("en-US")}
                    className="
                      flex w-full items-center
                      justify-between
                      px-3 py-2.5
                      text-xs
                      hover:bg-sky-50
                    "
                  >
                    English
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* MESSAGES */}
          <div
            className="
              flex flex-1
              flex-col gap-4
              overflow-y-auto
              bg-gradient-to-b
              from-[#f0f9ff]
              via-white
              to-[#e0f2fe]
              px-4 py-5
            "
          >
            {messages.map((item, index) => {
              const isUser = item.role === "user";
              const direction = getTextDirection(item.text);

              return (
                <div
                  key={index}
                  className={`flex items-start gap-2.5 ${
                    isUser ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* AVATAR */}
                  <div
                    className={`
                      flex h-9 w-9 shrink-0
                      items-center justify-center
                      rounded-xl
                      shadow-sm
                      ${
                        isUser
                          ? "bg-sky-600 text-white"
                          : "border border-sky-100 bg-white text-sky-600"
                      }
                    `}
                  >
                    {isUser ? <User size={16} /> : <Bot size={18} />}
                  </div>

                  <div
                    className={`flex max-w-[82%] flex-col ${
                      isUser ? "items-end" : "items-start"
                    }`}
                  >
                    {/* MESSAGE */}
                    <div
                      dir={direction}
                      className={`
                        whitespace-pre-wrap
                        rounded-2xl
                        px-4 py-3
                        text-[13px]
                        leading-6
                        ${
                          isUser
                            ? "rounded-tr-md bg-sky-600 text-white shadow-md"
                            : "rounded-tl-md border border-sky-100 bg-white text-gray-700 shadow-sm"
                        }
                      `}
                    >
                      {item.text}
                    </div>

                    {/* AI ACTIONS */}
                    {!isUser && (
                      <div className="mt-1 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => speakMessage(item.text)}
                          className="
                            flex items-center gap-1
                            rounded-lg
                            px-2 py-1
                            text-[10px]
                            font-medium
                            text-sky-600
                            transition
                            hover:bg-sky-50
                          "
                        >
                          <Volume2 size={13} />

                          {isSpeaking ? "Speaking..." : "Listen"}
                        </button>

                        <button
                          type="button"
                          onClick={() => copyMessage(item.text, index)}
                          className="
                            flex items-center gap-1
                            rounded-lg
                            px-2 py-1
                            text-[10px]
                            font-medium
                            text-gray-400
                            transition
                            hover:bg-gray-100
                          "
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check size={13} />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* QUICK ACTIONS */}
            {messages.length === 1 && !isLoading && (
              <div className="mt-1">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Quick help
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {QUICK_ACTIONS.map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => sendMessage(item.text)}
                      className="
                        rounded-xl
                        border border-sky-100
                        bg-white
                        p-3
                        text-left
                        shadow-sm
                        transition
                        hover:-translate-y-0.5
                        hover:border-sky-300
                        hover:bg-sky-50
                      "
                    >
                      <p className="text-[11px] font-semibold text-sky-700">
                        {item.title}
                      </p>

                      <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-gray-400">
                        {item.text}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* THINKING */}
            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div
                  className="
                    flex h-9 w-9
                    items-center justify-center
                    rounded-xl
                    border border-sky-100
                    bg-white
                    text-sky-600
                    shadow-sm
                  "
                >
                  <Bot size={18} />
                </div>

                <div
                  className="
                    rounded-2xl
                    rounded-tl-md
                    border border-sky-100
                    bg-white
                    px-4 py-3
                    shadow-sm
                  "
                >
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-400" />

                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-500"
                      style={{ animationDelay: "120ms" }}
                    />

                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-600"
                      style={{ animationDelay: "240ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ERROR */}
          {error && (
            <div className="border-t border-red-100 bg-red-50 px-4 py-2.5 text-[11px] text-red-600">
              {error}
            </div>
          )}

          {/* INPUT */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-sky-100 bg-white p-3"
          >
            <div
              className="
                flex items-center gap-2
                rounded-2xl
                border border-sky-100
                bg-sky-50/50
                p-1.5
                transition
                focus-within:border-sky-300
                focus-within:bg-white
                focus-within:shadow-sm
              "
            >
              {/* MICROPHONE */}
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                title={isListening ? "Stop recording" : "Voice input"}
                className={`
                  flex h-10 w-10
                  shrink-0
                  items-center justify-center
                  rounded-xl
                  transition
                  ${
                    isListening
                      ? "animate-pulse bg-red-500 text-white"
                      : "text-sky-600 hover:bg-sky-100"
                  }
                `}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              {/* INPUT */}
              <input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                dir={getTextDirection(message)}
                placeholder={
                  isListening
                    ? language === "fa-IR"
                      ? "در حال شنیدن..."
                      : "Listening..."
                    : language === "fa-IR"
                      ? "پیام خود را بنویسید..."
                      : "Ask LEDORA AI..."
                }
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  px-2
                  py-2.5
                  text-sm
                  text-gray-700
                  outline-none
                  placeholder:text-gray-400
                "
              />

              {/* SEND */}
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="
                  flex h-10 w-10
                  shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-gradient-to-br
                  from-sky-600
                  to-sky-500
                  text-white
                  shadow-md
                  transition
                  hover:scale-105
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <Send size={17} />
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between px-1">
              <p className="text-[9px] text-gray-400">فارسی / دری • English</p>

              {isSpeaking && (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="
                    flex items-center gap-1
                    text-[10px]
                    font-semibold
                    text-red-500
                  "
                >
                  <Square size={11} />
                  Stop voice
                </button>
              )}

              {!isSpeaking && !isListening && (
                <p className="flex items-center gap-1 text-[9px] text-green-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  AI Ready
                </p>
              )}
            </div>
          </form>
        </div>
      )}

      {/* FLOATING AI BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open LEDORA AI"
        className="
          group
          relative
          flex h-[70px] w-[70px]
          items-center justify-center
          rounded-full
          border-4 border-white
          bg-gradient-to-br
          from-sky-500
          via-sky-600
          to-sky-500
          text-white
          shadow-[0_12px_35px_rgba(56,189,248,0.35)]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:scale-105
          hover:shadow-[0_18px_45px_rgba(56,189,248,0.45)]
        "
      >
        {isOpen ? (
          <X size={28} />
        ) : (
          <>
            <Bot
              size={36}
              strokeWidth={1.8}
              className="
                transition
                duration-300
                group-hover:rotate-6
              "
            />

            <span
              className="
                absolute
                -right-1
                -top-1
                flex h-7 w-7
                items-center justify-center
                rounded-full
                border-2 border-white
                bg-sky-400
              "
            >
              <Heart size={14} fill="white" />
            </span>

            <span
              className="
                absolute
                -left-1
                -top-2
                animate-bounce
                text-lg
              "
            >
              ✨
            </span>
          </>
        )}
      </button>
    </div>
  );
}
