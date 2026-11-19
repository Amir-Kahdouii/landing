"use client";

import * as React from "react";
import { ArrowLeft, Play, X, ExternalLink } from "lucide-react";
import { SiteConfig, siteConfig as defaultSiteConfig } from "@/lib/site-config";
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { YouTubeIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { extractYouTubeVideoId } from "@/lib/youtube";

export interface FeaturedVideosProps {
  config?: SiteConfig;
  className?: string;
}

export function FeaturedVideos({
  config = defaultSiteConfig,
  className = "",
}: FeaturedVideosProps) {
  const videos = config.featuredVideos;
  const [activeVideoId, setActiveVideoId] = React.useState<string | null>(null);

  // Close modal on Escape key and prevent background scrolling
  React.useEffect(() => {
    if (!activeVideoId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveVideoId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [activeVideoId]);

  if (!videos || videos.length === 0) {
    return null;
  }

  const activeVideo = videos.find((v) => v.id === activeVideoId);

  return (
    <section
      aria-label="ویدیوهای برگزیده آموزشی"
      className={cn("w-full py-8 sm:py-12", className)}
    >
      {/* Section Header */}
      <div className="mb-8 flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          ویدیوهای برگزیده آموزشی
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base max-w-xl">
          منتخبی از آموزش‌های عمیق مهندسی نرم‌افزار، معماری وب و کدنویسی کاربردی در یوتیوب
        </p>
      </div>

      {/* Featured Video Cards Grid */}
      <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {videos.map((video) => (
          <Card
            key={video.id}
            className={cn(
              "group relative flex flex-col justify-between overflow-hidden h-full",
              "border-border/80 bg-card/75 backdrop-blur-xl shadow-sm",
              "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:border-red-500/30"
            )}
          >
            {/* Subtle top ambient red sheen */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-12 start-1/2 -z-10 h-24 w-48 -translate-x-1/2 rounded-full bg-gradient-to-b from-red-500/10 to-transparent blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />

            <div>
              {/* Video Thumbnail Facade (Click to open large player popup) */}
              <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl bg-neutral-900">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveVideoId(video.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveVideoId(video.id);
                    }
                  }}
                  aria-label={`پخش ویدیوی ${video.title}`}
                  className="relative size-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Dark gradient scrim */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                  />

                  {/* Topic Tag on Thumbnail */}
                  <div className="absolute top-3 end-3 z-10">
                    <Badge
                      variant="secondary"
                      className="border-white/20 bg-black/60 text-white backdrop-blur-md text-xs font-semibold px-2.5 py-0.5"
                    >
                      {video.tag}
                    </Badge>
                  </div>

                  {/* Video Duration Badge */}
                  <div className="absolute bottom-3 start-3 z-10 flex items-center gap-1.5 rounded-md bg-black/75 px-2.5 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-md border border-white/10">
                    <span>{video.duration}</span>
                  </div>

                  {/* Play Button Overlay */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div className="flex size-12 sm:size-14 items-center justify-center rounded-full bg-red-600/90 text-white shadow-xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-red-600">
                      <Play className="size-5 sm:size-6 fill-white text-white translate-x-[-1px]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Header & Content */}
              <CardHeader className="gap-2 p-5 pb-2">
                <CardTitle className="text-base sm:text-lg font-bold text-foreground leading-normal group-hover:text-red-600 transition-colors line-clamp-2">
                  {video.title}
                </CardTitle>
                <CardDescription className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
                  {video.description}
                </CardDescription>
              </CardHeader>
            </div>

            {/* Action Buttons in Footer: Open Popup Player or Watch on YouTube */}
            <CardFooter className="p-5 pt-4">
              <div className="flex w-full items-center gap-2.5">
                {/* Popup Play Button */}
                <button
                  type="button"
                  onClick={() => setActiveVideoId(video.id)}
                  aria-label={`پخش در صفحه: ${video.title}`}
                  className={cn(
                    "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium",
                    "transition-all duration-200 cursor-pointer shadow-xs",
                    "border border-border/70 bg-card/60 text-foreground hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-600"
                  )}
                >
                  <Play className="size-3.5 fill-current shrink-0 text-red-600" />
                  <span>پخش در صفحه</span>
                </button>

                {/* External YouTube Link Button */}
                <Button
                  href={video.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`تماشا در یوتیوب: ${video.title}`}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium",
                    "border border-border/70 bg-card/60 text-foreground shadow-xs shrink-0",
                    "transition-all duration-200",
                    "hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-600",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <YouTubeIcon className="size-4 shrink-0 text-red-600" />
                    <span>تماشا در یوتیوب</span>
                  </span>
                  <ArrowLeft className="size-3.5 shrink-0 transition-transform duration-200 group-hover:-translate-x-1" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Large Responsive Theater-Mode Video Popup Modal */}
      {activeVideo && (() => {
        const rawVideoId = activeVideo.videoId || activeVideo.youtubeUrl || activeVideo.id;
        const videoId = extractYouTubeVideoId(rawVideoId);
        const originParam =
          typeof window !== "undefined" && window.location?.origin
            ? `&origin=${encodeURIComponent(window.location.origin)}`
            : "";
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0${originParam}`;

        return (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`پخش ویدیوی ${activeVideo.title}`}
            onClick={() => setActiveVideoId(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          >
            {/* Modal Dialog Content Container */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative flex w-full max-w-4xl lg:max-w-5xl flex-col overflow-hidden rounded-2xl border border-border/80 bg-card text-card-foreground shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className="flex size-7 items-center justify-center rounded-full bg-red-600/10 text-red-600 shrink-0">
                    <YouTubeIcon className="size-4" />
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-foreground truncate">
                    {activeVideo.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveVideoId(null)}
                  aria-label={`بستن پلیر: ${activeVideo.title}`}
                  className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                  title="بستن پلیر"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Theater Mode Responsive IFrame Container (16:9 large view) */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={embedUrl}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="size-full border-0"
                />
              </div>

              {/* Modal Footer Controls */}
              <div className="flex flex-col gap-2.5 p-4 sm:p-5 bg-card/95 border-t border-border/60">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-semibold">
                      {activeVideo.tag}
                    </Badge>
                    <span>مدت زمان: {activeVideo.duration}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={activeVideo.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
                    >
                      <span>تماشا در خود یوتیوب</span>
                      <ExternalLink className="size-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setActiveVideoId(null)}
                      aria-label="بستن پلیر"
                      className="rounded-xl px-4 py-2 text-xs sm:text-sm font-medium border border-border/80 bg-muted/60 text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      بستن پلیر
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
}
