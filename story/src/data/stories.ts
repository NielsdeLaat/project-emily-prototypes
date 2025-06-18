export interface StorySegment {
  id: number;
  title: string;
  videoUrl: string;
  subtitles: Array<{
    startTime: number;
    endTime: number;
    text: string;
  }>;
}

export interface Story {
  id: number;
  title: string;
  segments: StorySegment[];
}

export const stories: Story[] = [
  {
    id: 1,
    title: "Demonstraties in Hongkong",
    segments: [
      {
        id: 1,
        title: "Geschiedenis van Hong Kong",
        videoUrl: "/videos/hongkong.mp4",
        subtitles: [
          {
            startTime: 0,
            endTime: 3,
            text: "Hongkong hoort bij China, maar had jarenlang een eigen bestuur en wetten.",
          },
          {
            startTime: 3,
            endTime: 6,
            text: "Tot 1997 was het een Britse kolonie met westerse vrijheden.",
          },
          {
            startTime: 6,
            endTime: 11,
            text: "China beloofde: vijftig jaar lang blijven persvrijheid en rechtspraak beschermd.",
          },
        ],
      },
      {
        id: 2,
        title: "Protesteren voor vrijheid",
        videoUrl: "/videos/demonstrations.mp4",
        subtitles: [
          {
            startTime: 0,
            endTime: 6,
            text: "In 2019 wilde China verdachten uit Hongkong kunnen uitleveren aan het vasteland.",
          },
          {
            startTime: 6,
            endTime: 12,
            text: "Veel mensen vreesden oneerlijke processen en verlies van hun vrijheid en rechten.",
          },
          {
            startTime: 12,
            endTime: 17,
            text: "Miljoenen jongeren, ouders en ouderen protesteerden wekenlang in de straten van Hongkong.",
          },
        ],
      },
      {
        id: 3,
        title: "Reactie van China",
        videoUrl: "/videos/police.mp4",
        subtitles: [
          {
            startTime: 0,
            endTime: 5,
            text: "De protesten werden met geweld neergeslagen en tientallen leiders werden opgepakt.",
          },
          {
            startTime: 5,
            endTime: 10,
            text: "In 2020 kwam een nieuwe wet die protest, kritiek en meningen strafbaar maakte.",
          },
          {
            startTime: 10,
            endTime: 14,
            text: "Kranten sloten, partijen verdwenen, en duizenden activisten vluchtten naar het buitenland.",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Climate Change",
    segments: [
      {
        id: 1,
        title: "Global Warming",
        videoUrl: "/videos/climate1.mp4",
        subtitles: [
          {
            startTime: 0,
            endTime: 4,
            text: "The Earth's temperature is rising at an unprecedented rate.",
          },
          {
            startTime: 4,
            endTime: 8,
            text: "Scientists warn of dire consequences if we don't act now.",
          },
          {
            startTime: 8,
            endTime: 12,
            text: "The evidence is clear and undeniable.",
          },
        ],
      },
      {
        id: 2,
        title: "Impact",
        videoUrl: "/videos/climate2.mp4",
        subtitles: [
          {
            startTime: 0,
            endTime: 5,
            text: "Rising sea levels threaten coastal communities.",
          },
          {
            startTime: 5,
            endTime: 10,
            text: "Extreme weather events become more frequent and intense.",
          },
          {
            startTime: 10,
            endTime: 15,
            text: "Ecosystems struggle to adapt to rapid changes.",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Technology Revolution",
    segments: [
      {
        id: 1,
        title: "AI Development",
        videoUrl: "/videos/tech1.mp4",
        subtitles: [
          {
            startTime: 0,
            endTime: 4,
            text: "Artificial Intelligence is transforming our world.",
          },
          {
            startTime: 4,
            endTime: 8,
            text: "From healthcare to transportation, AI is everywhere.",
          },
          {
            startTime: 8,
            endTime: 12,
            text: "The possibilities seem endless.",
          },
        ],
      },
      {
        id: 2,
        title: "Future Impact",
        videoUrl: "/videos/tech2.mp4",
        subtitles: [
          {
            startTime: 0,
            endTime: 5,
            text: "How will AI shape our future?",
          },
          {
            startTime: 5,
            endTime: 10,
            text: "The ethical implications are profound.",
          },
          {
            startTime: 10,
            endTime: 15,
            text: "We must navigate this revolution carefully.",
          },
        ],
      },
    ],
  },
];
