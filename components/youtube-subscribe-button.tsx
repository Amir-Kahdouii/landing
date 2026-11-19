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

  const renderWidget = React.useCallback(() => {
    if (typeof window !== "undefined" && window.gapi?.ytsubscribe && containerRef.current) {
      try {
        window.gapi.ytsubscribe.go(containerRef.current);
      } catch {
        // Fallback gracefully
      }
    }
  }, []);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

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

    renderWidget();
    const timer = setTimeout(renderWidget, 1000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [renderWidget]);

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center transition-all duration-300 ${className}`}
    >
      <Script
        src="https://apis.google.com/js/platform.js"
        strategy="afterInteractive"
        onLoad={renderWidget}
      />

      {/* Official YouTube Subscribe Widget Host */}
      <div
        className={
          isWidgetMounted
            ? "flex items-center justify-center p-2 rounded-full border border-red-500/20 bg-card/80 shadow-md shadow-red-500/10 min-h-[46px] min-w-[180px]"
            : "hidden"
        }
      >
        <div
          ref={containerRef}
          className="g-ytsubscribe"
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
        className={`w-full max-w-xs sm:max-w-none sm:w-auto min-w-[200px] bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 gap-2.5 rounded-full px-6 group ${
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
