"use client";

import { FC, forwardRef, useMemo, useState } from "react";
import { Content, isFilled, type ImageField, type KeyTextField, type SelectField } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

type FormProps = SliceComponentProps<Content.FormSlice>;

type FieldVisibility = "Hidden" | "optional" | "required";

type FormPrimary = {
  title?: KeyTextField;
  description?: KeyTextField;
  buttonText?: KeyTextField;
  image?: ImageField;
  excelWebhookUrl?: KeyTextField;
  phoneField?: SelectField<FieldVisibility>;
  messageField?: SelectField<FieldVisibility>;
};

type FormItem = {
  fieldLabel?: KeyTextField;
  fieldType?: SelectField<"text" | "select" | "radio" | "checkbox" | "file">;
  fieldRequired?: boolean;
  fieldOptions?: KeyTextField;
};

type Status = "idle" | "submitting" | "error";

const inputClasses =
  "h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-zinc-950 outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400";

const PhoneNumberInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
  <input ref={ref} {...props} maxLength={15} />
));
PhoneNumberInput.displayName = "PhoneNumberInput";

function SelectDropdown({ value, options, onChange }: { value: string; options: string[]; onChange: (val: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex h-12 w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 text-zinc-950 outline-none transition-colors hover:border-zinc-300 focus:border-zinc-400">
        <span className={value ? "text-zinc-950" : "text-zinc-400"}>{value || "Выберите..."}</span>
        <ChevronDown className="h-4 w-4 opacity-50" strokeWidth={2} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 z-50 mt-1 w-full rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl">
            {options.map((opt) => (
              <li
                key={opt}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(opt);
                  setOpen(false);
                }}
                className={`flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm transition-colors hover:bg-zinc-100 ${
                  value === opt ? "font-medium text-zinc-900" : "text-zinc-600"
                }`}>
                {opt}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

const Form: FC<FormProps> = ({ slice }) => {
  const primary = slice.primary as unknown as FormPrimary;
  const items = (slice.items ?? []) as unknown as FormItem[];

  const title = primary.title || "Свяжитесь с нами";
  const description =
    primary.description || "Есть вопрос, просьба о молитве или хотите спланировать визит? Напишите нам — мы ответим как можно скорее.";
  const buttonText = primary.buttonText || "Отправить сообщение";
  const webhookUrl = primary.excelWebhookUrl;
  const phoneVisibility: FieldVisibility = (primary.phoneField?.trim() as FieldVisibility) || "Hidden";
  const messageVisibility: FieldVisibility = (primary.messageField?.trim() as FieldVisibility) || "Hidden";
  const hasImage = slice.variation === "default" && isFilled.image(primary.image);

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({ name: "", email: "", phone: "", message: "" });

  const updateField = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const canSubmit = useMemo(() => {
    if (status === "submitting") return false;
    if (form.name.trim().length < 2) return false;
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return false;
    if (phoneVisibility === "required" && !form.phone?.trim()) return false;
    if (messageVisibility === "required" && (form.message?.trim().length ?? 0) < 10) return false;

    for (const item of items) {
      if (item.fieldRequired && item.fieldLabel) {
        const key = item.fieldLabel;
        if (!form[key]?.trim()) return false;
      }
    }

    return true;
  }, [form, status, phoneVisibility, messageVisibility, items]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    setSuccess(null);

    const url = webhookUrl || "/api/contact";

    const isGoogleScript = url.includes("script.google.com");

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: isGoogleScript ? {} : { "content-type": "application/json" },
        body: JSON.stringify(form),
        ...(isGoogleScript ? { mode: "no-cors" as const } : {}),
      });

      if (!isGoogleScript && !res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Что-то пошло не так. Попробуйте снова.");
      }

      const resetForm: Record<string, string> = { name: "", email: "", phone: "", message: "" };
      for (const item of items) {
        if (item.fieldLabel) resetForm[item.fieldLabel] = "";
      }
      setForm(resetForm);
      setStatus("idle");
      setSuccess("Сообщение отправлено! Мы скоро свяжемся.");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Что-то пошло не так.");
    }
  }

  function parseOptions(optionsStr?: string | null): string[] {
    if (!optionsStr) return [];
    return optionsStr
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);
  }

  function renderDynamicField(item: FormItem, index: number) {
    const label = item.fieldLabel || `Field ${index + 1}`;
    const type = item.fieldType || "text";
    const required = item.fieldRequired ?? false;
    const options = parseOptions(item.fieldOptions);
    const value = form[label] ?? "";

    const labelEl = (
      <div className="font-medium text-zinc-900">
        {label} {required && <span className="text-red-500">*</span>}
      </div>
    );

    if (type === "select") {
      return (
        <div key={index} className={`block space-y-2 text-sm ${!hasImage ? "max-w-[50%]" : ""}`}>
          {labelEl}
          <SelectDropdown value={value} options={options} onChange={(val) => updateField(label, val)} />
        </div>
      );
    }

    if (type === "radio") {
      return (
        <fieldset key={index} className="space-y-2 text-sm">
          <legend className="font-medium text-zinc-900">
            {label} {required && <span className="text-red-500">*</span>}
          </legend>
          <div className="flex flex-wrap gap-4">
            {options.map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`field-${index}`}
                  value={opt}
                  checked={value === opt}
                  onChange={() => updateField(label, opt)}
                  required={required}
                  className="accent-zinc-900"
                />
                {opt}
              </label>
            ))}
          </div>
        </fieldset>
      );
    }

    if (type === "checkbox") {
      return (
        <fieldset key={index} className="space-y-2 text-sm">
          <legend className="font-medium text-zinc-900">
            {label} {required && <span className="text-red-500">*</span>}
          </legend>
          <div className="flex flex-wrap gap-4">
            {options.length > 0 ?
              options.map((opt) => {
                const selected = value.split(", ").filter(Boolean);
                const checked = selected.includes(opt);
                return (
                  <label key={opt} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={opt}
                      checked={checked}
                      onChange={() => {
                        const next = checked ? selected.filter((s) => s !== opt) : [...selected, opt];
                        updateField(label, next.join(", "));
                      }}
                      className="accent-zinc-900"
                    />
                    {opt}
                  </label>
                );
              })
            : <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={value === "true"}
                  onChange={(e) => updateField(label, e.target.checked ? "true" : "")}
                  required={required}
                  className="accent-zinc-900"
                />
                {label}
              </label>
            }
          </div>
        </fieldset>
      );
    }

    if (type === "file") {
      return (
        <label key={index} className="block space-y-2 text-sm">
          {labelEl}
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              updateField(label, file?.name ?? "");
            }}
            required={required}
            className="block w-full text-sm text-zinc-500 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-200"
          />
        </label>
      );
    }

    // Default: text input
    return (
      <label key={index} className="block space-y-2 text-sm">
        {labelEl}
        <input
          className={inputClasses}
          value={value}
          onChange={(e) => updateField(label, e.target.value)}
          placeholder={label}
          required={required}
        />
      </label>
    );
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
            onChange={(e) => updateField("name", e.target.value)}
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
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
            required
          />
        </label>
      </div>

      {phoneVisibility !== "Hidden" && (
        <div className="block space-y-2 text-sm">
          <div className="font-medium text-zinc-900">
            Телефон {phoneVisibility === "required" && <span className="text-red-500">*</span>}
          </div>
          <PhoneInput
            international
            defaultCountry="US"
            countryCallingCodeEditable={false}
            value={form.phone || "+1"}
            onChange={(val) => updateField("phone", val ?? "")}
            inputComponent={PhoneNumberInput}
            className="phone-input"
          />
        </div>
      )}

      {items.map((item, i) => renderDynamicField(item, i))}

      {messageVisibility !== "Hidden" && (
        <label className="block space-y-2 overflow-hidden text-sm">
          <div className="font-medium text-zinc-900">
            Сообщение {messageVisibility === "required" && <span className="text-red-500">*</span>}
          </div>
          <textarea
            className="box-border block min-h-[120px] max-h-[220px] w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-950 outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400"
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            placeholder="Как мы можем помочь?"
            required={messageVisibility === "required"}
          />
        </label>
      )}

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
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} className="bg-white py-20 md:py-28">
      <Container>
        <div
          className={`mx-auto overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[var(--shadow-secondary)]`}
          style={{ boxShadow: "var(--shadow-secondary)" }}>
          {hasImage ?
            <div className="grid lg:grid-cols-2">
              <div className="p-8 sm:p-10">{formContent}</div>
              <div className="relative hidden lg:block">
                <PrismicNextImage field={primary.image!} fill className="absolute inset-0 h-full w-full object-cover" alt="" />
              </div>
            </div>
          : <div className="p-8 sm:p-10">{formContent}</div>}
        </div>
      </Container>
    </section>
  );
};

export default Form;
