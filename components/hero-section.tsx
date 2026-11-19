import * as React from "react";
import { SiteConfig, siteConfig as defaultSiteConfig } from "@/lib/site-config";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TelegramIcon } from "@/components/icons";
import { YouTubeSubscribeButton } from "@/components/youtube-subscribe-button";

export interface HeroSectionProps {
  config?: SiteConfig;
  className?: string;
}

export function HeroSection({
  config = defaultSiteConfig,
  className = "",
}: HeroSectionProps) {
  return (
    <section
      aria-label="بخش معرفی اصلی"
      className={`relative flex w-full flex-col items-center text-center pt-8 pb-12 sm:pt-14 sm:pb-16 ${className}`}
    >
      {/* Ambient background bloom behind avatar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 start-1/2 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-brand/15 blur-3xl opacity-80"
      />

      {/* Avatar Container with glowing ring */}
      <div className="relative mb-6 group">
        <div
          aria-hidden="true"
          className="absolute -inset-1 rounded-full bg-gradient-to-tr from-brand/30 via-accent/40 to-primary/20 blur-md opacity-70 transition duration-300 group-hover:opacity-100"
        />
        <Avatar
          src={config.avatar.src}
          alt={config.avatar.alt}
          fallbackText={config.avatar.fallbackText}
          size="2xl"
          className="relative ring-4 ring-background shadow-lg"
        />
      </div>

      {/* Identity Typography */}
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3">
        <h1
          id="hero-title"
          className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl leading-[1.3] sm:leading-[1.2]"
        >
          {config.name}
        </h1>

        <p className="text-base font-medium text-foreground/85 sm:text-lg">
          {config.title}
        </p>

        <p className="mt-1 text-sm text-muted-foreground sm:text-base leading-relaxed max-w-xl">
          {config.bio}
        </p>
      </div>

      {/* Primary Action Buttons (YouTube & Telegram) */}
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
        {/* Interactive YouTube Subscribe CTA */}
        <YouTubeSubscribeButton
          channelId={config.socials?.youtube?.channelId || "UC41IeMVmX2vUWKENtGb7ewQ"}
          channelHandle={config.socials?.youtube?.handle || "amirkahdouii"}
          fallbackHref={config.primaryCta.href}
          fallbackLabel={config.primaryCta.label}
        />

        {/* Telegram Secondary CTA */}
        <Button
          href={config.secondaryCta.href}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          size="lg"
          className="w-full max-w-xs sm:max-w-none sm:w-auto min-w-[200px] border-border bg-card/70 hover:bg-sky-500/10 hover:text-sky-600 hover:border-sky-500/40 text-foreground shadow-sm gap-2.5 rounded-full px-6"
        >
          <TelegramIcon className="size-4 shrink-0 text-sky-500" />
          <span>{config.secondaryCta.label}</span>
        </Button>
      </div>
    </section>
  );
}
