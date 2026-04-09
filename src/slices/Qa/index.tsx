"use client";

import { FC, useState } from "react";
import { Content, isFilled, type KeyTextField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { ChevronDown } from "lucide-react";

import { Bounded } from "@/components/Bounded";
import { SectionHeader } from "@/components/SectionHeader";

type QaProps = SliceComponentProps<Content.QaSlice>;

type QaPrimaryFields = {
  title?: KeyTextField;
  description?: KeyTextField;
};

type QaItemFields = {
  question?: KeyTextField;
  answer?: KeyTextField;
};

type QaItem = {
  question: string;
  answer: string;
};

const FALLBACK_TITLE = "Частые вопросы";
const FALLBACK_DESCRIPTION = "Ответы на то, что мы слышим чаще всего от новых гостей и друзей общины.";
const FALLBACK_ITEMS: QaItem[] = [
  {
    question: "Как выглядит ваше воскресное собрание?",
    answer: "Мы начинаем с совместного поклонения, продолжаем изучением Писания и завершаем молитвой и общением за чашкой кофе.",
  },
  {
    question: "Можно ли прийти с детьми?",
    answer: "Да! У нас есть программы и наставники для детей и подростков, а также уютное место для родителей с малышами.",
  },
  {
    question: "Нужно ли регистрироваться заранее?",
    answer:
      "Регистрация не обязательна, но если вы заполните форму на сайте, мы подготовим для вас приветственный набор и поможем с парковкой.",
  },
];

function QaAccordionItem({ item }: { item: QaItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="cursor-pointer border-b border-zinc-200 px-6 py-4 transition-colors hover:bg-blue-50 last:border-b-0 sm:px-8 sm:py-6"
      onClick={() => setOpen((o) => !o)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setOpen((o) => !o);
        }
      }}>
      <div className="flex w-full items-center justify-between gap-4 py-3 text-left text-base font-semibold text-zinc-950">
        <span>{item.question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-zinc-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </div>
      <div className={`grid transition-all duration-200 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className="pb-5 text-sm leading-relaxed text-zinc-600">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

const Qa: FC<QaProps> = ({ slice }) => {
  const primary = slice.primary as unknown as QaPrimaryFields;
  const items = (slice.items as unknown as QaItemFields[]) || [];

  const normalizedItems: QaItem[] = items
    .map(({ question, answer }) => ({
      question: isFilled.keyText(question) ? question : undefined,
      answer: isFilled.keyText(answer) ? answer : undefined,
    }))
    .filter((item): item is QaItem => Boolean(item.question && item.answer))
    .map(({ question, answer }) => ({ question, answer }))
    .slice(0, 6);

  const qaItems = normalizedItems.length ? normalizedItems : FALLBACK_ITEMS;
  const title = primary.title && isFilled.keyText(primary.title) ? primary.title : FALLBACK_TITLE;
  const description = primary.description && isFilled.keyText(primary.description) ? primary.description : FALLBACK_DESCRIPTION;

  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} className="border-t border-zinc-200 bg-white">
      <Bounded as="div" yPadding="base">
        <div
          className="rounded-3xl border border-zinc-200 bg-white shadow-[var(--shadow-secondary)] overflow-hidden"
          style={{ boxShadow: "var(--shadow-secondary)" }}>
          <div className="border-b border-zinc-200 px-6 py-8 sm:px-8">
            <SectionHeader
              title={title}
              description={description}
              tone="light"
              align="left"
              size="sm"
              className="gap-3 max-w-3xl"
              descriptionClassName="leading-relaxed text-base"
            />
          </div>

          <div>
            {qaItems.map((item) => (
              <QaAccordionItem key={item.question} item={item} />
            ))}
          </div>
        </div>
      </Bounded>
    </section>
  );
};

export default Qa;
