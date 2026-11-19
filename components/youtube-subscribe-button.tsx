"use client";

import * as React from "react";
import Script from "next/script";
import { ArrowLeft } from "lucide-react";
import { YouTubeIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    gapi?: {
      ytsubscribe?: {
        go: (container?: HTMLElement | null) => void;
        render: (
          container: HTMLElement,
          options: {
            channelid?: string;
            channel?: string;
            layout?: string;
            theme?: string;
            count?: string;
          }
        ) => void;
      };
    };
  }
}

export interface YouTubeSubscribeButtonProps {
  channelId?: string;
  channelHandle?: string;
  layout?: "default" | "full";
  theme?: "default" | "dark";
  count?: "default" | "hidden";
  fallbackHref?: string;
  fallbackLabel?: string;
  className?: string;
}

export function YouTubeSubscribeButton({
  channelId = "UC41IeMVmX2vUWKENtGb7ewQ",
  channelHandle = "amirkahdouii",
  layout = "default",
  theme = "default",
  count = "default",
  fallbackHref = "https://youtube.com/@amirkahdouii",
  fallbackLabel = "سابسکرایب در یوتیوب",
  className = "",
}: YouTubeSubscribeButtonProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isWidgetMounted, setIsWidgetMounted] = React.useState(false);

  const cleanHandle = (channelHandle || "amirkahdouii").replace(/^@/, "");
  const resolvedChannelId = channelId || "UC41IeMVmX2vUWKENtGb7ewQ";

  const initWidget = React.useCallback(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    if (window.gapi?.ytsubscribe) {
      try {
        if (typeof window.gapi.ytsubscribe.render === "function") {
          containerRef.current.innerHTML = "";
          window.gapi.ytsubscribe.render(containerRef.current, {
            channelid: resolvedChannelId,
            channel: !resolvedChannelId ? cleanHandle : undefined,
            layout,
            theme,
            count,
          });
        } else if (typeof window.gapi.ytsubscribe.go === "function") {
          window.gapi.ytsubscribe.go(containerRef.current.parentElement || containerRef.current);
        }
      } catch (err) {
        console.warn("YouTube subscribe button render notice:", err);
      }
    }
  }, [resolvedChannelId, cleanHandle, layout, theme, count]);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Check if iframe is already present
    if (el.querySelector("iframe")) {
      setIsWidgetMounted(true);
      return;
    }

    const observer = new MutationObserver(() => {
      if (el.querySelector("iframe")) {
        setIsWidgetMounted(true);
      }
    });

    observer.observe(el, { childList: true, subtree: true });

    // Initial render attempt if gapi is already on window
    initWidget();

    // Secondary attempts in case gapi is still initializing
    const t1 = setTimeout(initWidget, 600);
    const t2 = setTimeout(initWidget, 1500);
    const t3 = setTimeout(initWidget, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [initWidget]);

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center ${className}`}
    >
      <Script
        src="https://apis.google.com/js/platform.js"
        strategy="afterInteractive"
        onLoad={initWidget}
      />

      {/* Official YouTube Subscribe Widget Host */}
      {/* Kept in DOM without display:none so Google can always calculate dimensions and mount */}
      <div
        className={
          isWidgetMounted
            ? "relative opacity-100 pointer-events-auto flex items-center justify-center p-2 rounded-full border border-red-500/20 bg-card/80 shadow-md shadow-red-500/10 min-h-[46px] min-w-[180px] transition-all duration-300"
            : "absolute opacity-0 pointer-events-none -z-10 min-h-[44px] min-w-[160px]"
        }
      >
        <div
          ref={containerRef}
          className="g-ytsubscribe flex items-center justify-center"
          data-channelid={resolvedChannelId}
          data-channel={!resolvedChannelId ? cleanHandle : undefined}
          data-layout={layout}
          data-theme={theme}
          data-count={count}
        />
      </div>

      {/* Accessible Fallback Button (visible while loading, in SSR, Vitest, or if ad-blocked) */}
      <Button
        href={fallbackHref}
        target="_blank"
        rel="noopener noreferrer"
        size="lg"
        className={`w-full max-w-xs sm:max-w-none sm:w-auto min-w-[200px] bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 gap-2.5 rounded-full px-6 group transition-all duration-300 ${
          isWidgetMounted ? "sr-only" : "inline-flex"
        }`}
      >
        <YouTubeIcon className="size-4 shrink-0 text-white" />
        <span>{fallbackLabel}</span>
        <ArrowLeft className="size-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-1" />
      </Button>
    </div>
  );
}
