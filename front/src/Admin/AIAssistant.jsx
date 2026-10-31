import { useEffect, useRef, useState } from "react";

import {
  Bot,
  X,
  Send,
  Sparkles,
  User,
  Heart,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  Square,
} from "lucide-react";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState("");

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello! 💜 I'm your Beauty Online Shop AI Assistant. How can I help you today?",
    },
  ]);

  // Automatically scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Stop microphone and speech when component is removed
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Send message
  const handleSend = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: message.trim(),
      },
    ]);

    setMessage("");
  };

  // Detect language from text for voice reading
  const getSpeechLanguage = (text) => {
    const persianPattern = /[\u0600-\u06FF]/;

    return persianPattern.test(text) ? "fa-IR" : "en-US";
  };

  // Read message aloud
  const speakMessage = (text) => {
    if (!("speechSynthesis" in window)) {
      setVoiceError("Speech reading is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = getSpeechLanguage(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Stop reading aloud
  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
  };

  // Start voice recognition
  const startListening = () => {
    setVoiceError("");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError(
        "Voice recognition is not supported. Please use Google Chrome.",
      );
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();

    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceError("");
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
        setVoiceError(
          "Microphone permission denied. Please allow microphone access.",
        );
      } else if (event.error === "no-speech") {
        setVoiceError("No speech detected. Please try again.");
      } else {
        setVoiceError("Voice recognition error: " + event.error);
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
      setVoiceError("Could not start the microphone. Please try again.");
    }
  };

  // Stop listening
  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  // Change recognition language
  const changeLanguage = (value) => {
    setLanguage(value);
    setVoiceError("");
    stopListening();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-24 right-0 flex h-[540px] w-[360px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-purple-700 via-purple-600 to-pink-500 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="relative rounded-2xl bg-white/20 p-3">
                <Bot size={25} />

                <span className="absolute -right-1 -top-1 text-xs">✨</span>
              </div>

              <div>
                <h3 className="font-bold">Cutie AI Assistant</h3>
                <p className="text-xs text-purple-100">Your Beauty Helper 💜</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 transition hover:bg-white/20"
              aria-label="Close assistant"
            >
              <X size={21} />
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center justify-between border-b border-purple-100 bg-white px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Languages size={17} className="text-purple-600" />
              Voice Language
            </div>

            <div className="flex gap-1 rounded-xl bg-purple-50 p-1">
              <button
                type="button"
                onClick={() => changeLanguage("en-US")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  language === "en-US"
                    ? "bg-purple-600 text-white"
                    : "text-purple-700 hover:bg-purple-100"
                }`}
              >
                English
              </button>

              <button
                type="button"
                onClick={() => changeLanguage("fa-IR")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  language === "fa-IR"
                    ? "bg-purple-600 text-white"
                    : "text-purple-700 hover:bg-purple-100"
                }`}
              >
                فارسی
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-gradient-to-b from-purple-50 to-pink-50/50 p-4">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 ${
                  item.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`rounded-full p-2 ${
                    item.role === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-white text-purple-600 shadow-sm"
                  }`}
                >
                  {item.role === "user" ? (
                    <User size={16} />
                  ) : (
                    <Bot size={17} />
                  )}
                </div>

                <div className="max-w-[80%]">
                  <div
                    className={`rounded-2xl px-3 py-2 text-sm leading-6 ${
                      item.role === "user"
                        ? "rounded-tr-sm bg-purple-600 text-white"
                        : "rounded-tl-sm bg-white text-gray-700 shadow-sm"
                    }`}
                  >
                    {item.text}
                  </div>

                  {item.role === "ai" && (
                    <button
                      type="button"
                      onClick={() => speakMessage(item.text)}
                      className="mt-1 flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-purple-600 hover:bg-purple-100"
                    >
                      <Volume2 size={14} />
                      Listen
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Voice Error */}
          {voiceError && (
            <div className="border-t border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
              {voiceError}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 border-t border-purple-100 bg-white p-3"
          >
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              title={isListening ? "Stop recording" : "Speak"}
              className={`rounded-xl p-3 text-white transition ${
                isListening
                  ? "animate-pulse bg-red-500"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
            >
              {isListening ? <MicOff size={19} /> : <Mic size={19} />}
            </button>

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isListening ? "Listening..." : "Write or speak..."}
              className="min-w-0 flex-1 rounded-xl border border-purple-100 px-3 py-3 text-sm outline-none transition focus:border-purple-400"
            />

            <button
              type="submit"
              disabled={!message.trim()}
              className="rounded-xl bg-purple-600 p-3 text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </form>

          {/* Voice Controls */}
          <div className="flex items-center justify-between border-t border-purple-100 bg-purple-50 px-4 py-2">
            <div className="flex items-center gap-2 text-xs text-purple-600">
              <span
                className={`h-2 w-2 rounded-full ${
                  isListening ? "animate-pulse bg-red-500" : "bg-green-500"
                }`}
              />
              {isListening ? "Listening to you..." : "Voice assistant ready"}
            </div>

            {isSpeaking && (
              <button
                type="button"
                onClick={stopSpeaking}
                className="flex items-center gap-1 text-xs font-semibold text-red-500"
              >
                <Square size={13} />
                Stop voice
              </button>
            )}
          </div>
        </div>
      )}

      {/* Cute Floating Robot */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Assistant"
        className="group relative flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 text-white shadow-xl transition duration-300 hover:-translate-y-2 hover:scale-110 hover:shadow-purple-300"
      >
        {isOpen ? (
          <X size={29} />
        ) : (
          <>
            <Bot
              size={37}
              strokeWidth={1.8}
              className="transition duration-300 group-hover:rotate-12"
            />

            <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-pink-400">
              <Heart size={14} fill="white" />
            </span>

            <span className="absolute -left-2 -top-2 animate-bounce text-lg">
              ✨
            </span>
          </>
        )}
      </button>
    </div>
  );
}
