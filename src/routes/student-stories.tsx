import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/SiteLayout";
import { StudentStories } from "@/components/sections/StudentStories";
import { FinalCta } from "@/components/sections/FinalCta";

export const Route = createFileRoute("/student-stories")({
  head: () => ({
    meta: [
      { title: "Student Stories | ORVIONAR Tech Community" },
      {
        name: "description",
        content:
          "Read what ORVIONAR students share publicly on LinkedIn about their offer letters, internship experience and project work.",
      },
      { property: "og:title", content: "Student Stories | ORVIONAR Tech Community" },
      {
        property: "og:description",
        content: "Genuine, publicly shared posts from ORVIONAR students.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Student stories"
        title="Voices From Our Community"
        subtitle="Only genuine, publicly shared student posts are featured here."
      />
      <StudentStories />
      <FinalCta />
    </>
  );
}
