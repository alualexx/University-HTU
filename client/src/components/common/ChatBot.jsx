import React, { useState, useRef, useEffect } from "react";
import {
  Box, IconButton, Typography, TextField, Avatar, Chip,
  Slide, Paper, Tooltip, Select, MenuItem, FormControl,
  InputAdornment, Fade,
} from "@mui/material";
import {
  Close, Send, SmartToy, Person, Translate, ExpandLess,
  Psychology,
} from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

/* ── Typing bubble animation ────────────────────────────────────────── */
const TypingDots = () => (
  <Box sx={{ display: "flex", gap: "5px", alignItems: "center", px: 1, py: 0.5 }}>
    {[0, 1, 2].map(i => (
      <Box key={i} sx={{
        width: 7, height: 7, borderRadius: "50%", bgcolor: "#8b5cf6",
        animation: "bounce 1.2s infinite",
        animationDelay: `${i * 0.2}s`,
        "@keyframes bounce": {
          "0%, 80%, 100%": { transform: "scale(0.6)", opacity: 0.5 },
          "40%": { transform: "scale(1)", opacity: 1 },
        },
      }} />
    ))}
  </Box>
);

/* ── Message Bubble ─────────────────────────────────────────────────── */
function Bubble({ msg, isDark }) {
  const isBot = msg.sender === "bot";
  return (
    <Fade in timeout={300}>
      <Box sx={{ display: "flex", justifyContent: isBot ? "flex-start" : "flex-end", mb: 1.5, alignItems: "flex-end", gap: 1 }}>
        {isBot && (
          <Avatar sx={{ width: 28, height: 28, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", flexShrink: 0 }}>
            <SmartToy sx={{ fontSize: 15 }} />
          </Avatar>
        )}
        <Box sx={{
          maxWidth: "78%",
          px: 2, py: 1.2,
          borderRadius: isBot ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
          background: isBot
            ? (isDark ? "rgba(99,102,241,0.18)" : "rgba(99,102,241,0.09)")
            : "linear-gradient(135deg,#6366f1,#8b5cf6)",
          color: isBot ? (isDark ? "#e2e8f0" : "#1e293b") : "white",
          boxShadow: isBot ? "none" : "0 4px 12px rgba(99,102,241,0.35)",
          border: isBot ? (isDark ? "1px solid rgba(99,102,241,0.25)" : "1px solid rgba(99,102,241,0.12)") : "none",
        }}>
          <Typography variant="body2" sx={{ fontSize: "0.82rem", lineHeight: 1.5, fontWeight: isBot ? 500 : 600, direction: "auto" }}>
            {msg.text}
          </Typography>
          {msg.time && (
            <Typography variant="caption" sx={{ opacity: 0.55, fontSize: "0.65rem", display: "block", mt: 0.3, textAlign: "right" }}>
              {msg.time}
            </Typography>
          )}
        </Box>
        {!isBot && (
          <Avatar sx={{ width: 28, height: 28, background: "linear-gradient(135deg,#3b82f6,#2563eb)", flexShrink: 0 }}>
            <Person sx={{ fontSize: 15 }} />
          </Avatar>
        )}
      </Box>
    </Fade>
  );
}

/* ── Main Chatbot Component ─────────────────────────────────────────── */
export default function ChatBot() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { language, setLanguage, t, getBotResponse } = useLanguage();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  /* Initial greeting */
  useEffect(() => {
    setMessages([
      {
        id: 0,
        sender: "bot",
        text: t("chatGreeting"),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [language]);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (open) { setUnread(0); inputRef.current?.focus(); }
  }, [messages, open]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Simulate bot thinking delay
    setTimeout(() => {
      const answer = getBotResponse(text);
      setTyping(false);
      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: answer,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages(prev => [...prev, botMsg]);
      if (!open) setUnread(c => c + 1);
    }, 900 + Math.random() * 600);
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const glassPanel = {
    background: isDark ? "rgba(10,15,30,0.92)" : "rgba(255,255,255,0.97)",
    backdropFilter: "blur(24px)",
    border: isDark ? "1px solid rgba(99,102,241,0.2)" : "1px solid rgba(99,102,241,0.18)",
    boxShadow: isDark ? "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.15)" : "0 24px 80px rgba(99,102,241,0.18)",
  };

  return (
    <>
      {/* ── Chat Panel ─────────────────────────────────────────────── */}
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Paper elevation={0} sx={{
          position: "fixed",
          bottom: 88,
          right: 24,
          width: { xs: "calc(100vw - 48px)", sm: 370 },
          height: 520,
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 2000,
          ...glassPanel,
        }}>
          {/* Header */}
          <Box sx={{
            px: 2.5, py: 2,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ width: 38, height: 38, borderRadius: 2.5, bgcolor: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Psychology sx={{ color: "white", fontSize: 22 }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={900} color="white" sx={{ lineHeight: 1.2 }}>{t("chatTitle")}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#4ade80", animation: "pulse 2s infinite", "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.5 } } }} />
                  <Typography variant="caption" color="rgba(255,255,255,0.8)" fontWeight={700}>{t("chatSubtitle")}</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Language Switcher in Header */}
              <LanguageSwitcher variant="icon" />
              <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: "white", bgcolor: "rgba(255,255,255,0.12)", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}>
                <Close sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>

          {/* Quick suggestion chips */}
          {messages.length <= 1 && (
            <Box sx={{ px: 2, pt: 1.5, pb: 0.5, display: "flex", gap: 1, flexWrap: "wrap", flexShrink: 0 }}>
              {[
                { key: "chatAdmission", text: t("chatAdmission") },
                { key: "chatCourses", text: t("chatCourses") },
                { key: "chatFees", text: t("chatFees") },
                { key: "chatGrades", text: t("chatGrades") }
              ].map(item => (
                <Chip
                  key={item.key}
                  label={item.text}
                  size="small"
                  onClick={() => { setInput(item.text); setTimeout(sendMessage, 50); }}
                  sx={{ fontSize: "0.7rem", fontWeight: 700, bgcolor: isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.09)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.2)", cursor: "pointer", "&:hover": { bgcolor: "rgba(99,102,241,0.2)" } }}
                />
              ))}
            </Box>
          )}

          {/* Messages */}
          <Box sx={{ flexGrow: 1, overflowY: "auto", px: 2, py: 1.5,
            "&::-webkit-scrollbar": { width: 4 },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": { bgcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(99,102,241,0.15)", borderRadius: 2 },
          }}>
            {messages.map(msg => <Bubble key={msg.id} msg={msg} isDark={isDark} />)}
            {typing && (
              <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, mb: 1 }}>
                <Avatar sx={{ width: 28, height: 28, background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                  <SmartToy sx={{ fontSize: 15 }} />
                </Avatar>
                <Box sx={{ px: 1.5, py: 0.8, borderRadius: "4px 16px 16px 16px", background: isDark ? "rgba(99,102,241,0.18)" : "rgba(99,102,241,0.09)", border: isDark ? "1px solid rgba(99,102,241,0.25)" : "1px solid rgba(99,102,241,0.12)" }}>
                  <TypingDots />
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box sx={{ px: 2, pb: 2, pt: 1, flexShrink: 0, borderTop: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(99,102,241,0.08)" }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TextField
                inputRef={inputRef}
                fullWidth
                size="small"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={t("chatPlaceholder")}
                multiline
                maxRows={3}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    fontSize: "0.85rem",
                    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(99,102,241,0.04)",
                    "& fieldset": { borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(99,102,241,0.15)" },
                    "&:hover fieldset": { borderColor: "#6366f1" },
                    "&.Mui-focused fieldset": { borderColor: "#6366f1", borderWidth: 2 },
                  },
                  "& .MuiInputBase-input": { direction: "auto" },
                }}
              />
              <IconButton
                onClick={sendMessage}
                disabled={!input.trim()}
                sx={{
                  width: 40, height: 40, borderRadius: 2.5, flexShrink: 0,
                  background: input.trim() ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : (isDark ? "rgba(255,255,255,0.05)" : "rgba(99,102,241,0.07)"),
                  color: input.trim() ? "white" : (isDark ? "rgba(255,255,255,0.3)" : "rgba(99,102,241,0.3)"),
                  boxShadow: input.trim() ? "0 4px 12px rgba(99,102,241,0.4)" : "none",
                  transition: "all 0.2s",
                  "&:hover": { transform: input.trim() ? "scale(1.05)" : "none" },
                }}
              >
                <Send sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
            <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 0.8, opacity: 0.4, fontSize: "0.62rem", fontWeight: 600 }}>
              {t("chatFooter")}
            </Typography>
          </Box>
        </Paper>
      </Slide>

      {/* ── FAB Toggle Button ───────────────────────────────────────── */}
      <Tooltip title={open ? t("chatClose") : t("chatOpen")} placement="left">
        <Box
          onClick={() => setOpen(o => !o)}
          sx={{
            position: "fixed",
            bottom: 24, right: 24,
            width: 58, height: 58,
            borderRadius: "50%",
            background: open ? "linear-gradient(135deg,#ef4444,#dc2626)" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(99,102,241,0.45)",
            zIndex: 2001,
            transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            "&:hover": { transform: "scale(1.1)", boxShadow: "0 12px 32px rgba(99,102,241,0.55)" },
            "&:active": { transform: "scale(0.95)" },
          }}
        >
          <Box sx={{ transition: "all 0.3s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
            {open
              ? <Close sx={{ color: "white", fontSize: 26 }} />
              : <Psychology sx={{ color: "white", fontSize: 26 }} />
            }
          </Box>
          {/* Unread badge */}
          {!open && unread > 0 && (
            <Box sx={{
              position: "absolute", top: -4, right: -4,
              width: 20, height: 20, borderRadius: "50%",
              bgcolor: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid white", animation: "bounce2 2s infinite",
              "@keyframes bounce2": { "0%,100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.2)" } },
            }}>
              <Typography sx={{ fontSize: "0.6rem", fontWeight: 900, color: "white" }}>{unread}</Typography>
            </Box>
          )}
          {/* Ripple ring */}
          {!open && (
            <Box sx={{
              position: "absolute", inset: -4,
              borderRadius: "50%", border: "2px solid rgba(99,102,241,0.4)",
              animation: "ring 2s infinite",
              "@keyframes ring": { "0%": { transform: "scale(0.9)", opacity: 1 }, "100%": { transform: "scale(1.4)", opacity: 0 } },
            }} />
          )}
        </Box>
      </Tooltip>
    </>
  );
}
