import type { IconName } from "@/components/ui/Icon";

export type Subject = {
  key: string;
  name: string;
  blurb: string;
  icon: IconName;
};

const sharedBlurb = "HL / SL supported";

export const subjects: Subject[] = [
  { key: "economics", name: "Economics", blurb: sharedBlurb, icon: "chart" },
  { key: "geography", name: "Geography", blurb: sharedBlurb, icon: "clock" },
  { key: "english-b", name: "English B", blurb: sharedBlurb, icon: "check" },
  { key: "math-aa", name: "Math AA", blurb: sharedBlurb, icon: "checkCircle" },
  {
    key: "computer-science",
    name: "Computer Science",
    blurb: sharedBlurb,
    icon: "chart",
  },
  { key: "biology", name: "Biology", blurb: sharedBlurb, icon: "flame" },
  { key: "chemistry", name: "Chemistry", blurb: sharedBlurb, icon: "flame" },
  { key: "physics", name: "Physics", blurb: sharedBlurb, icon: "chart" },
];
