import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem("pwa-banner-dismissed")) return;

    // Detect iOS (no beforeinstallprompt)
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    // Only show iOS banner if not already in standalone mode
    const standalone = (window.navigator as unknown as { standalone?: boolean }).standalone;
    if (ios && !standalone) {
      setIsIOS(true);
      setVisible(true);
      return;
    }

    // Android/Chrome: listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    }
    setPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem("pwa-banner-dismissed", "1");
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-4 right-4 z-50 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #0F1A45 0%, #162460 100%)",
            border: "1px solid rgba(61,101,244,0.3)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          }}
        >
          {/* App icon */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #3D65F4, #0EA5E9)", boxShadow: "0 4px 12px rgba(61,101,244,0.4)" }}
          >
            <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
              <rect x="3" y="3" width="11" height="11" rx="2.5" fill="white" />
              <rect x="18" y="3" width="11" height="11" rx="2.5" fill="white" opacity="0.45" />
              <rect x="3" y="18" width="11" height="11" rx="2.5" fill="white" opacity="0.45" />
              <rect x="18" y="18" width="11" height="11" rx="2.5" fill="white" />
            </svg>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm leading-tight">Install DataNauts</p>
            {isIOS ? (
              <p className="text-blue-300 text-[10px] mt-0.5 leading-snug">
                Tap <span className="font-bold">Share</span> then <span className="font-bold">"Add to Home Screen"</span>
              </p>
            ) : (
              <p className="text-blue-300 text-[10px] mt-0.5">Add to your home screen for faster access</p>
            )}
          </div>

          {/* Install button (Android) or dismiss (iOS) */}
          {!isIOS && prompt && (
            <button
              onClick={handleInstall}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-[11px] font-bold shrink-0"
              style={{ background: "linear-gradient(135deg, #3D65F4, #0EA5E9)" }}
            >
              <Download size={12} />
              Install
            </button>
          )}

          {/* Close */}
          <button
            onClick={handleDismiss}
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-blue-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
