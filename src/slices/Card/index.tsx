"use client";

import { FC } from "react";
import { asLink, Content, isFilled, type ImageField, type KeyTextField, type LinkField } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { cardHoverCn } from "@/lib/variants";

export type CardProps = SliceComponentProps<Content.CardSlice>;

type CardPrimary = {
  label?: KeyTextField;
  title?: KeyTextField;
  description?: KeyTextField;
};

type CardItem = {
  image?: ImageField;
  description?: KeyTextField;
  title?: KeyTextField;
  body?: KeyTextField;
  buttonLabel?: KeyTextField;
  buttonLink?: LinkField;
};

type CardDisplay = {
  image: ImageField | null | undefined;
  title: string | null;
  description: string | null;
  body: string | null;
  buttonLabel: string | null;
  href: string | null;
};

const FALLBACK_PRIMARY: CardPrimary = {
  label: null,
  title: "Во что мы верим",
  description:
    "Наша миссия — укреплять и объединять мессианские общины по всему лицу земли, нести Евангелие еврейскому народу и поддерживать верующих в их духовном росте и практическом служении.",
};

const FALLBACK_CARDS: CardDisplay[] = [
  {
    image: {
      url: "https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&q=80&w=800&h=400",
    } as ImageField,
    title: "Верность Священному Писанию",
    description: "Божье Слово — абсолютно непреложный фундамент нашей веры и жизни.",
    body: "Мы верим, что Библия — вдохновлённое Слово Бога. Мы строим служение и жизнь на её истинах, обучая каждое поколение жить по вере и благодати.",
    buttonLabel: "Узнать больше",
    href: null,
  },
  {
    image: {
      url: "https://images.unsplash.com/photo-1544928147-79a2dbc1f381?auto=format&fit=crop&q=80&w=800&h=400",
    } as ImageField,
    title: "Искренняя любовь к Израилю",
    description: "Наше сердце бьётся ради духовного возрождения Божьего народа.",
    body: "Мы верим в призвание еврейского народа. Наша цель — с любовью нести Благую Весть и поддерживать общины всем, чем можем.",
    buttonLabel: "Узнать больше",
    href: null,
  },
  {
    image: {
      url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800&h=400",
    } as ImageField,
    title: "Глобальное единство общин",
    description: "Разные континенты и страны, но одна семья во Христе.",
    body: "Истинная сила — в единстве. Мы делимся ресурсами и опытом, чтобы вместе служить Богу и отвечать на нужды мира.",
    buttonLabel: "Узнать больше",
    href: null,
  },
];

const Card: FC<CardProps> = ({ slice }) => {
  const primary = (slice.primary as unknown as CardPrimary) || {};
  const items = (slice.items as unknown as CardItem[]) || [];

  const label = isFilled.keyText(primary.label) ? primary.label : FALLBACK_PRIMARY.label;
  const title = isFilled.keyText(primary.title) ? primary.title : FALLBACK_PRIMARY.title;
  const description = isFilled.keyText(primary.description) ? primary.description : FALLBACK_PRIMARY.description;

  const normalized: CardDisplay[] = items
    .map((item) => {
      const hasImage = isFilled.image(item.image);
      const title = isFilled.keyText(item.title) ? item.title : null;
      const description = isFilled.keyText(item.description) ? item.description : null;
      const body = isFilled.keyText(item.body) ? item.body : null;
      const buttonLabel = isFilled.keyText(item.buttonLabel) ? item.buttonLabel : null;
      const href = item.buttonLink && isFilled.link(item.buttonLink) ? asLink(item.buttonLink) : null;
      return {
        image: hasImage ? item.image : null,
        title,
        description,
        body,
        buttonLabel,
        href: href ?? null,
      };
    })
    .filter((card) => card.title);

  const cards: CardDisplay[] = normalized.length ? normalized : FALLBACK_CARDS;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-white pb-16 pt-14 sm:pb-20 sm:pt-16 md:pb-28 md:pt-24 dark:bg-zinc-950">
      <Container>
        <div className="mx-auto w-full max-w-6xl space-y-10 sm:space-y-12">
          <div className="flex flex-col items-center space-y-4 text-center">
            {label ?
              <Badge variant="outline" size="lg">
                {label}
              </Badge>
            : null}
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">{title}</h2>
            {description ?
              <p className="mx-auto max-w-xl text-lg text-zinc-600 dark:text-zinc-400">{description}</p>
            : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {cards.slice(0, 6).map((card) => (
              <div
                key={card.title}
                className={cn(
                  "group flex h-full !overflow-hidden flex-col bg-zinc-50 dark:bg-zinc-900",
                  cardHoverCn,
                  !card.href && "!cursor-default",
                )}>
                <div className="relative h-48 w-full shrink-0 overflow-hidden bg-zinc-200 sm:h-56 md:h-72">
                  {(() => {
                    const img = card.image as ImageField | null | undefined;
                    const imgUrl = img?.url;
                    const hasDims = (img as any)?.dimensions;
                    const imageClass = "h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]";
                    if (!imgUrl) return null;
                    return hasDims ?
                        <PrismicNextImage field={img as any} fill className={imageClass} />
                      : <img src={imgUrl} alt={card.title || ""} className={imageClass} />;
                  })()}
                  <div className="absolute inset-0 z-10 rounded-t-3xl bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500 group-hover:backdrop-blur-sm" />
                  {card.description && (
                    <p className="absolute bottom-4 left-4 right-4 z-20 text-base font-medium leading-relaxed text-white sm:bottom-5 sm:left-5 sm:right-5 md:bottom-6 md:left-6 md:right-6 md:text-lg">
                      <Quote className="mr-1.5 inline-block -translate-y-0.5 text-blue-300" size={20} fill="currentColor" />
                      {card.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-1 flex-col px-5 pb-6 pt-5 sm:px-6 sm:pb-7 sm:pt-6 md:px-8 md:pb-8">
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-xl font-bold tracking-tight text-zinc-950 sm:text-2xl dark:text-white">{card.title}</h3>
                    {card.body && <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">{card.body}</p>}
                  </div>
                </div>

                {(card.buttonLabel || card.href) && (
                  <Link
                    href={card.href || "#"}
                    className="flex items-center border-t border-zinc-200 p-5 text-sm font-medium uppercase tracking-wide text-zinc-700 transition-colors group/button hover:bg-blue-100 sm:p-6 md:p-8 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800">
                    {card.buttonLabel || "Узнать больше"}{" "}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover/button:translate-x-1" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Card;
