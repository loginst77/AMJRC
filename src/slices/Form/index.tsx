"use client";

import { FC, useMemo, useState } from "react";
import { Content, isFilled, type ImageField, type KeyTextField } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

type FormProps = SliceComponentProps<Content.FormSlice>;

type FormPrimary = {
  title?: KeyTextField;
  description?: KeyTextField;
  buttonText?: KeyTextField;
  image?: ImageField;
};

type Status = "idle" | "submitting" | "error";

const inputClasses =
  "h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-zinc-950 outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400";

const Form: FC<FormProps> = ({ slice }) => {
  const primary = slice.primary as unknown as FormPrimary;

  const title = primary.title || "Свяжитесь с нами";
  const description =
    primary.description ||
    "Есть вопрос, просьба о молитве или хотите спланировать визит? Напишите нам — мы ответим как можно скорее.";
  const buttonText = primary.buttonText || "Отправить сообщение";
  const hasImage = isFilled.image(primary.image);

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const canSubmit = useMemo(() => {
    const emailOk = /^\S+@\S+\.\S+$/.test(form.email.trim());
    return form.name.trim().length >= 2 && emailOk && form.message.trim().length >= 10 && status !== "submitting";
  }, [form.email, form.message, form.name, status]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Что-то пошло не так. Попробуйте снова.");
      }

      setForm({ name: "", email: "", message: "" });
      setStatus("idle");
      setSuccess("Сообщение отправлено! Мы скоро свяжемся.");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Что-то пошло не так.");
    }
  }

  const formContent = (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="mb-1 text-2xl font-semibold text-zinc-950">{title}</div>
      <p className="mb-6 text-zinc-600">{description}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm">
          <div className="font-medium text-zinc-900">
            Имя <span className="text-red-500">*</span>
          </div>
          <input
            className={inputClasses}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Ваше имя"
            autoComplete="name"
            required
          />
        </label>

        <label className="space-y-2 text-sm">
          <div className="font-medium text-zinc-900">
            Email <span className="text-red-500">*</span>
          </div>
          <input
            className={inputClasses}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
            required
          />
        </label>
      </div>

      <label className="block space-y-2 overflow-hidden text-sm">
        <div className="font-medium text-zinc-900">
          Сообщение <span className="text-red-500">*</span>
        </div>
        <textarea
          className="box-border block min-h-[120px] max-h-[220px] w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-950 outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400"
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="Как мы можем помочь?"
          required
        />
      </label>

      {status === "error" && (
        <p className="text-sm text-red-700" aria-live="polite">
          {error || "Что-то пошло не так."}
        </p>
      )}

      {success && (
        <p className="text-sm text-emerald-600" aria-live="polite">
          {success}
        </p>
      )}

      <Button type="submit" disabled={!canSubmit} className="mt-4" size="lg">
        {status === "submitting" ? "Отправка…" : buttonText}
      </Button>
    </form>
  );

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-white py-20 md:py-28"
    >
      <Container>
        <div
          className={`mx-auto overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[var(--shadow-secondary)]`}
          style={{ boxShadow: "var(--shadow-secondary)" }}
        >
          {hasImage ? (
            <div className="grid lg:grid-cols-2">
              <div className="p-8 sm:p-10">{formContent}</div>
              <div className="relative hidden lg:block">
                <PrismicNextImage
                  field={primary.image!}
                  fill
                  className="absolute inset-0 h-full w-full object-cover"
                  alt=""
                />
              </div>
            </div>
          ) : (
            <div className="p-8 sm:p-10">{formContent}</div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default Form;
