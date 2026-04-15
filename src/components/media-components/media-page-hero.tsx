import Link from "next/link";
import { Container } from "@/components/ui/container";

type MediaPageHeroProps = {
  title: string;
  description?: string;
};

export function MediaPageHero({ title, description }: MediaPageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-zinc-50 py-10 border-b">
      <Container className="relative z-10">
        <div className="max-w-2xl space-y-3">
          <nav className="text-sm text-zinc-500">
            <Link href="/" className="transition-colors hover:text-zinc-900">
              Главная
            </Link>
            <span className="mx-2 text-zinc-300">/</span>
            <Link href="/media" className="transition-colors hover:text-zinc-900">
              Медия
            </Link>
            <span className="mx-2 text-zinc-300">/</span>
            <span className="text-zinc-900">{title}</span>
          </nav>
          <div className="">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">{title}</h1>
          </div>
        </div>
      </Container>
    </section>
  );
}
