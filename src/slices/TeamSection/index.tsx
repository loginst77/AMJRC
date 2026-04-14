import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { Container } from "@/components/ui/container";
import { PersonCard } from "@/components/ui/person-card";
import { Badge } from "@/components/ui/badge";

/**
 * Props for `TeamSection`.
 */
export type TeamSectionProps = SliceComponentProps<Content.TeamSectionSlice>;

/**
 * Component for "TeamSection" Slices.
 */
const TeamSection: FC<TeamSectionProps> = ({ slice }) => {
  const prismicData: any = slice;

  return (
    <section id="team" className="bg-zinc-950/90 dark:bg-black" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <Container className="py-16 sm:py-20 md:py-28">
        <div className="space-y-3 text-center">
          {prismicData.primary?.badge && (
            <Badge variant="outline" size="lg" className="border-white/20 !text-white">
              {prismicData.primary.badge}
            </Badge>
          )}
          {prismicData.primary?.heading && (
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{prismicData.primary.heading}</h2>
          )}
          {prismicData.primary?.description && <p className="mx-auto max-w-xl text-lg text-zinc-300">{prismicData.primary.description}</p>}
        </div>

        {prismicData.items && prismicData.items.length > 0 && (
          <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 md:mt-12">
            {prismicData.items.map((l: any, idx: number) => (
              <PersonCard
                key={idx}
                name={l.name}
                role={l.role}
                imageSrc={l.image?.url}
                description={l.description}
                responsibilities={l.responsibilities}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

export default TeamSection;
