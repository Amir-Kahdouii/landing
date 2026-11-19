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

  if (!videos || videos.length === 0) {
    return null;
  }

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
        {videos.map((video) => {
          const isPlaying = activeVideoId === video.id;
          const rawVideoId = video.videoId || video.youtubeUrl || video.id;
          const videoId = extractYouTubeVideoId(rawVideoId);

          const originParam =
            typeof window !== "undefined" && window.location?.origin
              ? `&origin=${encodeURIComponent(window.location.origin)}`
              : "";
          const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0${originParam}`;

          return (
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
                {/* Video Media Area (IFrame when playing, Thumbnail Facade otherwise) */}
                <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl bg-neutral-900">
                  {isPlaying ? (
                    <div className="relative size-full">
                      <iframe
                        src={embedUrl}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                        className="size-full border-0"
                      />
                      <button
                        type="button"
                        onClick={() => setActiveVideoId(null)}
                        aria-label={`توقف پخش ویدیوی ${video.title}`}
                        className="absolute top-2 start-2 z-20 flex size-7 items-center justify-center rounded-full bg-black/80 text-white/80 hover:text-white hover:bg-black transition-colors backdrop-blur-md"
                        title="بستن پلیر"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
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
                  )}
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

                {/* Helpful fallback banner when player is active in case of VPN bot verification */}
                {isPlaying && (
                  <div className="px-5 pb-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/30 rounded-lg p-2.5 border border-border/40">
                      <span>در صورت خطای تأیید ربات (فیلترشکن):</span>
                      <a
                        href={video.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-500 hover:text-red-600 font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        <span>تماشا در یوتیوب</span>
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons in Footer: Play in-page or Watch on YouTube */}
              <CardFooter className="p-5 pt-4">
                <div className="flex w-full items-center gap-2.5">
                  {/* Inline Play/Close Button */}
                  <button
                    type="button"
                    onClick={() => setActiveVideoId(isPlaying ? null : video.id)}
                    aria-label={isPlaying ? `بستن پلیر: ${video.title}` : `پخش در صفحه: ${video.title}`}
                    className={cn(
                      "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium",
                      "transition-all duration-200 cursor-pointer shadow-xs",
                      isPlaying
                        ? "border border-red-500/40 bg-red-500/10 text-red-600 hover:bg-red-500/20"
                        : "border border-border/70 bg-card/60 text-foreground hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-600"
                    )}
                  >
                    {isPlaying ? (
                      <>
                        <span className="size-2 rounded-full bg-red-600 animate-pulse" />
                        <span>بستن پلیر</span>
                      </>
                    ) : (
                      <>
                        <Play className="size-3.5 fill-current shrink-0 text-red-600" />
                        <span>پخش در صفحه</span>
                      </>
                    )}
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
          );
        })}
      </div>
    </section>
  );
}
