import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Mic, Volume2, X, Play, Square } from "lucide-react";

type SheetMode = "read" | "command" | null;

export const HeaderVoiceButton: React.FC<{ variant?: "default" | "inverted" }> = ({
  variant = "default",
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<SheetMode>(null);
  const [isActive, setIsActive] = useState(false); // UI-only “running” state

  const containerRef = useRef<HTMLDivElement>(null);
  const micButtonRef = useRef<HTMLButtonElement>(null);

  // Popover position (viewport anchored)
  const [pos, setPos] = useState<{ top: number; right: number }>({
    top: 0,
    right: 0,
  });

  const computePopoverPosition = () => {
    const btn = micButtonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const gap = 12;

    setPos({
      top: rect.bottom + gap,
      right: window.innerWidth - rect.right,
    });
  };

  useLayoutEffect(() => {
    if (popoverOpen) computePopoverPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popoverOpen]);

  useEffect(() => {
    if (!popoverOpen) return;

    const onResize = () => computePopoverPosition();
    const onScroll = () => computePopoverPosition();

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popoverOpen]);

  // Close popover when clicking outside (but allow clicks on sheet overlay)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Esc closes popover or sheet
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;

      if (sheetMode) {
        setSheetMode(null);
        setIsActive(false);
      } else if (popoverOpen) {
        setPopoverOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [popoverOpen, sheetMode]);

  const openSheet = (mode: Exclude<SheetMode, null>) => {
    setPopoverOpen(false);
    setSheetMode(mode);
    setIsActive(false);
  };

  const closeSheet = () => {
    setSheetMode(null);
    setIsActive(false);
  };

  const sheetTitle = sheetMode === "read" ? "Read Screen" : "Voice Command";
  const sheetDescription =
    sheetMode === "read"
      ? "UI preview: this would read the current screen aloud."
      : "UI preview: this would listen for voice commands to control the app.";

  const primaryLabel =
    sheetMode === "read"
      ? isActive
        ? "Stop Reading"
        : "Start Reading"
      : isActive
        ? "Stop Listening"
        : "Start Listening";

  // ✅ USE variant to style the mic button for emergency (inverted) headers
  const micBtnClass =
    variant === "inverted"
      ? `
        flex items-center justify-center
        w-12 h-12
        rounded-xl
        border-2 border-white/70
        bg-white/15
        hover:bg-white/20
        active:bg-white/25
        transition-colors
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-white
      `
      : `
        flex items-center justify-center
        w-12 h-12
        rounded-xl
        border-2 border-[var(--border)]
        bg-[var(--bg-surface)]
        hover:bg-[var(--bg-primary)]
        active:bg-[var(--bg-primary)]
        transition-colors
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--focus-ring)]
      `;

  return (
    <>
      <div className="relative" ref={containerRef}>
        {/* Mic Button (header right) */}
        <button
          ref={micButtonRef}
          type="button"
          onClick={() => setPopoverOpen((p) => !p)}
          aria-label="Voice options"
          aria-expanded={popoverOpen}
          className={micBtnClass}
        >
          {/* ✅ Make icon white in inverted mode so it shows on the red header */}
          <Mic size={80} className={variant === "inverted" ? "text-white" : ""} />
        </button>

        {/* Popover Panel */}
        {popoverOpen && (
          <div
            className="
              fixed
              bg-[var(--bg-surface)]
              border-2 border-[var(--border)]
              rounded-xl
              shadow-lg
              p-4
              z-[9999]
            "
            style={{
              top: pos.top,
              right: pos.right,
              width: "min(520px, 92vw)",
            }}
            role="dialog"
            aria-label="Voice options"
          >
            {/* Heading */}
            <div className="mb-3">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Voice Options
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Choose how you want to use voice
              </p>
            </div>

            <div className="space-y-3">
              {/* Read Screen */}
              <button
                onClick={() => openSheet("read")}
                className="
                  w-full flex items-center gap-4
                  p-4 rounded-lg
                  border-2 border-[var(--border)]
                  bg-[var(--alert-info-bg)]
                  hover:border-[var(--button-primary)]
                  transition-colors
                  text-left
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[var(--focus-ring)]
                "
              >
                <Volume2
                  size={22}
                  className="text-[var(--button-primary)] flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">
                    Read Screen
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    Have the app read this page aloud
                  </div>
                </div>
              </button>

              {/* Voice Command */}
              <button
                onClick={() => openSheet("command")}
                className="
                  w-full flex items-center gap-4
                  p-4 rounded-lg
                  border-2 border-[var(--border)]
                  bg-[var(--bg-primary)]
                  hover:border-[var(--button-primary)]
                  transition-colors
                  text-left
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[var(--focus-ring)]
                "
              >
                <Mic
                  size={22}
                  className="text-[var(--button-primary)] flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">
                    Voice Command
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    Control the app using your voice
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sheet Modal */}
      {sheetMode && (
        <div
          className="fixed inset-0 z-[10000]"
          role="dialog"
          aria-modal="true"
          aria-label={sheetTitle}
        >
          {/* Dim overlay */}
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={closeSheet}
            aria-label="Close voice panel"
          />

          {/* Sheet */}
          <div
            className="
              absolute left-0 right-0 bottom-0
              bg-[var(--bg-surface)]
              border-t-2 border-[var(--border)]
              rounded-t-2xl
              shadow-2xl
            "
            style={{
              paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
            }}
          >
            {/* Drag handle */}
            <div className="pt-3 pb-2 flex justify-center">
              <div className="h-1.5 w-16 rounded-full bg-[var(--border)]" />
            </div>

            <div
              className="px-5"
              style={{
                paddingLeft: "calc(20px + env(safe-area-inset-left))",
                paddingRight: "calc(20px + env(safe-area-inset-right))",
              }}
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                    {sheetTitle}
                  </h2>
                  <p className="mt-1 text-[var(--text-secondary)]">
                    {sheetDescription}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeSheet}
                  className="
                    flex items-center justify-center
                    w-12 h-12
                    rounded-xl
                    border-2 border-[var(--border)]
                    bg-[var(--bg-primary)]
                    hover:border-[var(--button-primary)]
                    transition-colors
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[var(--focus-ring)]
                  "
                  aria-label="Close"
                >
                  <X 
                  size={30} 
                  className="text-[var(--text-primary)]"
                  aria-hidden="true"
                  />
                </button>
              </div>

              {/* Status card */}
              <div className="mt-5 border-2 border-[var(--border)] rounded-xl p-4 bg-[var(--bg-primary)]">
                <p className="font-semibold text-[var(--text-primary)]">
                  Status:{" "}
                  <span className="font-bold">
                    {isActive ? "ON" : "OFF"}
                  </span>
                </p>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  UI-only preview. Buttons below simulate starting/stopping.
                </p>
              </div>

              {/* Big actions (low-vision friendly) */}
              <div className="mt-5 space-y-3 pb-5">
                <button
                  type="button"
                  onClick={() => setIsActive((v) => !v)}
                  className="
                    w-full h-16
                    rounded-xl
                    border-2
                    border-[var(--button-primary)]
                    bg-[var(--button-primary)]
                    text-white
                    font-bold text-lg
                    flex items-center justify-center gap-3
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[var(--focus-ring)]
                  "
                >
                  {isActive ? <Square size={22} /> : <Play size={22} />}
                  {primaryLabel}
                </button>

                <button
                  type="button"
                  onClick={closeSheet}
                  className="
                    w-full h-16
                    rounded-xl
                    border-2 border-[var(--border)]
                    bg-[var(--bg-surface)]
                    text-[var(--text-primary)]
                    font-bold text-lg
                    hover:bg-[var(--bg-primary)]
                    transition-colors
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[var(--focus-ring)]
                  "
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
