"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Minimize2 } from "lucide-react";

/**
 * NeXFlowX Companion — AI Orb + Terminal Chat Panel
 * Abstract AI representation (pulsing geometric orb)
 * Rests at bottom-right, non-intrusive
 * Opens a clean terminal-style chat panel on interaction
 * Floats on Y axis to simulate "alive" state
 */

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

const AI_RESPONSES: Record<string, string> = {
  default:
    "NeXFlowX AI-Engine online. I can help you understand Atlas Global Core infrastructure, routing logic, compliance frameworks, or B2B settlement workflows. What would you like to explore?",
  hello:
    "Greetings. The NeXFlowX context engine is monitoring all active corridors. Current signal: all systems nominal across EU, UK, and BR regions.",
  routing:
    "The routing engine evaluates 47+ variables in real-time — jurisdiction, liquidity pools, FX rates, compliance state, and settlement speed. Based on these vectors, NeXFlowX dynamically selects the optimal corridor: Viva.com for SEPA/EU settlements, Onramp.money for USDT global settlement, or Stripe for universal card processing.",
  compliance:
    "Dynamic compliance is baked into every transaction layer. The AI engine cross-references jurisdiction-specific regulations (PSD2, PCI-DSS, LGPD) in real-time. Transaction patterns are continuously monitored for AML/KYC triggers. Compliance state is never static — it adapts to regulatory changes within minutes.",
  marketplace:
    "The Private B2B Marketplace operates as a closed ecosystem. Three primary asset classes: Compute Power (GPU reselling via verified providers), Agentic Workflows (pre-built AI agent pipelines), and Digital IP Assets. Atlas Core acts as the settlement layer — all transactions are escrowed, verified, and settled through the NeXFlowX engine.",
  infrastructure:
    "Atlas Global Core is a context-aware orchestration layer. It sits between your business logic and the financial infrastructure. Think of it as the nervous system for B2B commerce —感知, routing, settling, and complying — all in one unified API surface.",
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("route") || lower.includes("payment") || lower.includes("settle"))
    return AI_RESPONSES.routing;
  if (lower.includes("complian") || lower.includes("regulat") || lower.includes("aml") || lower.includes("kyc"))
    return AI_RESPONSES.compliance;
  if (lower.includes("market") || lower.includes("gpu") || lower.includes("agentic") || lower.includes("ip"))
    return AI_RESPONSES.marketplace;
  if (lower.includes("infra") || lower.includes("architect") || lower.includes("atlas") || lower.includes("what"))
    return AI_RESPONSES.infrastructure;
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("status"))
    return AI_RESPONSES.hello;
  return AI_RESPONSES.default;
}

