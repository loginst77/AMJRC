"use client";

import { useMemo, useState, type FC, type FormEvent } from "react";
import { isFilled, type Content, type ImageField, type KeyTextField } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";

import { Bounded } from "@/components/Bounded";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";

type SliceFields = {
  title?: KeyTextField;
  description?: KeyTextField;
  backgroundImage?: ImageField;
  buttonText?: KeyTextField;
};

type SubscribeToNewsletterProps = SliceComponentProps<Content.SubscribeToNewsletterSlice>;
type Status = "idle" | "submitting" | "error";

const SubscribeToNewsletter: FC<SubscribeToNewsletterProps> = ({ slice }) => {
  const primary = slice.primary as unknown as SliceFields;

  const title = primary.title || "Подпишитесь на рассылку";
  const description =
    primary.description ||
    "Будьте в курсе наших последних новостей и событий. Введите свой email ниже, чтобы подписаться.";
  const buttonLabel = primary.buttonText || "Подписаться";

  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ text: string; tone: "success" | "error" } | null>(null);

  const canSubmit = useMemo(() => /^\S+@\S+\.\S+$/.test(email.trim()) && status !== "submitting", [email, status]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("submitting");
    setMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setEmail("");
      setStatus("idle");
      setMessage({ text: "Вы успешно подписались на рассылку!", tone: "success" });
    } catch {
      setStatus("error");
      setMessage({ text: "Что-то пошло не так. Попробуйте снова.", tone: "error" });
    }
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative w-full overflow-hidden"
    >
      {isFilled.image(primary.backgroundImage) ? (
        <>
          <PrismicNextImage
            field={primary.backgroundImage}
            fill
            priority
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/65" />
        </>
      ) : (
        <div className="absolute inset-0 bg-zinc-900" />
      )}

      <Bounded as="div" yPadding="sm" className="relative z-10 px-4 sm:px-6">
        <div className="flex flex-col items-center gap-8 text-center sm:gap-9">
          <SectionHeader
            title={title}
            description={description}
            tone="dark"
            align="center"
            descriptionClassName="leading-relaxed"
          />

          <form
            onSubmit={onSubmit}
            className="flex w-full max-w-xl flex-col gap-3 rounded-2xl bg-white/10 sm:p-1 p-2 backdrop-blur-sm sm:flex-row sm:items-center sm:gap-2 sm:rounded-full"
          >
            <label className="sr-only" htmlFor="newsletter-email">
              Email
            </label>
            <input
              id="newsletter-email"
              className="h-16 w-full flex-1 rounded-full border border-white/20 bg-white/10 px-5 text-white outline-none ring-0 placeholder:text-zinc-400 focus:border-white/40 backdrop-blur-sm min-h-16 sm:min-w-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
              required
            />
            <Button
              type="submit"
              className="h-16 shrink-0 px-6 rounded-full sm:px-8"
              size="md"
              disabled={!canSubmit}
            >
              {status === "submitting" ? "Отправка..." : buttonLabel}
            </Button>
          </form>

          {message ? (
            <p
              className={
                message.tone === "success"
                  ? "text-sm font-medium text-emerald-300"
                  : "text-sm font-medium text-red-300"
              }
            >
              {message.text}
            </p>
          ) : null}
        </div>
      </Bounded>
    </section>
  );
};

export default SubscribeToNewsletter;
