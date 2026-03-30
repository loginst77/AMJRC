"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { asLink, type Content, type ImageField, type KeyTextField, type LinkField, type TimestampField, isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";
import { ArrowRight, Calendar, Clock, MapPin, type LucideIcon } from "lucide-react";

import { Bounded } from "@/components/Bounded";
import { SectionHeader } from "@/components/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

type BigEventFields = {
  label?: KeyTextField;
  title?: KeyTextField;
  summary?: KeyTextField;
  date?: KeyTextField;
  time?: KeyTextField;
  location?: KeyTextField;
  countdownTarget?: TimestampField;
  backgroundImage?: ImageField;
  primaryButtonText?: KeyTextField;
  primaryButtonLink?: LinkField;
  secondaryButtonText?: KeyTextField;
  secondaryButtonLink?: LinkField;
};

type BigEventProps = SliceComponentProps<Content.BigEventSlice>;

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const DAY_IN_MS = 86_400_000;

const calculateTimeLeft = (targetDate: Date | null): TimeLeft => {
  if (!targetDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const difference = targetDate.getTime() - Date.now();
  const remaining = Math.max(difference, 0);

  return {
    days: Math.floor(remaining / DAY_IN_MS),
    hours: Math.floor((remaining / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((remaining / (1000 * 60)) % 60),
    seconds: Math.floor((remaining / 1000) % 60),
  };
};

const BigEvent: FC<BigEventProps> = ({ slice }) => {
  const primary = slice.primary as unknown as BigEventFields;

  const targetDate = useMemo(() => {
    if (primary.countdownTarget) {
      const parsed = new Date(primary.countdownTarget as unknown as string);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return null;
  }, [primary.countdownTarget]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    if (!targetDate) return;
    const update = () => setTimeLeft(calculateTimeLeft(targetDate));

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [targetDate]);

  const label = primary.label || "Следующее событие";
  const title = primary.title || "Мы готовим новое событие";
  const summary = primary.summary || "Скоро поделимся подробностями о месте, времени и формате встречи.";
  const eventDate = primary.date || "Дата уточняется";
  const eventTime = primary.time || "Время уточняется";
  const eventLocation = primary.location || "Место будет объявлено";
  const locationDisplay = eventLocation?.trim() || "Место будет объявлено";

  const primaryButtonHref = primary.primaryButtonLink ? asLink(primary.primaryButtonLink) : null;
  const secondaryButtonHref = primary.secondaryButtonLink ? asLink(primary.secondaryButtonLink) : null;

  const hasPrimaryCta = isFilled.keyText(primary.primaryButtonText) && isFilled.link(primary.primaryButtonLink) && !!primaryButtonHref;
  const hasSecondaryCta =
    isFilled.keyText(primary.secondaryButtonText) && isFilled.link(primary.secondaryButtonLink) && !!secondaryButtonHref;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative overflow-hidden border-t border-zinc-200 bg-zinc-950 text-white dark:border-zinc-800">
      {isFilled.image(primary.backgroundImage) && (
        <PrismicNextImage field={primary.backgroundImage} fill priority className="z-0 object-cover" />
      )}

      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.08),_transparent_55%)]" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-zinc-700/30 via-zinc-950/85 to-zinc-950" />
      <div className="absolute inset-x-0 -top-32 z-0 h-80 bg-gradient-to-br from-blue-500/10 via-cyan-400/5 to-purple-500/10 blur-3xl" />

      <Bounded as="section" yPadding="base" className="relative z-10">
        <div className="flex flex-col gap-12 lg:gap-16">
          <div className="flex flex-col items-center space-y-6 text-center lg:items-start lg:text-left">
            <Badge variant="filled" className="!bg-white !text-zinc-900">
              {label}
            </Badge>
            <SectionHeader
              title={title}
              description={summary}
              align="center"
              className="w-full lg:max-w-2xl lg:items-start lg:text-left"
              titleClassName="text-white"
              descriptionClassName="text-zinc-300"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
            <div className="flex flex-col justify-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <DetailRow icon={Calendar} text={eventDate} />
              <DetailRow icon={Clock} text={eventTime} />
              <DetailRow icon={MapPin} text={locationDisplay} />
            </div>

            {targetDate && (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm lg:px-12">
                <div className="grid w-full max-w-lg grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
                  <TimeUnit value={timeLeft.days} label="Дней" />
                  <TimeUnit value={timeLeft.hours} label="Часов" />
                  <TimeUnit value={timeLeft.minutes} label="Минут" />
                  <TimeUnit value={timeLeft.seconds} label="Секунд" />
                </div>
              </div>
            )}
          </div>

          {(hasPrimaryCta || hasSecondaryCta) && (
            <div className="flex flex-wrap gap-4">
              {hasPrimaryCta && (
                <ButtonLink href={primaryButtonHref!} variant="primary" size="lg" className="group">
                  {primary.primaryButtonText}
                </ButtonLink>
              )}
              {hasSecondaryCta && (
                <ButtonLink href={secondaryButtonHref!} variant="filled" size="lg" className="group">
                  {primary.secondaryButtonText}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </ButtonLink>
              )}
            </div>
          )}
        </div>
      </Bounded>
    </section>
  );
};

function TimeUnit({ value, label }: { value: number; label: string }) {
  const paddedValue = value < 10 ? `0${value}` : `${value}`;

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-900/80 shadow-inner ring-1 ring-white/10 sm:h-24 sm:w-24">
        <span className="text-3xl font-bold font-mono tracking-tighter text-white sm:text-4xl" suppressHydrationWarning>
          {paddedValue}
        </span>
      </div>
      <span className="text-xs font-medium uppercase tracking-widest text-zinc-400 sm:text-sm">{label}</span>
    </div>
  );
}

function DetailRow({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-center gap-4 text-lg text-zinc-300">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-inner">
        <Icon className="h-5 w-5 text-blue-400" aria-hidden={true} />
      </div>
      <span className="max-w-[320px] truncate sm:max-w-none">{text}</span>
    </div>
  );
}

export default BigEvent;