export function NeXFlowXCompanion() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "ai",
      content:
        "> NeXFlowX Companion initialized.\n> Context-aware orchestration layer active.\n> Monitoring 47 settlement corridors.\n\nType a query to begin.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = getAIResponse(userMsg.content);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: `> ${aiResponse}`,
        timestamp: new Date(),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, aiMsg]);
    }, 800 + Math.random() * 1200);
  };

  return (
    <>
      {/* Orb — always visible, fixed bottom-right */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[9999] cursor-pointer group"
            aria-label="Open NeXFlowX Companion"
          >
            {/* Floating animation wrapper */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Outer pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  width: 64,
                  height: 64,
                  left: -4,
                  top: -4,
                  border: "1px solid rgba(57,255,20,0.3)",
                }}
              />

              {/* Second pulse ring */}
              <motion.div
                className="absolute rounded-full"
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.15, 0, 0.15],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                style={{
                  width: 56,
                  height: 56,
                  left: 0,
                  top: 0,
                  border: "1px solid rgba(0,240,255,0.15)",
                }}
              />

              {/* Main orb */}
              <motion.div
                className="relative w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle at 35% 35%, rgba(57,255,20,0.25) 0%, rgba(57,255,20,0.08) 40%, rgba(0,240,255,0.04) 70%, rgba(5,5,5,0.9) 100%)",
                  border: "1px solid rgba(57,255,20,0.2)",
                  boxShadow:
                    "0 0 20px rgba(57,255,20,0.1), 0 0 40px rgba(57,255,20,0.05), inset 0 0 15px rgba(57,255,20,0.05)",
                }}
                whileHover={{
                  scale: 1.1,
                  boxShadow:
                    "0 0 30px rgba(57,255,20,0.2), 0 0 60px rgba(57,255,20,0.1), inset 0 0 20px rgba(57,255,20,0.1)",
                }}
              >
                {/* Inner geometric ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute w-8 h-8"
                >
                  <svg viewBox="0 0 32 32" className="w-full h-full">
                    <circle
                      cx="16"
                      cy="16"
                      r="12"
                      fill="none"
                      stroke="rgba(57,255,20,0.3)"
                      strokeWidth="0.5"
                      strokeDasharray="3 5"
                    />
                  </svg>
                </motion.div>

                {/* Core dot */}
                <motion.div
                  animate={{
                    opacity: [0.6, 1, 0.6],
                    scale: [0.8, 1.1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(57,255,20,1) 0%, rgba(57,255,20,0.4) 60%, transparent 100%)",
                    boxShadow: "0 0 8px rgba(57,255,20,0.6)",
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-[9999] w-[380px] max-w-[calc(100vw-48px)] h-[520px] max-h-[calc(100vh-120px)] flex flex-col rounded-lg overflow-hidden"
            style={{
              background: "#080808",
              border: "1px solid rgba(57,255,20,0.12)",
              boxShadow:
                "0 0 40px rgba(0,0,0,0.8), 0 0 80px rgba(57,255,20,0.04), 0 4px 30px rgba(0,0,0,0.5)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 shrink-0"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(57,255,20,0.02)",
              }}
            >
              <div className="flex items-center gap-3">
                {/* Mini orb */}
                <div className="relative w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 35%, rgba(57,255,20,0.3) 0%, rgba(5,5,5,0.95) 100%)",
                    border: "1px solid rgba(57,255,20,0.2)",
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "rgba(57,255,20,1)",
                      boxShadow: "0 0 6px rgba(57,255,20,0.8)",
                    }}
                  />
                </div>
                <div>
                  <span className="text-xs font-mono-data text-matrix-green tracking-wider font-bold block">
                    NEXFLOWX
                  </span>
                  <span className="text-[9px] font-mono-data text-steel-silver/40 tracking-wider">
                    AI COMPANION
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded transition-colors hover:bg-white/5 text-steel-silver/40 hover:text-steel-silver/80"
                  aria-label="Minimize"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded transition-colors hover:bg-white/5 text-steel-silver/40 hover:text-danger"
                  aria-label="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar"
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2.5 rounded-md text-xs font-mono-data leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-matrix-green/10 border border-matrix-green/15 text-matrix-green/90"
                        : "text-steel-silver/70"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 px-3 py-2"
                >
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-matrix-green/50"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono-data text-steel-silver/30 tracking-wider">
                    PROCESSING
                  </span>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div
              className="shrink-0 px-3 py-3"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(5,5,5,0.5)",
              }}
            >
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center rounded px-3 py-2"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span className="text-matrix-green/40 mr-2 text-xs font-mono-data">&gt;</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSend();
                    }}
                    placeholder="Ask about routing, compliance, infrastructure..."
                    className="flex-1 bg-transparent text-xs font-mono-data text-steel-silver/80 placeholder:text-steel-silver/20 focus:outline-none"
                  />
                </div>
                <motion.button
                  onClick={handleSend}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded transition-colors"
                  style={{
                    background: input.trim() ? "rgba(57,255,20,0.1)" : "transparent",
                    border: `1px solid ${input.trim() ? "rgba(57,255,20,0.2)" : "rgba(255,255,255,0.06)"}`,
                  }}
                >
                  <Send
                    className="w-3.5 h-3.5"
                    style={{
                      color: input.trim() ? "rgba(57,255,20,0.8)" : "rgba(255,255,255,0.2)",
                    }}
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
